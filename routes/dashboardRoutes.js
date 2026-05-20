import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Dashboard Route (Admin Only)
router.get("/", verifyAdmin, getDashboardStats);

export default router;