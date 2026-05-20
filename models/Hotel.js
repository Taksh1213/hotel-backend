import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },

    totalRooms: {
      type: Number,
      default: 0,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String, // stores image file path or URL
      },
    ],
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;