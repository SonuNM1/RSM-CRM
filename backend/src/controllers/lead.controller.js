import Lead from "../models/leads.model.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { normalizeWebsite } from "../utils/normalizeWebsite.js";
import { buildLeadQuery } from "../utils/lead/buildLeadQuery.js";
import { buildPagination } from "../utils/lead/buildPagination.js";
import { LEAD_STATUSES } from "../constants/leadStatus.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load countries.json manually

const countriesPath = path.join(__dirname, "../data/countries.json");
const countries = JSON.parse(fs.readFileSync(countriesPath, "utf-8"));

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
  return res.status(200).json({
    success: true,
    statuses: LEAD_STATUSES,
  });
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
        assignedTo: { $exists: false }, // 👈 prevents reassignment
      },
      {
        $set: {
          assignedTo,
          assignedAt: new Date(),
          status: "ASSIGNED",
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
  try{
    const userId = req.user._id;

    const query = buildLeadQuery(req.query) ;

    query.assignedTo = userId ; 

    const leads = await Lead.find(query)  
      .populate("createdBy", "name")
      .sort({createdAt: -1})
      .lean() ; 

    res.status(200).json({
      success: true, 
      leads 
    })

  }catch(error){
    res.status(500).json({
      success: false, 
      message: "Error fetching the assigned leads"
    })
  }
}