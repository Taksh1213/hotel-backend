import express from "express";
import { register, login, refreshAdminToken, getMe, updateMe } from "../controllers/authController.js";
import upload from "../middleware/upload.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.post("/refresh-token", refreshAdminToken);
router.get("/me", verifyAdmin, getMe);
router.put("/me", verifyAdmin, upload.single("image"), updateMe);

export default router;