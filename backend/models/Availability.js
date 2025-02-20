const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  preferredShifts: {
    monday: { type: String, enum: ["morning", "afternoon", "night", "none"], default: "none" },
    tuesday: { type: String, enum: ["morning", "afternoon", "night", "none"], default: "none" },
    wednesday: { type: String, enum: ["morning", "afternoon", "night", "none"], default: "none" },
    thursday: { type: String, enum: ["morning", "afternoon", "night", "none"], default: "none" },
    friday: { type: String, enum: ["morning", "afternoon", "night", "none"], default: "none" },
    saturday: { type: String, enum: ["morning", "afternoon", "night", "none"], default: "none" },
    sunday: { type: String, enum: ["morning", "afternoon", "night", "none"], default: "none" }
  },
  maxHoursPerWeek: { type: Number, min: 10, max: 40, required: true },
  daysOff: [{ type: String, enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] }]
});

module.exports = mongoose.model("Availability", AvailabilitySchema);
