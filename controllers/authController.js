import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =========================
   REGISTER ADMIN
========================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Get uploaded image path
    const image = req.file ? req.file.path : "";

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      image,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        image: admin.image ? `${process.env.BASE_URL || "http://localhost:5000"}/${admin.image.replace(/\\/g, "/")}` : "",
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* =========================
   LOGIN ADMIN
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Ensure secrets exist
    if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
      console.error("JWT_SECRET or REFRESH_SECRET missing in .env");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    // Create access token (short-lived)
    const accessToken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Create refresh token (long-lived)
    const refreshToken = jwt.sign(
      { id: admin._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Optionally: store refreshToken in DB for security

    res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        image: admin.image ? `${process.env.BASE_URL || "http://localhost:5000"}/${admin.image.replace(/\\/g, "/")}` : "",
        role: admin.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* =========================
   REFRESH ADMIN TOKEN
========================= */
export const refreshAdminToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "No token provided" });

  if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
    console.error("JWT_SECRET or REFRESH_SECRET missing in .env");
    return res.status(500).json({ message: "Server misconfiguration" });
  }

  try {
    // Verify refresh token
    const payload = jwt.verify(token, process.env.REFRESH_SECRET);

    // Find admin
    const admin = await Admin.findById(payload.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Issue new access token
    const newAccessToken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("REFRESH TOKEN ERROR:", err);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

/* =========================
   GET CURRENT ADMIN
========================= */
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const imageUrl = admin.image
      ? `${process.env.BASE_URL || "http://localhost:5000"}/${admin.image.replace(/\\/g, "/")}`
      : null;

    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      image: imageUrl,
      role: admin.role,
    });
  } catch (error) {
    console.error("GET ADMIN PROFILE ERROR:", error);
    res.status(500).json({ message: "Failed to fetch admin profile" });
  }
};

/* =========================
   UPDATE CURRENT ADMIN
========================= */
export const updateMe = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.admin.id,
      updateData,
      { new: true }
    );

    const imageUrl = updatedAdmin.image
      ? `${process.env.BASE_URL || "http://localhost:5000"}/${updatedAdmin.image.replace(/\\/g, "/")}`
      : null;

    res.json({
      id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      image: imageUrl,
      role: updatedAdmin.role,
    });
  } catch (error) {
    console.error("UPDATE ADMIN ERROR:", error);
    res.status(500).json({ message: "Update failed" });
  }
};