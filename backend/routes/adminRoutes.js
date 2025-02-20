const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const { setEmployeeRole, setShiftConstraints, getShiftConstraints } = require("../controllers/adminController");

const router = express.Router();

// ✅ Only admins can assign employee roles
router.put("/set-role", protect, isAdmin, setEmployeeRole);

// ✅ Only admins can set shift constraints
router.put("/set-shift-constraints", protect, isAdmin, setShiftConstraints);

// ✅ Only admins can get shift constraints
router.get("/get-shift-constraints", protect, isAdmin, getShiftConstraints);

module.exports = router;
