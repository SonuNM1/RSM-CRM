import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { 
    getBdeDashboardStats, 
    getEmailLeadStats, 
    getFollowUps, 
    getMeetingStats, 
    getMeetings, 
    updateMeetingOutcome, 
    getConvertedLeads, 
    getSuperAdminDashboardStats 
} from "../controllers/dashboard.controller.js";

const router = express.Router() ; 

// email team

router.get('/email/my-stats', protect, allowRoles("Email_Executive"), getEmailLeadStats) ; 

// bde team 

router.get("/follow-ups", protect, allowRoles("BDE_Executive"), getFollowUps);

router.get("/bde-stats", protect, allowRoles("BDE_Executive"), getBdeDashboardStats);

router.get("/meeting-stats", protect, allowRoles("BDE_Executive", "Admin", "Super_Admin"), getMeetingStats);

router.get("/meetings", protect, allowRoles("BDE_Executive", "Admin", "Super_Admin"), getMeetings);

router.patch("/:leadId/meeting-outcome", protect, allowRoles("Admin", "Super_Admin"), updateMeetingOutcome) ;

router.get("/converted-leads", protect, allowRoles("BDE_Executive"), getConvertedLeads) ;

// admin or super admin 

router.get("/superadmin-stats", protect, allowRoles("Super_Admin", "Admin"), getSuperAdminDashboardStats);

export default router ; 