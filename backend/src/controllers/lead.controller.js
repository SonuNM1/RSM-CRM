import Lead from "../models/leads.model.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { normalizeWebsite } from "../utils/normalizeWebsite.js";
import { buildLeadQuery } from "../utils/lead/buildLeadQuery.js";
import { buildPagination } from "../utils/lead/buildPagination.js";
import { ADMIN_ONLY_STATUSES, ALL_STATUSES } from "../constants/leadStatus.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load countries.json manually

const countriesPath = path.join(__dirname, "../data/countries.json");

// Submit the leads

export const submitLeads = async (req, res) => {
  try {
    const leads = req.body.leads;

    if (!Array.isArray(leads) || leads.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No leads provided" });
    }

    // 1️⃣ Fetch existing data ONCE
    const existingLeads = await Lead.find({}, "email website");

    const existingEmails = new Set(
      existingLeads.map((l) => l.email.toLowerCase()),
    );

    const existingWebsites = new Set(
      existingLeads.map((l) => normalizeWebsite(l.website)),
    );

    // 2️⃣ Track batch-level duplicates
    const batchEmails = new Set();
    const batchWebsites = new Set();

    const inserted = [];
    const skipped = [];

    for (const lead of leads) {
      const email = lead.email.toLowerCase();
      const website = normalizeWebsite(lead.website);

      if (!website) {
        skipped.push(lead);
        continue;
      }

      const isDuplicate =
        existingEmails.has(email) ||
        existingWebsites.has(website) ||
        batchEmails.has(email) ||
        batchWebsites.has(website);

      if (isDuplicate) {
        skipped.push(lead);
        continue;
      }

      const created = await Lead.create({
        ...lead,
        website,
        status: "New",
        createdBy: req.user._id,
      });

      inserted.push(created);

      // Mark as seen
      batchEmails.add(email);
      batchWebsites.add(website);
    }

    return res.status(200).json({
      success: true,
      insertedCount: inserted.length,
      skippedCount: skipped.length,
      inserted,
      skipped,
      message:
        inserted.length === 0
          ? "All leads were duplicates"
          : skipped.length > 0
            ? "Leads processed with duplicates"
            : "All leads submitted successfully",
    });
  } catch (err) {
    console.error("Submit leads error:", err);

    // Mongo duplicate key error

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate lead detected",
        error: err.keyValue,
      });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};

// lead statuses - used for filters and dropdowns

export const getLeadStatuses = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      statuses: ALL_STATUSES,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Fetch the leads - filter, pagination, search

export const getLeads = async (req, res) => {
  try {
    const query = buildLeadQuery(req.query); // builds a MongoDB query object based on filters (status, submittedBy, dateRange) + search (name/email/website)

    // Pagination - page (current page number), limit (no of items per page), skip (how many docs to skip)

    const { page, limit, skip } = buildPagination(
      req.query.page,
      req.query.limit,
    );

    // Fetch total count (for pagination UI) - counts total leads matching the query

    const total = await Lead.countDocuments(query);

    // Fetch leads

    const leads = await Lead.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 }) // newest leads first
      .skip(skip)
      .limit(limit);

    // Response

    return res.status(200).json({
      success: true,
      count: leads.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      leads,
    });
  } catch (error) {
    console.error("Fetch leads error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};

// Get new leads (status: NEW)

export const getNewLeads = async (req, res) => {
  try {
    // Only allow status = New

    if (req.query.status && req.query.status !== "New") {
      return res.status(400).json({
        success: false,
        message: "This endpoint only supports status = New",
      });
    }

    // Build dynamic query (filters: search, createdBy, date range, etc.)

    const query = {
      ...buildLeadQuery(req.query),
      status: "New",
      assignedTo: null,
    };

    const { page, limit, skip } = buildPagination(
      req.query.page,
      req.query.limit,
    );

    const total = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 👇 map Mongo → UI Lead model

    const normalizedLeads = leads.map((l) => ({
      id: l._id,
      name: l.name,
      email: l.email,
      website: l.website,
      submittedBy: l.createdBy?.name ?? "—",
      submittedDate: l.createdAt,
      status: l.status ?? "New",
    }));

    return res.status(200).json({
      success: true,
      leads: normalizedLeads,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get new leads error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch new leads",
    });
  }
};

// assign leads

export const assignLeads = async (req, res) => {
  try {
    const { leadIds, assignedTo } = req.body;

    if (!leadIds?.length || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Lead IDs and assignedTo are required",
      });
    }

    const result = await Lead.updateMany(
      {
        _id: { $in: leadIds },
        assignedTo: null,
      },
      {
        $set: {
          assignedTo,
          assignedAt: new Date(),
          status: "Assigned",
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} leads assigned successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign leads",
    });
  }
};

// leads assigned to me (get)

export const getMyPipelineLeads = async (req, res) => {
  try {
    const userId = req.user._id;

    const query = buildLeadQuery(req.query, "assignedAt");
    query.assignedTo = new mongoose.Types.ObjectId(userId);

    const leads = await Lead.find(query)
      .populate("createdBy", "name")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, leads });
  } catch (error) {
    console.error("getMyPipelineLeads error:", error); // 👈 check your terminal for this
    res
      .status(500)
      .json({ success: false, message: "Error fetching the assigned leads" });
  }
};

// update lead status

export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userRole = req.user.role;

    console.log("updateLeadStatus hit:", req.params.id, status, userRole);

    if (ADMIN_ONLY_STATUSES.includes(status) && userRole === "BDE_Executive") {
      return res.status(403).json({
        success: false,
        message: `Only admins can set status to "${status}"`,
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    console.log("Updated lead:", lead);

    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    return res.status(200).json({ success: true, lead });
  } catch (error) {
    console.error("Update lead status error: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update status" });
  }
};

// get leads by id (BdeTimeline)

export const getLeadById = async (req, res) => {
  try {
    const { leadId } = req.params;

    // validate leadId

    if (!leadId) {
      return res.status(400).json({
        success: false,
        message: "Lead ID is required",
      });
    }

    // find lead and populate createdBy field

    const lead = await Lead.findById(leadId)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("Error fetching lead by ID:", error);

    // handle invalid ObjectId format

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching lead",
    });
  }
};

// add lead activity status and note

export const addLeadActivity = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { status, note } = req.body;
    const userId = req.user.id; // From auth middleware

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const activity = {
      type: status ? "status_change" : "note",
      content: note || `Status changed from ${lead.status} to ${status}`,
      updatedBy: userId,
      timestamp: new Date(),
    };

    if (status) {
      activity.oldStatus = lead.status;
      activity.newStatus = status;
      lead.status = status;
    }

    lead.activities.push(activity);
    await lead.save();

    res.status(200).json({
      success: true,
      message: "Activity added successfully",
      lead,
    });
  } catch (error) {
    console.error("Error adding activity:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding activity",
    });
  }
};

// get lead activity (status and note)

export const getLeadActivities = async (req, res) => {
  try {
    const { leadId } = req.params;

    const lead = await Lead.findById(leadId)
      .populate("activities.updatedBy", "name email")
      .select("activities");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Sort activities by timestamp (newest first)

    const sortedActivities = lead.activities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    res.status(200).json({
      success: true,
      activities: sortedActivities,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching activities",
    });
  }
};
