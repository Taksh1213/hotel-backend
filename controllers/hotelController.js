import Hotel from "../models/Hotel.js";

export const addHotel = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { name, location, pricePerNight, totalRooms, description } = req.body;

    // Prevent crash if no images uploaded
    const imagePaths = req.files && req.files.length > 0
      ? req.files.map((file) => file.path)
      : [];

    const hotel = new Hotel({
      name,
      location,
      pricePerNight,
      totalRooms,
      description,
      images: imagePaths,
    });

    await hotel.save();

    res.status(201).json(hotel);
  } catch (error) {
    console.error("ADD HOTEL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};