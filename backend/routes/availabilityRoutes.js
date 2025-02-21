const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { updateAvailability, getAvailability, getShiftNotification } = require("../controllers/availabilityController");

const router = express.Router();

// ✅ Get Employee Availability
router.get("/", protect, getAvailability);

// ✅ Update Employee Availability
router.post("/set", protect, updateAvailability);

// ✅ Get Shift Notifications (If Preferences Not Met)
router.get("/notifications", protect, getShiftNotification);

module.exports = router;
