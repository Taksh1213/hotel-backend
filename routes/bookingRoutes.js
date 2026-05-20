import express from "express";
import {
  getBookings,
  getMyBookings,
  addBooking,
  updateBooking,
  deleteBooking
} from "../controllers/bookingController.js";

import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// ADMIN
router.get("/", verifyAdmin, getBookings);

// USER BOOKINGS
router.get("/my", verifyUser, getMyBookings);

// CREATE BOOKING
router.post("/", verifyUser, addBooking);

// ADMIN UPDATE
router.put("/:id", verifyAdmin, updateBooking);

// ADMIN DELETE
router.delete("/:id", verifyAdmin, deleteBooking);

export default router;