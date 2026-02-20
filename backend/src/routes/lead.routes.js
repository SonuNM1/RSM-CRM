import express from "express" 
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { getLeads, submitLeads, getLeadStatuses, getNewLeads } from "../controllers/lead.controller.js";

const router = express.Router() ; 

// submit the leads

router.post("/submit-leads", protect, allowRoles("Super_Admin", "Admin", "Email_Executive"), submitLeads)

// lead status 

router.get("/lead-statuses", protect, getLeadStatuses) ; 

// get leads 

router.get("/all-leads", protect, allowRoles("Super_Admin", "Admin",), getLeads)

// Get leads (status: New)

router.get("/all-leads/new", protect, allowRoles("Super_Admin", "Admin"), getNewLeads)


export default router ; 