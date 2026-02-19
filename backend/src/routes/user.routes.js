import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getAllEmployee, getUsersForFilter, updateUser } from "../controllers/user.controller.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Update profile

router.put("/:id", protect, updateUser);

// get users for filter property 

router.get("/lead-creators", protect, allowRoles("Super_Admin", "Admin"), getUsersForFilter)

// Get all employees 

router.get("/employees", protect, allowRoles("Super_Admin", "Admin"), getAllEmployee)

export default router;
