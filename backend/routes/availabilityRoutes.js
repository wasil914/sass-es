const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { updateAvailability, getAvailability, getShiftNotification } = require("../controllers/availabilityController");

const router = express.Router();

// ✅ Update availability & recalculate shifts
router.post("/update", protect, updateAvailability);

// ✅ Get employee's availability
router.get("/", protect, getAvailability);

// ✅ Get shift notifications
router.get("/notifications", protect, getShiftNotification);

module.exports = router;
