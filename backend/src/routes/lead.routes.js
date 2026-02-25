import express from "express" 
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { getLeads, submitLeads, getLeadStatuses, getNewLeads, assignLeads, getMyPipelineLeads } from "../controllers/lead.controller.js";

const router = express.Router() ; 

// submit the leads

router.post("/submit-leads", protect, allowRoles("Super_Admin", "Admin", "Email_Executive"), submitLeads)

// lead status 

router.get("/lead-statuses", protect, getLeadStatuses) ; 

// get leads 

router.get("/all-leads", protect, allowRoles("Super_Admin", "Admin",), getLeads)

// Get leads (status: New)

router.get("/all-leads/new", protect, allowRoles("Super_Admin", "Admin"), getNewLeads)

// assign leads to BDE 

router.patch("/assign", protect, allowRoles("Super_Admin", "Admin"), assignLeads) ; 

// leads assigned to me (get)

router.get("/my-pipeline", protect, allowRoles("BDE_Executive", "Admin", "Super_Admin"), getMyPipelineLeads) ; 

export default router ; 