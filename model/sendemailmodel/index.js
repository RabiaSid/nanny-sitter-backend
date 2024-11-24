const mongoose = require("mongoose");

const sendEmailSchema = new mongoose.Schema(
  {
    email: { type: String },
    url: { type: String },
  },
  { timestamps: true }
);

const SendEmail = mongoose.model("SendEmail", sendEmailSchema);

module.exports = SendEmail;
