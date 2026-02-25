import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getAllEmployee, getUsersForFilter, getUsersSearchableDropdown, updateUser } from "../controllers/user.controller.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Update profile

router.put("/:id", protect, updateUser);

// get users for filter property 

router.get("/lead-creators", protect, allowRoles("Super_Admin", "Admin"), getUsersForFilter) ; 

// get users according to role - filter (assign leads page)

router.get("/filter", protect, getUsersSearchableDropdown)

// Get all employees 

router.get("/employees", protect, allowRoles("Super_Admin", "Admin"), getAllEmployee)

export default router;
