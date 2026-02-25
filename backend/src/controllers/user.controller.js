import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateRefreshToken, generateToken } from "../utils/generateToken.js";
import chalk from "chalk";

export const userLogin = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // basic validation

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // finding user, including password explicitly

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // only ACTIVE users can login

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        message: "Account is not active. Please accept the invite first.",
      });
    }

    // comparing password

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate tokens

    const refreshTokenMaxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000;

    const accessToken = generateToken(user._id, "15m");
    const refreshToken = generateRefreshToken(
      user._id,
      rememberMe ? "30d" : "1d",
    );

    // saving refresh token in DB

    user.refreshTokens = user.refreshTokens || [];

    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + refreshTokenMaxAge),
    });

    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true only in HTTPS
      sameSite: "lax", // "none" if different domains
      maxAge: refreshTokenMaxAge,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // responding with token and basic info

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error(chalk.red("User login error: ", error));
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user; // from auth middleware
    const updates = req.body;

    console.log("REQ.USER 👉", req.user);
    console.log("REQ.PARAMS 👉", req.params);
    console.log("REQ.BODY 👉", req.body);

    // User can update ONLY themselves

    if (requester._id.toString() !== id && requester.role !== "Super_Admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Role update rule

    if ("role" in updates) {
      if (requester.role !== "Super_Admin") {
        return res.status(403).json({
          message:
            "Only Super Admin can change roles. Ask your admin to do it for you.",
        });
      }
    }

    // email is never updateable

    delete updates.email;

    // execute update

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Update error: ", error);
    res.status(500).json({
      message: "Update failed",
    });
  }
};

// Fetch users for dropdown filters. - used for submitted by filter

export const getUsersForFilter = async (req, res) => {};

export const getUsersSearchableDropdown = async (req, res) => {
  try {
    const { type } = req.query;

    let roles = [];

    if (type === "submittedBy") {
      roles = ["Email_Executive", "Admin", "Super_Admin"];
    } else if (type === "assignTo") {
      roles = ["BDE_Executive"];
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid filter type",
      });
    }

    const allRoles = await User.distinct("role");

    const users = await User.find({
      role: { $in: roles },
      status: "ACTIVE",
    })
      .select("_id name role")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Fetch users error: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const getAllEmployee = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const employees = await User.find(query, {
      name: 1,
      email: 1,
      role: 1,
      department: 1,
      status: 1,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Get employees error: ", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};
