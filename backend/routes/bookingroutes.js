import express from "express";
import auth from "../middlewares/auth.js";
import isProvider from "../middlewares/provider.js";
import {
    createBooking,
    getBookingsByUser,
    getBookingsByProvider,
    updateBookingStatus
} from "../controllers/bookingcontroller.js";

const router = express.Router();

// USER routes
router.post("/", auth, createBooking);
router.get("/user", auth, getBookingsByUser);

// PROVIDER routes
router.get("/provider", auth, isProvider, getBookingsByProvider);

// Provider updates booking status
router.put("/status/:id", auth, isProvider, updateBookingStatus);

export default router;