import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateRefreshToken, generateToken } from "../utils/generateToken.js";
import chalk from "chalk";

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // saving refresh token in DB

    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push({ token: refreshToken });

    await user.save();

    // responding with token and basic info

    return res.status(200).json({
      message: "Login successful",
      token: accessToken, refreshToken, 
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

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body; // client sends refresh token

    if (!refreshToken)
      return res.status(400).json({
        message: "Refresh token is required",
      });

    // Verify refresh token

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

    // Find user and check if refresh token exists

    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokens.find((rt) => rt.token === refreshToken)) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new access token 

    const newAccessToken = jwt.sign(
        {userId: user._id}, 
        process.env.JWT_SECRET, 
        {
            expiresIn: "15m"
        }
    )

    res.status(200).json({
        accessToken: newAccessToken
    })

  } catch (error) {
    console.error("Refresh token error: ", error) ; 

    return res.status(401).json({
        message: "Invalid or expired refresh token"
    })
  }
};
