const express = require('express');
const router = express.Router();
const BookingController = require('../../controllers/bookingcontroller');


// chatbot Request
// Route to create a new booking
router.post('/chatbot-Booking', BookingController.chatBotBooking);

// direct to nanny
router.post('/direct-Booking', BookingController.bookDirect);

// Route to get all bookings (optional for admin)
router.get('/', BookingController.getAllBookings);

// Route to get a single booking by ID
router.get('/:id', BookingController.getBookingById);

// Route to update a booking (optional)
router.put('/:id', BookingController.updateBooking);

// Route to delete a booking (optional)
router.delete('/:id', BookingController.deleteBooking);

module.exports = router;