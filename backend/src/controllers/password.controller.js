import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { resetPasswordOTPTemplate } from "../utils/emailTemplates/resetPasswordOTP.template.js";
import sendEmail from "../utils/email.js";
import { checkOTPRateLimit } from "../utils/otpRateLimiter.js";

// Request OTP

export const requestPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Rate limit check 

    const rateLimit = checkOTPRateLimit(user) ; 

    if(!rateLimit.allowed){
      return res.status(429).json({ message: rateLimit.message });
    }

    // generating 6 digit OTP

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // set expiry (10 minutes)

    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = expiry;

    // Updating rate limit data 

    user.otpRequestCount += 1;
    user.lastOTPRequestAt = new Date();

    await user.save();

    // send OTP via email

    await sendEmail({
      to: user.email,
      subject: "Your Password Reset OTP",
      html: resetPasswordOTPTemplate({
        name: user.name, 
        otp, 
      })
    });

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Request OTP error:", error.response?.body || error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Validate OTP

export const validatePasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // OTP Validation 

    if (
      !user.resetPasswordOTP || 
      user.resetPasswordOTP !== otp ||
      !user.resetPasswordOTPExpires ||
      user.resetPasswordOTPExpires < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // OTP is valid -> respond success

    return res.status(200).json({
      message: "OTP validated successfully",
    });
  } catch (error) {
    console.error("Validate OTP error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reset password -> after OTP validation

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // hash new password

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // clearing OTP

    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: "Password reset successfully. You can now login." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
