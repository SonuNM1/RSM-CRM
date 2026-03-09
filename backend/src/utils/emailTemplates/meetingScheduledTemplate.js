export const meetingScheduledTemplate = ({ superAdminName, bdeName, leadName, website, meetingDateIST, note }) => {
  return {
    subject: `New Meeting Scheduled — ${leadName}`,
    html: `
      <div style="font-family: Arial, sans-serif; background:#f6f8fa; padding:30px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
          
          <div style="text-align:center; margin-bottom:20px;">
            <img src="https://yourcompany.com/logo.png" alt="Company Logo" width="140" />
          </div>

          <h2 style="text-align:center; color:#19B3A6;">New Meeting Scheduled</h2>

          <p>Hi ${superAdminName},</p>
          <p>
            <strong>${bdeName}</strong> has scheduled a meeting with a lead. Here are the details:
          </p>

          <table style="border-collapse:collapse; width:100%; margin-top:16px;">
            <tbody>
              <tr style="background:#f9f9f9;">
                <td style="padding:10px; border:1px solid #eee; font-weight:bold; color:#555; width:40%;">Lead Name</td>
                <td style="padding:10px; border:1px solid #eee;">${leadName}</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #eee; font-weight:bold; color:#555;">Website</td>
                <td style="padding:10px; border:1px solid #eee;">${website}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:10px; border:1px solid #eee; font-weight:bold; color:#555;">Meeting Date & Time</td>
                <td style="padding:10px; border:1px solid #eee;">${meetingDateIST}</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #eee; font-weight:bold; color:#555;">Scheduled By</td>
                <td style="padding:10px; border:1px solid #eee;">${bdeName}</td>
              </tr>
              ${note ? `
              <tr style="background:#f9f9f9;">
                <td style="padding:10px; border:1px solid #eee; font-weight:bold; color:#555;">Note</td>
                <td style="padding:10px; border:1px solid #eee;">${note}</td>
              </tr>` : ""}
            </tbody>
          </table>

          <p style="margin-top:20px; font-size:14px; color:#6b7280;">
            Please look forward to this meeting.
          </p>

          <hr style="margin:30px 0;" />
          <p style="text-align:center; font-size:12px; color:#9ca3af;">
            © ${new Date().getFullYear()} Relevant Search Media. All rights reserved.
          </p>
        </div>
      </div>
    `
  };
};