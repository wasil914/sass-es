const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  shiftTime: { type: String, enum: ["morning", "afternoon", "night"], required: true },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Shift", shiftSchema);
