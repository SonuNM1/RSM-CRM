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
      <h2>New Leads Submitted</h2>
      <p><strong>${employeeName}</strong> just submitted <strong>${insertedCount}</strong> lead(s).</p>
      ${skippedCount > 0 ? `<p>${skippedCount} duplicate(s) were skipped.</p>` : ''}
      <table style="border-collapse:collapse;width:100%">
        <thead>
          <tr>
            <th style="padding:8px;border:1px solid #eee;text-align:left">Name</th>
            <th style="padding:8px;border:1px solid #eee;text-align:left">Email</th>
            <th style="padding:8px;border:1px solid #eee;text-align:left">Website</th>
          </tr>
        </thead>
        <tbody>${leadRows}</tbody>
      </table>
      <p style="margin-top:16px;color:#888">Check your dashboard for more details.</p>
    `
  };
};