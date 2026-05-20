import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: ["Single", "Double", "Suite", "Deluxe"],
      required: [true, "Room type is required"],
    },

    price: {
      type: Number,
      required: [true, "Room price is required"],
      min: [0, "Price cannot be negative"],
    },

    status: {
      type: String,
      enum: ["Available", "Booked", "Maintenance"],
      default: "Available",
    },

    // 🔥 Hotel Reference
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: [true, "Hotel reference is required"],
    },

    // 🔥 NEW IMAGE FIELD
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate room numbers in same hotel
roomSchema.index({ roomNumber: 1, hotel: 1 }, { unique: true });

export default mongoose.model("Room", roomSchema);