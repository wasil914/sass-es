const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev")); // Logs requests

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/availability", require("./routes/availabilityRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/schedule", require("./routes/scheduleRoutes"));

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🚀 Smart Auto-Scheduling System API is running...");
});

// ✅ 404 Error Handling
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
