import dotenv from "dotenv";
dotenv.config(); // MUST BE FIRST

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
import contactRoutes from "./routes/contactRoutes.js"; // NEW
import paymentHistoryRoutes from "./routes/paymentHistoryRoutes.js";

const app = express();

/* ===========================
   DATABASE CONNECTION
=========================== */
connectDB();

/* ===========================
   CORS
=========================== */

const CLIENT_URL = process.env.CLIENT_URL?.replace(/\/+$/, "");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",

  // production frontend
  CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow Postman/mobile requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error(
            `CORS blocked: ${origin}`
          )
        );
      }
    },

    credentials: true
  })
);

/* ===========================
   MIDDLEWARE
=========================== */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

/* ===========================
   STATIC FOLDER
=========================== */

app.use(
  "/uploads",
  express.static("uploads")
);

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

app.use("/api/contact", contactRoutes); // NEW ROUTE

app.use(
  "/api/payments",
  paymentHistoryRoutes
);

// NEW ROUTE

/* ===========================
   GLOBAL ERROR HANDLER
=========================== */

app.use((err, req, res, next) => {

  console.error(
    "GLOBAL ERROR:",
    err.message
  );

  res.status(500).json({
    success: false,
    message: err.message
  });

});
/* ===========================
   ROOT ROUTE
=========================== */

app.get("/", (req, res) => {

  res.status(200).json({

    success: true,

    message:
      "Hotel Management Backend API Running 🚀"

  });

});
/* ===========================
   SERVER START
=========================== */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT} 🚀`
  );

});