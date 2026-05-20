import express from "express";
import Room from "../models/Room.js";
import multer from "multer";
import path from "path";

const router = express.Router();

/* ===========================
   MULTER CONFIG
=========================== */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ===========================
   GET ROOMS BY HOTEL
=========================== */
router.get("/by-hotel/:hotelId", async (req, res) => {
  try {
    const rooms = await Room.find({
      hotel: req.params.hotelId,
    }).sort({ createdAt: -1 });

    res.status(200).json(rooms);
  } catch (error) {
    console.error("GET ROOMS BY HOTEL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   ADD ROOM
=========================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const room = new Room({
      ...req.body,
      image: req.file ? req.file.filename : "",
    });

    const savedRoom = await room.save();

    res.status(201).json(savedRoom);
  } catch (error) {
    console.error("CREATE ROOM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   GET ALL ROOMS
=========================== */
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("hotel", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json(rooms);
  } catch (error) {
    console.error("GET ROOMS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   GET SINGLE ROOM
=========================== */
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      "hotel",
      "name location"
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error("GET ROOM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   UPDATE ROOM
=========================== */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(room);
  } catch (error) {
    console.error("UPDATE ROOM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   DELETE ROOM
=========================== */
router.delete("/:id", async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ROOM ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;