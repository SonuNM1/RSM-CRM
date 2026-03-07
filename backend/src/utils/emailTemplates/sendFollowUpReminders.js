import Lead from "../models/lead.model.js";
import { sendEmail } from "./sendEmail.js";

export const sendFollowUpReminders = async (userId) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const dueLeads = await Lead.find({
      assignedTo: userId,
      status: "Follow Up",
      followUpDate: { $gte: startOfDay, $lte: endOfDay },
    }).lean();

    if (dueLeads.length === 0) return;

    const leadRows = dueLeads.map(l => `
      <tr>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${l.name}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${l.email}</td>
        <td style="padding: 8px; border: 1px solid #e2e8f0;">${l.website}</td>
      </tr>
    `).join("");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">⏰ Follow-ups Due Today</h2>
        <p>You have <strong>${dueLeads.length}</strong> follow-up(s) scheduled for today:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead>
            <tr style="background: #f8fafc;">
              <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: left;">Name</th>
              <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: left;">Email</th>
              <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: left;">Website</th>
            </tr>
          </thead>
          <tbody>${leadRows}</tbody>
        </table>
        <p style="color: #64748b; font-size: 14px;">Log in to your CRM to take action on these leads.</p>
      </div>
    `;

    const { User } = await import("../models/user.model.js");
    const bde = await User.findById(userId).lean();
    if (bde?.email) {
      await sendEmail({
        to: bde.email,
        subject: `⏰ ${dueLeads.length} Follow-up(s) Due Today`,
        html,
      });
    }
  } catch (error) {
    console.error("Follow-up reminder error:", error);
  }
};