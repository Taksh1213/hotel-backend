import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Room from "../models/Room.js";

dotenv.config(); // Load .env variables

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, amount } = req.body; // 🔹 get amount from frontend

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 🔹 Use frontend total amount if provided, else calculate
    let totalAmount = amount;
    if (!totalAmount) {
      // fallback: calculate nights × price
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.max(0, (end - start) / (1000 * 60 * 60 * 24));
      totalAmount = nights * room.price;
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Room ${room.roomNumber} (${room.type})`,
              description: `Booking from ${checkIn || "N/A"} to ${checkOut || "N/A"}`,
            },
            unit_amount: Math.round(totalAmount * 100), // ⚡ amount in paise
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?roomId=${roomId}`,
      cancel_url: `${process.env.CLIENT_URL}/rooms`,
    });

    // Return session URL
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;