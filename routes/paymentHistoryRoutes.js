
import express from "express";

import Booking from "../models/Booking.js";

import {
  verifyUser
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   PAYMENT HISTORY
=========================== */

router.get(

  "/history",

  verifyUser,

  async (req, res) => {

    try {

      /* FETCH ONLY PAID BOOKINGS */

      const payments =

      await Booking.find({

        user: req.user._id,

        paymentStatus: {
          $regex: /^paid$/i
        }

      })

      .populate("room")

      .sort({
        createdAt: -1
      });

      console.log(
        "PAYMENTS:",
        payments.length
      );

      res.status(200).json(
        payments
      );

    } catch (error) {

      console.log(

        "PAYMENT HISTORY ERROR:",

        error.message

      );

      res.status(500).json({

        message:
        "Failed to fetch payment history"

      });

    }

  }

);

export default router;
