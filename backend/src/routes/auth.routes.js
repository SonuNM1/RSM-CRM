import express from "express"
import { inviteUser, acceptInvite } from "../controllers/auth.controller.js"
import { protect } from "../middleware/auth.middleware.js"
import {allowRoles} from "../middleware/role.middleware.js"

const router = express.Router() ; 

// Admin invites users 

router.post("/invite", protect, allowRoles("Super_Admin", "Admin"), inviteUser) ; 

// User accepts invite 

router.post("/accept-invite", acceptInvite) ; 

export default router; 