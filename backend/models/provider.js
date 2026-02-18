import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String, // Added this to store Business/Display Name
    serviceType: String,
    location: String,
    experience: Number,
    price: Number,
    image: String,
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Provider", providerSchema);