const Booking = require('../../model/bookingmodel');
const User = require('../../model/bookingmodel')


const BookingController = {


  // chatbot Request
  // Create a new booking
  chatBotBooking: async (req, res) => {
    try {
      const { location, childrenCount, childrenAges, schedule, budget } = req.body;

      if (!location || !childrenCount || !childrenAges || !schedule || !budget) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const newBooking = new Booking({
        location,
        childrenCount,
        childrenAges,
        schedule,
        budget
      });

      const savedBooking = await newBooking.save();
      res.status(201).json({ message: 'Booking request created successfully!', booking: savedBooking });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // direct to the nanny
  bookDirect: async (req, res) => {
    try {
      const { nannyId, startTime, endTime } = req.body;

      if (!nannyId || !startTime || !endTime) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const nanny = await User.findById(nannyId);
      if (!nanny) {
        return res.status(404).json({ message: 'Nanny not found' });
      }

      const isBooked = nanny.bookings.some(booking =>
        (startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime)
      );

      if (isBooked) {
        return res.status(400).json({ message: 'Nanny is already booked during this time.' });
      }

      nanny.bookings.push({ startTime, endTime });
      await nanny.save();
      res.status(200).json({ message: 'Nanny booked successfully.' });
    } catch (error) {
      console.error('Error booking nanny:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get all bookings (optional: for an admin view)
  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get a booking by ID
  getBookingById: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.status(200).json(booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update a booking (optional)
  updateBooking: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const { location, childrenCount, childrenAges, schedule, budget, status } = req.body;

      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { location, childrenCount, childrenAges, schedule, budget, status },
        { new: true } // return the updated document
      );

      if (!updatedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.status(200).json({
        message: 'Booking updated successfully!',
        booking: updatedBooking
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Delete a booking (optional)
  deleteBooking: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const deletedBooking = await Booking.findByIdAndDelete(bookingId);

      if (!deletedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.status(200).json({ message: 'Booking deleted successfully!' });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
}

module.exports = BookingController;
