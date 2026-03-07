import Lead from "../models/leads.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Email team

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

    const [totalLeads, thisMonth, thisWeek, currentUser, weeklyData] =
      await Promise.all([
        Lead.countDocuments({ createdBy: userId }),
        Lead.countDocuments({
          createdBy: userId,
          createdAt: { $gte: startOfMonth },
        }),
        Lead.countDocuments({
          createdBy: userId,
          createdAt: { $gte: startOfWeek },
        }),
        User.findById(userId).select("duplicatesSkipped").lean(),
        Lead.aggregate([
          {
            $match: {
              createdBy: new mongoose.Types.ObjectId(userId),
              createdAt: { $gte: last7Days },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              leads: { $sum: 1 },
            },
          },
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

// BDE Team

export const getBdeDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalAssigned = await Lead.countDocuments({ assignedTo: userId });

    return res.status(200).json({
      success: true,
      totalAssigned,
    });
  } catch (error) {
    console.error("getBdeDashboardStats error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const getFollowUps = async (req, res) => {
  try {
    const now = new Date();

    const leads = await Lead.find({
      assignedTo: req.user._id,
      status: "Follow Up",
    })
      .sort({ followUpDate: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      leads, 
      total: leads.length
    });

  } catch (error) {
    console.error("getFollowUps error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const isSameDay = (date1, date2) => {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );
};
