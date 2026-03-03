import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { getEmailLeadStats } from "../controllers/dashboard.controller.js";

const router = express.Router() ; 

router.get('/email/my-stats', protect, allowRoles("Email_Executive"), getEmailLeadStats) ; 

export default router ; 