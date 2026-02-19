export const inviteUserTemplate = ({ name, role, inviteLink }) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f6f8fa; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
      
      <div style="text-align:center; margin-bottom:20px;">
        <img 
          src="https://yourcompany.com/logo.png" 
          alt="Company Logo" 
          width="140"
        />
      </div>

      <h2 style="text-align:center; color:#16a34a;">
        You’re Invited!
      </h2>

      <p>Hey there,</p>

      <p>
        You have been invited to join <strong>RSM CRM</strong> as
        <strong>${role}</strong>.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a 
          href="${inviteLink}"
          style="
            background:#2563eb;
            color:#ffffff;
            padding:12px 24px;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
          "
        >
          Accept Invitation
        </a>
      </div>

      <p style="font-size:14px; color:#6b7280;">
        This invitation link will expire in <strong>24 hours</strong>.
      </p>

      <p style="font-size:14px; color:#6b7280;">
        If you were not expecting this invite, you can ignore this email.
      </p>

      <hr style="margin:30px 0;" />

      <p style="text-align:center; font-size:12px; color:#9ca3af;">
        © ${new Date().getFullYear()} Relevant Search Media. All rights reserved.
      </p>
    </div>
  </div>
  `;
};
