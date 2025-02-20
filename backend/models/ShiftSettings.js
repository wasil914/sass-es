const mongoose = require("mongoose");

const shiftSettingsSchema = new mongoose.Schema({
  minEmployeesPerShift: { type: Number, default: 2 },
  maxEmployeesPerShift: { type: Number, default: 5 },
  requireSenior: { type: Boolean, default: true }, // ✅ Require at least one senior employee
});

module.exports = mongoose.model("ShiftSettings", shiftSettingsSchema);
