import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectdb from "./config/db.js";

dotenv.config();
connectdb();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        credentials: true,
    })
);

// Routes
import authroutes from "./routes/authroutes.js";
import providerroutes from "./routes/providerroutes.js";
import bookingroutes from "./routes/bookingroutes.js";

app.use("/api/auth", authroutes);
app.use("/api/providers", providerroutes);
app.use("/api/bookings", bookingroutes);

// Root route to check backend
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});