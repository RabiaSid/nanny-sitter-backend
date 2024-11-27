const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  otp: { type: Number },
  expires: { type: Date },
});

module.exports = mongoose.model("otp", OtpSchema);
