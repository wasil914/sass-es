const Shift = require("../models/Shift");
const User = require("../models/User");
const Availability = require("../models/Availability");
const ShiftSettings = require("../models/ShiftSettings");

// ✅ Function to Generate Weekly Schedule
const generateSchedule = async (req, res) => {
  try {
    // ✅ Get Employee Availabilities
    const employees = await Availability.find().populate("user");
    const shiftConstraints = await ShiftSettings.findOne();

    if (!shiftConstraints) {
      return res.status(400).json({ message: "Shift constraints not set by admin." });
    }

    const { minEmployeesPerShift, maxEmployeesPerShift, requireSenior } = shiftConstraints;
    
    let shifts = [];
    let employeeShiftCounts = {}; // Track weekly shifts per employee

    for (const employee of employees) {
      const { preferredShifts, maxHoursPerWeek, user } = employee;

      if (!employeeShiftCounts[user._id]) {
        employeeShiftCounts[user._id] = 0;
      }

      let totalAssignedHours = 0;

      for (const [day, shiftTime] of Object.entries(preferredShifts)) {
        if (totalAssignedHours >= maxHoursPerWeek) break;

        // ✅ Check Employee Shift Count Limit
        if (employeeShiftCounts[user._id] >= 5) continue;

        // ✅ Ensure 12-hour gap between shifts (Basic Logic)
        const lastShift = shifts.find((s) => s.employees.includes(user._id));
        if (lastShift) {
          const lastShiftTime = new Date(lastShift.date).getTime();
          const newShiftTime = new Date(day).getTime();
          if (newShiftTime - lastShiftTime < 12 * 60 * 60 * 1000) continue; // Skip if less than 12-hour gap
        }

        // ✅ Assign Employee to Shift
        shifts.push({
          date: new Date(day),
          shiftTime,
          employees: [user._id]
        });

        employeeShiftCounts[user._id] += 1;
        totalAssignedHours += 8; // Each shift is 8 hours
      }
    }

    // ✅ Ensure Senior Employees in Every Shift
    if (requireSenior) {
      shifts.forEach(async (shift) => {
        const shiftUsers = await User.find({ _id: { $in: shift.employees } });
        const hasSenior = shiftUsers.some((u) => u.role === "Senior");
        if (!hasSenior) {
          const senior = await User.findOne({ role: "Senior" });
          if (senior) {
            shift.employees.push(senior._id);
          }
        }
      });
    }

    await Shift.insertMany(shifts);
    res.status(201).json({ message: "Schedule generated successfully", shifts });
  } catch (error) {
    res.status(500).json({ message: "Error generating schedule", error });
  }
};

module.exports = { generateSchedule };
