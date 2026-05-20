import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();

    const today = new Date();
    const activeBookings = await Booking.countDocuments({
      checkIn: { $lte: today },
      checkOut: { $gte: today },
    });

    // Use correct field for total revenue
    const revenueData = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // Monthly bookings grouped by year + month
    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const bookingsChart = monthlyBookings.map((item) => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleString(
        "default",
        { month: "short" }
      ),
      bookings: item.bookings,
    }));

    // Monthly revenue grouped by year + month
    const monthlyRevenue = await Booking.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const revenueChart = monthlyRevenue.map((item) => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleString(
        "default",
        { month: "short" }
      ),
      revenue: item.revenue,
    }));

    res.json({
      totalRooms,
      activeBookings,
      totalRevenue,
      monthlyBookings: bookingsChart,
      monthlyRevenue: revenueChart,
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({ message: "Dashboard error" });
  }
};