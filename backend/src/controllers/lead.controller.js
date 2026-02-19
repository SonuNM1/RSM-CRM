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

      if(!website){
        skipped.push(lead) ; 
        continue ; 
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

    if(err.code === 11000){
      return res.status(409).json({
        success: false, 
        message: "Duplicate lead detected", 
        error: err.keyValue 
      })
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};

// lead statuses - used for filters and dropdowns 

export const getLeadStatuses = async (req, res) => {
  return res.status(200).json({
    success: true, 
    statuses: LEAD_STATUSES
  })
}

// Fetch the leads - filter, pagination, search

export const getLeads = async (req, res) => {
  try {
    
    const query = buildLeadQuery(req.query);  // builds a MongoDB query object based on filters (status, submittedBy, dateRange) + search (name/email/website) 

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
      .sort({ createdAt: -1 })  // newest leads first 
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
