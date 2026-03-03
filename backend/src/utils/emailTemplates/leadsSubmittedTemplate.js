export const leadsSubmittedTemplate = ({ employeeName, insertedCount, skippedCount, leads }) => {
  const leadRows = leads.map(l => `
    <tr>
      <td style="padding:8px;border:1px solid #eee">${l.name}</td>
      <td style="padding:8px;border:1px solid #eee">${l.email}</td>
      <td style="padding:8px;border:1px solid #eee">${l.website}</td>
    </tr>
  `).join('');

  return {
    subject: `${employeeName} submitted ${insertedCount} new lead${insertedCount !== 1 ? 's' : ''}`,
    html: `
      <div style="font-family: Arial, sans-serif; background:#f6f8fa; padding:30px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
          
          <div style="text-align:center; margin-bottom:20px;">
            <img src="https://yourcompany.com/logo.png" alt="Company Logo" width="140" />
          </div>

          <h2 style="text-align:center; color:#19B3A6;">New Leads Submitted</h2>

          <p>Hey there,</p>
          <p>
            <strong>${employeeName}</strong> just submitted <strong>${insertedCount}</strong> new lead${insertedCount !== 1 ? 's' : ''}.
            ${skippedCount > 0 ? `<br/><span style="color:#f59e0b">${skippedCount} duplicate(s) were skipped.</span>` : ''}
          </p>

          <table style="border-collapse:collapse;width:100%;margin-top:16px;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:8px;border:1px solid #eee;text-align:left">Name</th>
                <th style="padding:8px;border:1px solid #eee;text-align:left">Email</th>
                <th style="padding:8px;border:1px solid #eee;text-align:left">Website</th>
              </tr>
            </thead>
            <tbody>${leadRows}</tbody>
          </table>

          <p style="margin-top:16px; font-size:14px; color:#6b7280;">
            Log in to your dashboard to review and assign these leads.
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