import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },

    customerType: {
      type: String,
      enum: ["Guest", "Regular", "VIP"],
      default: "Guest",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);