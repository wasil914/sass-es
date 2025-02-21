// const Availability = require("../models/Availability");
// const Shift = require("../models/Shift");
// const { generateSchedule } = require("./scheduleController");

// // ✅ Set or Update Employee Availability
// const updateAvailability = async (req, res) => {
//   const { preferredShifts, maxHoursPerWeek, daysOff } = req.body;
//   const userId = req.user.id;

//   try {
//     let availability = await Availability.findOne({ user: userId });

//     if (availability) {
//       // ✅ Update existing availability
//       availability.preferredShifts = preferredShifts;
//       availability.maxHoursPerWeek = maxHoursPerWeek;
//       availability.daysOff = daysOff;
//     } else {
//       // ✅ Create new availability record
//       availability = new Availability({ user: userId, preferredShifts, maxHoursPerWeek, daysOff });
//     }

//     await availability.save();

//     // ✅ Recalculate schedule dynamically
//     await generateSchedule(req, res);

//     res.status(200).json({ message: "Availability updated & shifts recalculated", availability });
//   } catch (error) {
//     console.error("Error updating availability:", error.message);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // ✅ Get Employee's Availability
// const getAvailability = async (req, res) => {
//   try {
//     const availability = await Availability.findOne({ user: req.user.id });

//     if (!availability) return res.status(404).json({ message: "No availability set" });

//     res.status(200).json(availability);
//   } catch (error) {
//     console.error("Error fetching availability:", error.message);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // ✅ Get Shift Notifications (If Employee's Preferences are Not Fully Met)
// const getShiftNotification = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const shifts = await Shift.find({ employees: userId });

//     if (!shifts.length) {
//       return res.status(200).json({ message: "No assigned shifts. Your preferences may not be met." });
//     }

//     res.status(200).json({ message: "Shift assignments retrieved", shifts });
//   } catch (error) {
//     console.error("Error fetching shift notifications:", error.message);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// module.exports = { updateAvailability, getAvailability, getShiftNotification };

const Availability = require("../models/Availability");
const Shift = require("../models/Shift");
const { generateSchedule } = require("./scheduleController");

// ✅ Set or Update Employee Availability
const updateAvailability = async (req, res) => {
  const { preferredShifts, maxHoursPerWeek, daysOff } = req.body;
  const userId = req.user.id;

  try {
    // ✅ Validate max hours per week (between 10 - 50 hours)
    if (maxHoursPerWeek < 10 || maxHoursPerWeek > 50) {
      return res.status(400).json({ message: "❌ Max hours per week must be between 10 and 50." });
    }

    // ✅ Validate `preferredShifts` to ensure it contains valid shift types
    const validShifts = ["morning", "afternoon", "night", "none"];
    for (let day in preferredShifts) {
      if (!validShifts.includes(preferredShifts[day])) {
        return res.status(400).json({ message: `❌ Invalid shift type for ${day}: ${preferredShifts[day]}` });
      }
    }

    // ✅ Ensure `daysOff` is an array
    if (!Array.isArray(daysOff)) {
      return res.status(400).json({ message: "❌ Days off must be an array." });
    }

    let availability = await Availability.findOne({ user: userId });

    if (availability) {
      // ✅ Update existing availability
      availability.preferredShifts = preferredShifts;
      availability.maxHoursPerWeek = maxHoursPerWeek;
      availability.daysOff = daysOff;
    } else {
      // ✅ Create new availability record
      availability = new Availability({ user: userId, preferredShifts, maxHoursPerWeek, daysOff });
    }

    await availability.save();

    // ✅ Recalculate schedule dynamically
    const scheduleUpdated = await generateSchedule();
    if (!scheduleUpdated) {
      return res.status(500).json({ message: "❌ Failed to recalculate shifts." });
    }

    res.status(200).json({ message: "✅ Availability updated & shifts recalculated", availability });
  } catch (error) {
    console.error("❌ Error updating availability:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get Employee's Availability
const getAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({ user: req.user.id });

    if (!availability) {
      return res.status(404).json({ message: "⚠️ No availability set yet." });
    }

    res.status(200).json(availability);
  } catch (error) {
    console.error("❌ Error fetching availability:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get Shift Notifications (If Employee's Preferences are Not Fully Met)
const getShiftNotification = async (req, res) => {
  const userId = req.user.id;

  try {
    const shifts = await Shift.find({ employees: userId });

    if (!shifts.length) {
      return res.status(200).json({ message: "⚠️ No assigned shifts. Your preferences may not be met." });
    }

    res.status(200).json({ message: "✅ Shift assignments retrieved", shifts });
  } catch (error) {
    console.error("❌ Error fetching shift notifications:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { updateAvailability, getAvailability, getShiftNotification };
