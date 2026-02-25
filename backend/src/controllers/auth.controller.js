import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
// import { generateToken, generateRefreshToken } from "../utils/generateToken.js";
import chalk from "chalk";
import { createAuthSession } from "../services/authSession.service.js";
import sendEmail from "../utils/email.js";
import { inviteUserTemplate } from "../utils/emailTemplates/inviteUser.template.js";
import { generateRefreshToken, generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken" ; 

export const refreshAccessToken = async (req, res) => {
  try {
    if (!req.cookies?.refreshToken) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }

    // verify refresh token signature

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

    // Find user

    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Validate refresh token against DB

    const storedToken = user.refreshTokens.find(
      (rt) => rt.token === refreshToken && rt.expiresAt > new Date(),
    );

    if (!storedToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // Issue new access token

    const newAccessToken = generateToken(user._id, "15m");

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false, // true only in production HTTPS
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Access token refreshed",
    });
  } catch (error) {
    console.log("Refresh access token error: ", error);
    return res.status(401).json({ message: "Refresh failed" });
  }
};

export const inviteUser = async (req, res) => {
  try {
    const { email, department, role } = req.body;

    const inviteExpiryHours = Number(process.env.INVITE_EXPIRY_HOURS) || 24;

    // validating input

    if (!email || !role) {
      return res.status(400).json({
        message: "Email and role are required",
      });
    }

    const existingUser = await User.findOne({ email }); // checking if the user already exists

    if (existingUser) {
      // Already active user

      if (existingUser.status === "ACTIVE") {
        return res.status(409).json({
          code: "USER_ACTIVE",
          message: "User is already part of the system",
        });
      }

      // Already invited & invite still valid

      if (
        existingUser.status === "INVITED" &&
        existingUser.inviteExpiresAt > Date.now()
      ) {
        return res.status(429).json({
          code: "INVITE_ALREADY_SENT",
          message: "Invite already sent. Please wait before resending.",
        });
      }

      // Invited but expired -> regenerate

      if (
        existingUser.status === "INVITED" &&
        existingUser.inviteExpiresAt <= Date.now()
      ) {
        existingUser.inviteToken = crypto.randomBytes(32).toString("hex");
        existingUser.inviteExpiresAt =
          Date.now() + inviteExpiryHours * 60 * 60 * 1000;

        await existingUser.save();

        // send email again
        await sendInviteEmail(existingUser);

        return res.status(200).json({
          message: "Invite resent successfully",
        });
      }
    }

    const inviteToken = crypto.randomBytes(32).toString("hex"); // used as invite link token. One-time use and expires. Cryptographically secure. Generates 32 bytes of secure random data. toString("hex") converts it to readable string

    const user = await User.create({
      email,
      role,
      department,
      inviteToken,
      inviteExpiresAt: Date.now() + inviteExpiryHours * 60 * 60 * 1000,
      status: "INVITED",
    });

    // Generate the invite link and email HTML

    const inviteLink = `${process.env.FRONTEND_URL}/invite/accept?token=${inviteToken}`;
    const htmlContent = inviteUserTemplate({
      name: email,
      role,
      inviteLink,
    });

    // sending email using SendGrid

    await sendEmail({
      to: email,
      subject: "You're invited to join Your Company CRM",
      text: `Hi ${email}, You have been invited as ${role}. Use this link to join: ${inviteLink}`,
      html: htmlContent,
    });

    res.status(201).json({
      message: "Invite sent successfully",
    });
  } catch (error) {
    console.error(chalk.bold.red("Invite user error: ", error));

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const verifyInviteToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Invite token is required",
      });
    }

    const user = await User.findOne({
      inviteToken: token,
      inviteExpiresAt: { $gt: Date.now() },
      status: "INVITED",
    }).select("email role department");

    if (!user) {
      return res.status(400).json({
        message: "Invite link is invalid or expired",
      });
    }

    return res.status(200).json({
      message: "Invite verified",
      user,
    });
  } catch (error) {
    console.error("Verify invite error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, name } = req.body;

    // basic validation

    if (!token || !password) {
      return res.status(400).json({
        message: "Token, name and password are required",
      });
    }

    // finding invited user with valid token

    const user = await User.findOne({
      inviteToken: token,
      inviteExpiresAt: { $gt: Date.now() }, // token not expired
      status: "INVITED",
    });

    if (!user) {
      return res.status(400).json({
        message: "Invite link is invalid or expired",
      });
    }

    // hashing password securely

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    // Save name and activate user

    user.name = name;
    user.status = "ACTIVE";

    // destroying invite token (since one-time use)

    user.inviteToken = undefined;
    user.inviteExpiresAt = undefined;

    await user.save();

    return res.status(200).json({
      message: "Account activated successfully. You can now login",
    });
  } catch (error) {
    console.error("Accept invite error: ", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // basic validation

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Finding user (explicitly include password)

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // checking account status

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "Account is not active yet.",
      });
    }

    // Comparing password using bcrypt

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Single responsibility: create session

    const { accessToken, refreshToken, refreshTokenMaxAge } =
      await createAuthSession({ user, rememberMe });

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: refreshTokenMaxAge,
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          department: user.department,
        },
      });
  } catch (error) {
    console.error(chalk.bold.red("Admin login error: ", error));

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    // remove refresh token from DB

    if (refreshToken) {
      const user = await User.findOne({ "refreshTokens.token": refreshToken });

      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          (rt) => rt.token !== refreshToken,
        );
        await user.save();
      }
    }

    // Clearing http only cookies

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const user = await User.findById(req.user._id).select(
      "_id name email role department status createdAt",
    );

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get me error: ", error);
    res.status(401).json({
      message: "Server error",
    });
  }
};
