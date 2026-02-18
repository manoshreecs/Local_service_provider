import express from "express";
import auth from "../middlewares/auth.js";
import isProvider from "../middlewares/provider.js";
import {
    createProvider,
    getProviders,
    getProvidersByService,
    getMyProviders,
    updateProviderStatus,
    deleteProvider,
    getProviderById // Import the new function
} from "../controllers/providercontroller.js";
import upload from "../config/multer.js";

const router = express.Router();

// Provider-only routes
router.get("/my", auth, isProvider, getMyProviders);
router.post("/", auth, isProvider, upload.single("image"), createProvider);

// Public routes
router.get("/", getProviders);
router.get("/service/:serviceType", getProvidersByService);
router.get("/:id", getProviderById); // NEW: This allows the BookingPage to work!

// Management routes
router.put("/:id", auth, isProvider, updateProviderStatus);
router.delete("/:id", auth, isProvider, deleteProvider);

export default router;