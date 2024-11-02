const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema(
  {
    // Request to nanny
    nannyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    message: {
      type: String,
    },
    startTime: Date,
    endTime: Date,

    // chatbot Request
    location: {
      type: String,
    },
    childrenCount: {
      type: Number,
    },
    childrenAges: {
      type: [String],
    },
    schedule: {
      type: String,
    },
    budget: {
      type: String,
    },
    status: {
      type: String,
      // default: 'pending' // pending, confirmed, completed, etc.
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model("booking", BookingSchema);
module.exports = BookingModel;
