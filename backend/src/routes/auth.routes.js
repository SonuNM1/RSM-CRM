import express from "express"
import {
    inviteUser,
    verifyInviteToken, 
    acceptInvite, 
    adminLogin,
    logout,
    getMe,
    refreshAccessToken
} from "../controllers/auth.controller.js"
import { protect } from "../middleware/auth.middleware.js"
import {allowRoles} from "../middleware/role.middleware.js"
import { updateUser, userLogin } from "../controllers/user.controller.js"

import {
    requestPasswordOTP, 
    validatePasswordOTP, 
    resetPassword,
} from "../controllers/password.controller.js" 

const router = express.Router() ; 

// refresh token 

router.post("/refresh", refreshAccessToken) ; 

// admin login

router.post("/admin/login", adminLogin)

// Admin invites users (with role)

router.post("/admin/invite", protect, allowRoles("Super_Admin", "Admin"), inviteUser) ; 

// verifying invite token 

router.get("/invite/verify", verifyInviteToken);

// User accepts invite 

router.post("/admin/accept-invite/:token", acceptInvite) ; 

// user login (separate route)

router.post("/user/login", userLogin)

// logout 

router.post("/logout", logout) ; 

// forgot password via OTP 

router.post("/forgot-password", requestPasswordOTP) ; 

// Reset password 

router.post("/forgot-password/request-otp", requestPasswordOTP) ; 

router.post("/forgot-password/validate-otp", validatePasswordOTP) ; 

router.post("/forgot-password/reset-password", resetPassword)

// profile route 

router.get("/me", protect, getMe) ; 



export default router; 