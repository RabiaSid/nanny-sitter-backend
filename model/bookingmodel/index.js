const mongoose = require('mongoose');

// Define the Booking Schema
const bookingSchema = new mongoose.Schema({

  // Request to nanny
  nannyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nanny' },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
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
    default: Date.now
  }
});

// Export the Booking Model
module.exports = mongoose.model('Booking', bookingSchema);
