export const resetPasswordOTPTemplate = ({ name, otp }) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color:#f6f8fa; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
      
      <div style="text-align:center; margin-bottom:20px;">
        <img 
          src="https://yourcompany.com/logo.png" 
          alt="Company Logo" 
          width="140"
          style="margin-bottom:10px;"
        />
      </div>

      <h2 style="text-align:center; color:#2563eb;">
        Password Reset OTP
      </h2>

      <p style="font-size:15px;">Hi <strong>${name || "User"}</strong>,</p>

      <p style="font-size:15px;">
        You requested to reset your password. Please use the OTP below to continue:
      </p>

      <div style="text-align:center; margin:30px 0;">
        <span style="
          font-size:28px;
          letter-spacing:6px;
          font-weight:bold;
          color:#111827;
          background:#f3f4f6;
          padding:12px 24px;
          border-radius:6px;
          display:inline-block;
        ">
          ${otp}
        </span>
      </div>

      <p style="font-size:14px; color:#6b7280;">
        This OTP will expire in <strong>10 minutes</strong>.
      </p>

      <p style="font-size:14px; color:#6b7280;">
        If you did not request a password reset, you can safely ignore this email.
      </p>

      <hr style="margin:30px 0;" />

      <p style="text-align:center; font-size:12px; color:#9ca3af;">
        © ${new Date().getFullYear()} Relevant Search Media. All rights reserved.
      </p>

    </div>
  </div>
  `;
};
