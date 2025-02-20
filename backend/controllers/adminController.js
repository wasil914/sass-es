const User = require("../models/User");
const ShiftSettings = require("../models/ShiftSettings");

// ✅ Set Employee Role (Admin-Only)
const setEmployeeRole = async (req, res) => {
  const { userId, role } = req.body;

  // ✅ Validate role
  if (!["Junior", "Mid-Level", "Senior"].includes(role)) {
    return res.status(400).json({ message: "Invalid role. Choose Junior, Mid-Level, or Senior." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.status(200).json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Set Shift Constraints (Admin-Only)
const setShiftConstraints = async (req, res) => {
  const { minEmployeesPerShift, maxEmployeesPerShift, requireSenior } = req.body;

  try {
    let settings = await ShiftSettings.findOne();
    
    if (!settings) {
      settings = new ShiftSettings({ minEmployeesPerShift, maxEmployeesPerShift, requireSenior });
    } else {
      settings.minEmployeesPerShift = minEmployeesPerShift;
      settings.maxEmployeesPerShift = maxEmployeesPerShift;
      settings.requireSenior = requireSenior;
    }

    await settings.save();
    res.status(200).json({ message: "Shift constraints updated", settings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Shift Constraints (Admin-Only)
const getShiftConstraints = async (req, res) => {
  try {
    const settings = await ShiftSettings.findOne();
    if (!settings) return res.status(404).json({ message: "No shift settings found" });

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { setEmployeeRole, setShiftConstraints, getShiftConstraints };
