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

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    // Serve frontend static files from frontend/dist
    app.use(express.static(path.join(__dirname, "frontend", "dist")));

    // Catch-all route for React SPA
    app.get("/*", (req, res) =>
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
    );
}

// 404 handler for API routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});