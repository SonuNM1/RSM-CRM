import User from "../models/user.model.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";
import bcrypt from "bcryptjs";

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

    // generating 6 digit OTP

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // set expiry (10 minutes)

    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = expiry;

    await user.save();

    // send OTP via email

    await sendEmail({
      to: user.email,
      subject: "Your Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Request OTP error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Resetting password 

export const resetPasswordWithOTP = async (req, res) => {
    try{
        
    }catch(error){

    }
}
