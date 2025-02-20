const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Import Routes
const authRoutes = require("./routes/authRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/schedule", scheduleRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("SaaS-ES Backend is running...");
});

// Handle 404 Routes
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
