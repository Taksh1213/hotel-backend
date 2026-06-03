
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

/* =====================================================
   GET ALL BOOKINGS (ADMIN)
===================================================== */
export const getBookings = async (req, res) => {

  try {

    const bookings =
    await Booking.find()

      .populate("room")

      .populate(
        "user",
        "name email"
      )

      .sort({
        createdAt: -1
      });

    res.status(200).json(
      bookings
    );

  } catch (error) {

    console.error(
      "GET BOOKINGS ERROR:",
      error
    );

    res.status(500).json({
      message:
      "Error fetching bookings"
    });

  }

};

/* =====================================================
   GET MY BOOKINGS (USER)
===================================================== */
export const getMyBookings = async (req, res) => {

  try {

    const bookings =
    await Booking.find({

      user: req.user.id

    })

      .populate("room")

      .sort({
        createdAt: -1
      });

    res.status(200).json(
      bookings
    );

  } catch (error) {

    console.error(
      "GET MY BOOKINGS ERROR:",
      error
    );

    res.status(500).json({
      message:
      "Error fetching your bookings"
    });

  }

};

/* =====================================================
   ADD BOOKING
===================================================== */
export const addBooking = async (req, res) => {

  try {

    const {

      customerName,
      room,
      checkIn,
      checkOut,
      totalAmount,
      amount,
      paymentMethod,
      paymentStatus

    } = req.body;

    const finalAmount = totalAmount !== undefined ? totalAmount : amount;

    /* ===============================
       VALIDATION
    =============================== */

    if (

      !room ||
      !checkIn ||
      !checkOut ||
      finalAmount === undefined

    ) {

      return res.status(400).json({

        message:
        "All fields are required"

      });

    }

    if (

      !mongoose.Types.ObjectId.isValid(
        room
      )

    ) {

      return res.status(400).json({

        message:
        "Invalid room ID"

      });

    }

    const checkInDate =
    new Date(checkIn);

    const checkOutDate =
    new Date(checkOut);

    if (

      checkInDate >=
      checkOutDate

    ) {

      return res.status(400).json({

        message:
        "Check-out date must be after check-in date"

      });

    }

    /* ===============================
       PREVENT DOUBLE BOOKING
    =============================== */

    const existingBooking =
    await Booking.findOne({

      room,

      $or: [

        {
          checkIn: {
            $lt: checkOutDate
          },

          checkOut: {
            $gt: checkInDate
          },
        },

      ],

    });

    /* =====================================
       BLOCK ONLY UNPAID BOOKINGS
    ===================================== */

    if (existingBooking) {

      if (

        existingBooking.paymentStatus !==
        "Paid"

      ) {

        return res.status(400).json({

          message:
          "Room already booked for selected dates"

        });

      }

      console.log(

        "Existing paid booking found - allowing Stripe test booking"

      );

    }

    /* ===============================
       CUSTOMER NAME
    =============================== */

    const finalCustomerName =

      customerName ||

      req.user?.name ||

      "Guest User";

    /* ===============================
       CREATE BOOKING
    =============================== */

    const booking =
    new Booking({

      customerName:
      finalCustomerName,

      user:
      req.user.id,

      room,

      checkIn:
      checkInDate,

      checkOut:
      checkOutDate,

      totalAmount: finalAmount,
      amount: finalAmount,

      paymentStatus:
      paymentStatus ||
      "Pending",

      paymentMethod:
      paymentMethod ||
      "PayAtHotel",

    });

    await booking.save();

    const populatedBooking =
    await Booking.findById(
      booking._id
    )

    .populate("room");

    res.status(201).json(
      populatedBooking
    );

  } catch (error) {

    console.error(
      "ADD BOOKING ERROR:",
      error
    );

    res.status(500).json({

      message:
      "Error saving booking"

    });

  }

};

/* =====================================================
   UPDATE BOOKING (ADMIN)
===================================================== */
export const updateBooking = async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID"
      });
    }

    const { totalAmount, amount } = req.body;
    if (totalAmount !== undefined || amount !== undefined) {
      const finalAmount = totalAmount !== undefined ? totalAmount : amount;
      req.body.totalAmount = finalAmount;
      req.body.amount = finalAmount;
    }

    const updated =
    await Booking.findByIdAndUpdate(

      id,

      req.body,

      {
        new: true,
        runValidators: true
      }

    ).populate("room");

    if (!updated) {

      return res.status(404).json({

        message:
        "Booking not found"

      });

    }

    res.status(200).json(
      updated
    );

  } catch (error) {

    console.error(
      "UPDATE BOOKING ERROR:",
      error
    );

    res.status(500).json({

      message:
      "Error updating booking"

    });

  }

};

/* =====================================================
   CANCEL BOOKING (USER)
===================================================== */
export const cancelBooking = async (req, res) => {

  try {

    const { id } =
    req.params;

    if (

      !mongoose.Types.ObjectId.isValid(id)

    ) {

      return res.status(400).json({

        message:
        "Invalid booking ID"

      });

    }

    const booking =
    await Booking.findOne({

      _id: id,

      user: req.user.id,

    });

    if (!booking) {

      return res.status(404).json({

        message:
        "Booking not found"

      });

    }

    await booking.deleteOne();

    res.status(200).json({

      message:
      "Booking cancelled successfully"

    });

  } catch (error) {

    console.error(
      "CANCEL BOOKING ERROR:",
      error
    );

    res.status(500).json({

      message:
      "Error cancelling booking"

    });

  }

};

/* =====================================================
   DELETE BOOKING (ADMIN)
===================================================== */
export const deleteBooking = async (req, res) => {

  try {

    const { id } =
    req.params;

    if (

      !mongoose.Types.ObjectId.isValid(id)

    ) {

      return res.status(400).json({

        message:
        "Invalid booking ID"

      });

    }

    const deleted =
    await Booking.findByIdAndDelete(id);

    if (!deleted) {

      return res.status(404).json({

        message:
        "Booking not found"

      });

    }

    res.status(200).json({

      message:
      "Booking deleted successfully"

    });

  } catch (error) {

    console.error(
      "DELETE BOOKING ERROR:",
      error
    );

    res.status(500).json({

      message:
      "Error deleting booking"

    });

  }

};

