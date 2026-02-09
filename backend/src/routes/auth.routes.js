import express from "express"
import {
    inviteUser, 
    acceptInvite, 
    adminLogin,
    logout
} from "../controllers/auth.controller.js"
import { protect } from "../middleware/auth.middleware.js"
import {allowRoles} from "../middleware/role.middleware.js"
import { userLogin } from "../controllers/user.controller.js"
import { requestPasswordOTP, resetPasswordWithOTP } from "../controllers/password.controller.js"

const router = express.Router() ; 

// admin login

router.post("/admin/login", adminLogin)

// Admin invites users (with role)

router.post("/admin/invite", protect, allowRoles("Super_Admin", "Admin"), inviteUser) ; 

// User accepts invite 

router.post("/admin/accept-invite/:token", acceptInvite) ; 

// user login (separate route)

router.post("/user/login", userLogin)

// logout 

router.post("/logout", logout) ; 

// forgot password via OTP 

router.post("/forgot-password", requestPasswordOTP) ; 

// Reset password 

router.post("/reset-password", resetPasswordWithOTP)

export default router; 