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

    const [
      totalAssigned,
      meetingsScheduled,
      convertedLeads,
      followUpsTotal,
      recentPipeline,
      pipelineHealth,
      upcomingFollowUps,
    ] = await Promise.all([
      Lead.countDocuments({ assignedTo: userId }),
      Lead.countDocuments({ assignedTo: userId, status: "Meeting Scheduled" }),
      Lead.countDocuments({ assignedTo: userId, status: "Converted" }),
      Lead.countDocuments({
        assignedTo: userId,
        status: "Follow Up",
        followUpDate: { $ne: null },
      }),
      Lead.find({ assignedTo: userId })
        .select("name website status updatedAt")
        .sort({ updatedAt: -1 })
        .limit(7)
        .lean(),
      Lead.aggregate([
        { $match: { assignedTo: userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $project: { status: "$_id", count: 1, _id: 0 } },
      ]),
      Lead.find({
        assignedTo: userId,
        status: "Follow Up",
        followUpDate: { $ne: null },
      })
        .select("name website followUpDate")
        .sort({ followUpDate: 1 })
        .limit(3)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      totalAssigned,
      meetingsScheduled,
      convertedLeads,
      followUpsTotal, // add here
      recentPipeline,
      pipelineHealth,
      upcomingFollowUps,
    });
  } catch (error) {
    console.error("getBdeDashboardStats error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getFollowUps = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const todayEnd = new Date(todayStart.getTime() + 86400000);

    const leads = await Lead.find({
      assignedTo: userId,
      status: "Follow Up",
      followUpDate: { $ne: null },
    })
      .select("name website followUpDate")
      .sort({ followUpDate: 1 })
      .lean();

    const overdue = leads.filter((l) => new Date(l.followUpDate) < todayStart);
    const dueToday = leads.filter(
      (l) =>
        new Date(l.followUpDate) >= todayStart &&
        new Date(l.followUpDate) < todayEnd,
    );
    const upcoming = leads.filter((l) => new Date(l.followUpDate) >= todayEnd);

    return res.status(200).json({
      success: true,
      overdue,
      dueToday,
      upcoming,
      total: leads.length,
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

export const getMeetingStats = async (req, res) => {
  try {
    const isAdmin =
      req.user.role === "Admin" || req.user.role === "Super_Admin";
    const query = isAdmin ? {} : { assignedTo: req.user._id };
    const now = new Date();

    const [total, upcoming, past] = await Promise.all([
      Lead.countDocuments({ ...query, meetingDate: { $ne: null } }),
      Lead.countDocuments({ ...query, meetingDate: { $gt: now } }),
      Lead.countDocuments({ ...query, meetingDate: { $lte: now } }),
    ]);

    return res.status(200).json({ success: true, total, upcoming, past });
  } catch (error) {
    console.error("getMeetingStats error: ", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const isAdmin =
      req.user.role === "Admin" || req.user.role === "Super_Admin";
    const query = isAdmin ? {} : { assignedTo: req.user._id };
    const now = new Date();

    const [upcoming, past] = await Promise.all([
      Lead.find({ ...query, meetingDate: { $gt: now } })
        .select(
          "name website meetingDate status hadMeeting outcomeStatus assignedTo",
        )
        .populate("assignedTo", "name")
        .sort({ meetingDate: 1 })
        .lean(),
      Lead.find({
        ...query,
        meetingDate: { $lte: now },
        $or: [{ status: "Meeting Scheduled" }, { hadMeeting: true }],
      })
        .select(
          "name website meetingDate status hadMeeting outcomeStatus assignedTo",
        )
        .populate("assignedTo", "name")
        .sort({ meetingDate: -1 })
        .lean(),
    ]);

    return res.status(200).json({ success: true, upcoming, past });
  } catch (error) {
    console.error("getMeetings error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateMeetingOutcome = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { happened, status, note } = req.body;

    const lead = await Lead.findById(leadId);
    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    lead.hadMeeting = happened;
    lead.status = status;
    if (happened) lead.outcomeStatus = status;

    lead.activities.push({
      type: "status_change",
      oldStatus: "Meeting Scheduled",
      newStatus: status,
      content: note || "",
      updatedBy: req.user._id,
      timestamp: new Date(),
    });

    await lead.save();

    return res
      .status(200)
      .json({ success: true, message: "Meeting outcome updated" });
  } catch (error) {
    console.error("updateMeetingOutcome error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getConvertedLeads = async (req, res) => {
  try {
    const userId = req.user._id;
    const leads = await Lead.find({ assignedTo: userId, status: "Converted" })
      .select("name website email phone status updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({ success: true, leads, total: leads.length });
  } catch (error) {
    console.error("getConvertedLeads error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin , Super-admin

export const getSuperAdminDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const [
      totalLeads,
      assignedLeads,
      totalEmployees,
      bdeCount,
      emailCount,
      adminCount,
      meetingsThisMonth,
      convertedThisMonth,
      recentLeads,
      teamPerformance,
      statusDistribution,
    ] = await Promise.all([
      Lead.countDocuments({}),
      Lead.countDocuments({ assignedTo: { $ne: null } }),
      User.countDocuments({
        role: { $in: ["BDE_Executive", "Email_Executive", "Admin"] },
      }),
      User.countDocuments({ role: "BDE_Executive" }),
      User.countDocuments({ role: "Email_Executive" }),
      User.countDocuments({ role: "Admin" }),
      Lead.countDocuments({
        meetingDate: { $gte: startOfMonth, $lte: endOfMonth },
      }),
      Lead.countDocuments({
        status: "Converted",
        updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
      }),
      Lead.find({}) // ← add this
        .select("name website status createdAt createdBy")
        .populate("assignedTo", "name")
        .sort({ createdAt: -1 })
        .limit(7)
        .lean(),
      Lead.aggregate([
        { $match: { status: "Converted", assignedTo: { $ne: null } } },
        { $group: { _id: "$assignedTo", converted: { $sum: 1 } } },
        { $sort: { converted: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "bde",
          },
        },
        { $unwind: "$bde" },
        { $project: { name: "$bde.name", converted: 1, _id: 0 } },
      ]),
      Lead.aggregate([
        {
          $match: { status: { $in: ["Interested", "Follow Up", "Converted"] } },
        },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $project: { status: "$_id", count: 1, _id: 0 } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      totalLeads,
      assignedLeads,
      unassignedLeads: totalLeads - assignedLeads,
      totalEmployees,
      bdeCount,
      emailCount,
      adminCount,
      meetingsThisMonth,
      convertedThisMonth,
      recentLeads,
      teamPerformance,
      statusDistribution,
    });
  } catch (error) {
    console.error("getSuperAdminDashboardStats error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
