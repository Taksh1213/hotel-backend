
import express from "express";

import Booking from "../models/Booking.js";

import {

  getBookings,
  getMyBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  cancelBooking

} from "../controllers/bookingController.js";

import {

  verifyAdmin,
  verifyUser

} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   ADMIN BOOKINGS
=============================== */

router.get(
  "/",
  verifyAdmin,
  getBookings
);

/* ===============================
   MY BOOKINGS
=============================== */

router.get(
  "/my",
  verifyUser,
  getMyBookings
);

/* ===============================
   ROOM BOOKED DATES
=============================== */

router.get(

  "/room/:id",

  async (req, res) => {

    try {

      const bookings =
      await Booking.find({

        room:
        req.params.id

      });

      res.status(200).json(
        bookings
      );

    } catch (error) {

      console.log(
        "ROOM BOOKINGS ERROR:",
        error
      );

      res.status(500).json({

        message:
        "Failed to fetch room bookings"

      });

    }

  }

);

/* ===============================
   CREATE BOOKING
=============================== */

router.post(
  "/",
  verifyUser,
  addBooking
);

/* ===============================
   UPDATE BOOKING
=============================== */

router.put(
  "/:id",
  verifyAdmin,
  updateBooking
);

/* ===============================
   CANCEL BOOKING
=============================== */

router.delete(
  "/cancel/:id",
  verifyUser,
  cancelBooking
);

/* ===============================
   DELETE BOOKING
=============================== */

router.delete(
  "/:id",
  verifyAdmin,
  deleteBooking
);

export default router;

