import express from "express";
import { registerUser, loginUser } from "../controllers/userAuthController.js";
import { getMe, updateMe } from "../controllers/userController.js";
import upload from "../middleware/upload.js"; // multer for image
import { verifyUser } from "../middleware/authMiddleware.js"; // ✅ use named import

const router = express.Router();

// ===========================
// AUTH ROUTES
// ===========================
router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);

// ===========================
// PROFILE ROUTES
// ===========================
router.get("/me", verifyUser, getMe);                     // fetch logged-in user
router.put("/me", verifyUser, upload.single("image"), updateMe); // update profile

export default router;