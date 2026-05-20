import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* ===========================
   GET CURRENT USER
=========================== */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Construct full image URL
    const imageUrl = user.image
      ? `${process.env.BASE_URL || "http://localhost:5000"}/${user.image.replace(/\\/g, "/")}`
      : null;

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      image: imageUrl,
      role: user.role,
    });
  } catch (err) {
    console.error("GET ME ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

/* ===========================
   UPDATE CURRENT USER
=========================== */
export const updateMe = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };

    // Hash new password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update profile image if uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );

    // ✅ Construct full image URL
    const imageUrl = updatedUser.image
      ? `${process.env.BASE_URL || "http://localhost:5000"}/${updatedUser.image.replace(/\\/g, "/")}`
      : null;

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: imageUrl,
      role: updatedUser.role,
    });
  } catch (err) {
    console.error("UPDATE ME ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};