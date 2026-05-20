import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ===========================
   REGISTER USER
=========================== */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Get uploaded image
    const image = req.file ? req.file.path : "";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      image, // ✅ save image path
      role: "user"
    });

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ===========================
   LOGIN USER
=========================== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
}; 