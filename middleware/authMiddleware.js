import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

/* ===============================
   VERIFY USER (Authenticated)
=============================== */
export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* ===============================
   VERIFY ADMIN ONLY
=============================== */
export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // ✅ FIXED: Use Admin model instead of User
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({ message: "Invalid admin token" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};