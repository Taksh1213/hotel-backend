import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST BE FIRST LINE

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();


/* ===========================
   DATABASE CONNECTION
=========================== */
connectDB();

/* ===========================
   CORS FIX (UPDATED)
=========================== */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* ===========================
   MIDDLEWARE
=========================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

/* ===========================
   ROUTES
=========================== */
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/user", userAuthRoutes);
app.use("/api/payment", paymentRoutes);
/* ===========================
   GLOBAL ERROR HANDLER
=========================== */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.message);
  res.status(500).json({ message: err.message });
});

/* ===========================
   SERVER START
=========================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});