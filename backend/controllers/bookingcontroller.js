import Booking from "../models/booking.js";
import Provider from "../models/provider.js";

// Create booking (by user)
export const createBooking = async(req, res) => {
    try {
        const { provider, date, time, address } = req.body;

        if (!provider || !date || !time || !address) {
            return res.status(400).json({ message: "All fields required" });
        }

        const existingProvider = await Provider.findById(provider);
        if (!existingProvider) return res.status(404).json({ message: "Provider not found" });

        const booking = await Booking.create({
            user: req.user._id,
            provider: existingProvider._id,
            date,
            time,
            address,
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get bookings for logged-in user
export const getBookingsByUser = async(req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("provider", "serviceType location experience image")
            .populate("user", "name email");

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get bookings for logged-in provider
export const getBookingsByProvider = async(req, res) => {
    try {
        const provider = await Provider.findOne({ user: req.user._id });
        if (!provider) return res.status(404).json({ message: "Provider not found" });

        const bookings = await Booking.find({ provider: provider._id })
            .populate("user", "name email")
            .populate("provider", "serviceType location experience image");

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Provider updates booking status
export const updateBookingStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) return res.status(400).json({ message: "Status is required" });

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        booking.status = status;
        await booking.save();

        res.status(200).json({ message: "Booking status updated", booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};