import express from "express";
import Hotel from "../models/Hotel.js";
import upload from "../middleware/upload.js";
import { addHotel } from "../controllers/hotelController.js";
import fs from "fs";

const router = express.Router();

/* ===========================
   ADD HOTEL WITH IMAGES
=========================== */
router.post("/", upload.array("images", 5), async (req, res, next) => {
  try {
    await addHotel(req, res);
  } catch (error) {
    console.error("ADD HOTEL ERROR:", error);
    next(error);
  }
});

/* ===========================
   UPDATE HOTEL WITH IMAGES
=========================== */
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, pricePerNight, totalRooms, description, existingImages } = req.body;

    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    // update basic fields
    hotel.name = name;
    hotel.location = location;
    hotel.pricePerNight = pricePerNight;
    hotel.totalRooms = totalRooms;
    hotel.description = description;

    // remove deleted images
    if (hotel.images && existingImages) {
      hotel.images.forEach((img) => {
        if (!existingImages.includes(img) && fs.existsSync(img)) {
          fs.unlinkSync(img);
        }
      });
    }

    // add new uploaded images
    const newImages = req.files && req.files.length > 0
      ? req.files.map((f) => f.path)
      : [];

    hotel.images = existingImages
      ? [...existingImages, ...newImages]
      : newImages;

    await hotel.save();

    const formattedHotel = {
      ...hotel._doc,
      images: hotel.images.map((img) =>
        `http://localhost:5000/${img.replace(/\\/g, "/")}`
      ),
    };

    res.status(200).json(formattedHotel);

  } catch (error) {
    console.error("UPDATE HOTEL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   GET ALL HOTELS
=========================== */
router.get("/", async (req, res) => {
  try {

    const hotels = await Hotel.find().sort({ createdAt: -1 });

    const formattedHotels = hotels.map((hotel) => ({
      ...hotel._doc,
      images: hotel.images.map((img) =>
        `http://localhost:5000/${img.replace(/\\/g, "/")}`
      ),
    }));

    res.json(formattedHotels);

  } catch (error) {
    console.error("GET HOTELS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   GET SINGLE HOTEL BY ID
=========================== */
router.get("/:id", async (req, res) => {
  try {

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const formattedHotel = {
      ...hotel._doc,
      images: hotel.images.map((img) =>
        `http://localhost:5000/${img.replace(/\\/g, "/")}`
      ),
    };

    res.json(formattedHotel);

  } catch (error) {
    console.error("GET HOTEL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   DELETE HOTEL
=========================== */
router.delete("/:id", async (req, res) => {
  try {

    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    // delete images from server
    hotel.images.forEach((img) => {
      if (fs.existsSync(img)) {
        fs.unlinkSync(img);
      }
    });

    await Hotel.findByIdAndDelete(req.params.id);

    res.json({ message: "Hotel deleted successfully" });

  } catch (error) {
    console.error("DELETE HOTEL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;