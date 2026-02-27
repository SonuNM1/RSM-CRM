import express from "express" 
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { getLeads, 
    submitLeads, 
    getLeadStatuses, 
    getNewLeads, 
    assignLeads, 
    getMyPipelineLeads, 
    updateLeadStatus, 
    getLeadById,
    addLeadActivity,
    getLeadActivities
} from "../controllers/lead.controller.js";

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

// update lead status 

router.patch("/:id/status", protect, allowRoles("BDE_Executive", "Admin", "Super_Admin"), updateLeadStatus) ; 

// get lead by id (BdeTimeline)

router.get("/:leadId", protect, allowRoles("BDE_Executive", "Admin", "Super_Admin"), getLeadById)

// update lead (status and note)

router.post("/:leadId/activity", protect, allowRoles("BDE_Executive", "Admin", "Super_Admin"), addLeadActivity)

// get lead activity (status and note)

router.get("/:leadId/activities", protect, allowRoles("BDE_Executive", "Admin", "Super_Admin"), getLeadActivities)

export default router ; 