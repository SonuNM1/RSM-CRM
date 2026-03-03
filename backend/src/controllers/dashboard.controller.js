import Lead from "../models/leads.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getEmailLeadStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // start of current month

     const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // start of current week (Monday)

    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = day === 0 ? 6 : day - 1;
    startOfWeek.setDate(startOfWeek.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // last 7 days grouped by day

    const last7Days = new Date();          
    last7Days.setDate(last7Days.getDate() - 6);
    last7Days.setHours(0, 0, 0, 0);

    const [totalLeads, thisMonth, thisWeek, currentUser, weeklyData] = await Promise.all([
      Lead.countDocuments({ createdBy: userId }),
      Lead.countDocuments({ createdBy: userId, createdAt: { $gte: startOfMonth } }),
      Lead.countDocuments({ createdBy: userId, createdAt: { $gte: startOfWeek } }),
      User.findById(userId).select('duplicatesSkipped').lean(),
      Lead.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(userId), createdAt: { $gte: last7Days } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, leads: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      totalLeads,
      thisMonth,
      thisWeek,
      duplicatesSkipped: currentUser?.duplicatesSkipped ?? 0,
      weeklyData,
    });
  } catch (error) {
    console.error("getEmailLeadStats error: ", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
