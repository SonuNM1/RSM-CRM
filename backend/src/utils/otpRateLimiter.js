import {
  OTP_LIMIT,
  OTP_WINDOW,
  OTP_COOLDOWN
} from "../constants/otp.js";

export const checkOTPRateLimit = (user) => {

  const now = Date.now();

  //  Cooldown check (1 minute gap)

  if (
    user.lastOTPRequestAt &&
    now - user.lastOTPRequestAt.getTime() < OTP_COOLDOWN
  ) {
    return {
      allowed: false,
      message: "Please wait before requesting another OTP"
    };
  }

  //  Window reset - reset after 15 minutes 
  
  if (
    !user.otpRequestWindowStart ||
    now - user.otpRequestWindowStart.getTime() > OTP_WINDOW
  ) {
    user.otpRequestWindowStart = new Date(now);
    user.otpRequestCount = 0;

    // resetting cooldown timestamp as well 

    user.lastOTPRequestAt = null ; 
  }

  // Limit exceeded (max 3 OTPs)

  if (user.otpRequestCount >= OTP_LIMIT) {
    return {
      allowed: false,
      message: "OTP request limit exceeded. Try again later."
    };
  }

  return { allowed: true };
};
