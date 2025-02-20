const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const { generateSchedule } = require("../controllers/scheduleController");

const router = express.Router();

// ✅ Generate Weekly Schedule (Admin-Only)
router.post("/generate", protect, isAdmin, generateSchedule);

module.exports = router;
