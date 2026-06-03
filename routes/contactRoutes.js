import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      message: "Message sent"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1
    });

    res.json(contacts);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

export default router;