import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error
const Contact =
  mongoose.models.Contact ||
  mongoose.model("Contact", contactSchema);

export default Contact;