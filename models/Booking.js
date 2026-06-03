import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
{
  customerName: {
    type: String,
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },

  checkIn: {
    type: Date,
    required: true,
  },

  checkOut: {
    type: Date,
    required: true,
  },

  totalAmount: {
    type: Number,
    required: true,
  },

  amount: {
    type: Number,
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },

  paymentMethod: {
    type: String,
    enum: ["Stripe", "PayAtHotel"],
    default: "PayAtHotel",
  },
},
{ timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);