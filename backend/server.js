import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
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

app.get("/api", (req, res) => {
    res.json({ message: "API is running 🚀" });
});

// Resolve __dirname in ES modules
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    // Correct path to frontend build
    const frontendPath = path.join(__dirname, "..", "frontend", "dist");

    // Serve static files
    app.use(express.static(frontendPath));

    // Fallback for all unmatched non-API routes (SPA)
    app.use((req, res, next) => {
        if (req.path.startsWith("/api")) return next(); // skip API routes
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

// 404 handler for unmatched API routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});