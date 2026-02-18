import Provider from "../models/provider.js";
import cloudinary from "../config/cloudinary.js";

export const createProvider = async(req, res) => {
    try {
        // Extract 'name' from req.body
        const { name, serviceType, experience, price, location } = req.body;
        let imageUrl = "";

        if (req.file) {
            const uploadPromise = new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ folder: "providers" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            imageUrl = await uploadPromise;
        }

        const provider = await Provider.create({
            user: req.user._id,
            name, // Save the business name
            serviceType,
            experience,
            price,
            location,
            image: imageUrl,
            isAvailable: true
        });
        res.status(201).json({ message: "Service provider created", provider });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Get a single provider by ID (Used by BookingPage)
export const getProviderById = async(req, res) => {
    try {
        const provider = await Provider.findById(req.params.id).populate("user", "name email");
        if (!provider) return res.status(404).json({ message: "Provider not found" });
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ message: "Invalid ID format" });
    }
};

export const getProviders = async(req, res) => {
    try {
        const providers = await Provider.find({ isAvailable: true }).populate("user", "name email");
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyProviders = async(req, res) => {
    try {
        const providers = await Provider.find({ user: req.user._id });
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProvidersByService = async(req, res) => {
    try {
        const { serviceType } = req.params;
        // Uses regex to find the service even if naming is slightly off (e.g. Carpenter vs Carpentry)
        const providers = await Provider.find({
            serviceType: { $regex: serviceType, $options: "i" },
            isAvailable: true
        }).populate("user", "name email");
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProviderStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { isAvailable } = req.body;
        const updated = await Provider.findOneAndUpdate({ _id: id, user: req.user._id }, { isAvailable }, { new: true });
        if (!updated) return res.status(404).json({ message: "Not found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProvider = async(req, res) => {
    try {
        const deleted = await Provider.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        if (!deleted) return res.status(404).json({ message: "Service not found" });
        res.json({ message: "Service deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting service" });
    }
};