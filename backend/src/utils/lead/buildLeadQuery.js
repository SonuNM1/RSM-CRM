import { normalizeWebsite } from "../normalizeWebsite.js";
import { parseDateRange } from "./parseDateRange.js";
import mongoose from "mongoose";

export const buildLeadQuery = (queryParams) => {

  const { 
    search, 
    status, 
    submittedBy, 
    createdBy, 
    startDate, 
    endDate,
    fromDate, 
    toDate 
  } = queryParams;

  const query = {};

  const creator = createdBy || submittedBy;

  if (creator && creator !== "All") {
    query.createdBy = new mongoose.Types.ObjectId(creator);
  }

  const dateRange = parseDateRange(
    startDate || fromDate,
    endDate || toDate
  );

  if (dateRange) {
    query.createdAt = dateRange;
  }

  if (status && status !== "All") {
    query.status = status;
  }

  if (search) {
    const normalizedSearch = normalizeWebsite(search);

    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { website: { $regex: normalizedSearch, $options: "i" } }
    ];
  }

  return query;
};
