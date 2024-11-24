const Booking = require("../../model/bookingmodel");
const User = require("../../model/authmodel");
const { SendResponse } = require("../../helper/index");

const BookingController = {
  add: async (req, res) => {
    try {
      const {
        parentId,
        nannyId,
        location,
        childrenCount,
        childrenAges,
        schedule,
        message,
        status,
        budget,
      } = req.body;

      if (
        !parentId ||
        !location ||
        !childrenCount ||
        !childrenAges ||
        !schedule ||
        !message ||
        !status ||
        !budget
      ) {
        return res
          .status(400)
          .send(SendResponse(false, "All fields are required"));
      }

      const newBooking = new Booking({
        parentId,
        nannyId,
        location,
        childrenCount,
        childrenAges,
        schedule,
        message,
        status,
        budget,
      });

      const parent = await User.findById(parentId);
      if (!parent) {
        return res.status(404).send(SendResponse(false, "Parent not found"));
      }

      const savedBooking = await newBooking.save();
      res
        .status(201)
        .send(
          SendResponse(
            true,
            "Booking request created successfully!",
            savedBooking
          )
        );
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).send(SendResponse(false, "Internal server error"));
    }
  },
  // user
  // add: async (req, res) => {
  //   try {
  //     const { nannyId, parentId, message, status, startTime, endTime } =
  //       req.body;

  //     if (
  //       !nannyId ||
  //       !parentId ||
  //       !message ||
  //       !status ||
  //       !startTime ||
  //       !endTime
  //     ) {
  //       return res
  //         .status(400)
  //         .send(SendResponse(false, "All fields are required", res));
  //     }

  //     const newBooking = new Booking({
  //       nannyId,
  //       parentId,
  //       message,
  //       status,
  //       startTime,
  //       endTime,
  //     });

  //     const parent = await User.findById(parentId);
  //     if (!parent) {
  //       return res.status(404).send(SendResponse(false, "Parent not found"));
  //     }

  //     const nanny = await User.findById(nannyId);
  //     if (!nanny) {
  //       return res.status(404).send(SendResponse(false, "Nanny not found"));
  //     }

  //     const isBooked = nanny.bookings.some(
  //       (booking) =>
  //         (startTime >= booking.startTime && startTime < booking.endTime) ||
  //         (endTime > booking.startTime && endTime <= booking.endTime)
  //     );

  //     if (isBooked) {
  //       return res
  //         .status(400)
  //         .send(
  //           SendResponse(false, "Nanny is already booked during this time.")
  //         );
  //     }

  //     nanny.bookings.push({ startTime, endTime });
  //     const savedBooking = await newBooking.save();
  //     res
  //       .status(200)
  //       .send(SendResponse("Nanny booked successfully.", true, savedBooking));
  //   } catch (error) {
  //     console.error("Error booking nanny:", error);
  //     res.status(500).send(SendResponse(false, "Internal server error"));
  //   }
  // },

  get: async (req, res) => {
    try {
      const { nannyId } = req.query;
      let query = {};

      if (nannyId) {
        query = { nannyId };
      }

      const result = await Booking.find(query);

      res.status(200).send(SendResponse(true, "", result));
    } catch (error) {
      res.status(500).send(SendResponse(false, "Internal Server Error", error));
    }
  },

  getAll: async (req, res) => {
    try {
      const bookings = await Booking.find({});
      res
        .status(200)
        .send(SendResponse(true, "Bookings retrieved successfully", bookings));
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).send(SendResponse(false, "Internal server error"));
    }
  },

  getById: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return res.status(404).send(SendResponse(false, "Booking not found"));
      }

      res
        .status(200)
        .send(SendResponse(true, "Booking retrieved successfully", booking));
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).send(SendResponse(false, "Internal server error"));
    }
  },

  edit: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const {
        location,
        childrenCount,
        childrenAges,
        schedule,
        budget,
        status,
      } = req.body;

      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { location, childrenCount, childrenAges, schedule, budget, status },
        { new: true } // return the updated document
      );

      if (!updatedBooking) {
        return res.status(404).send(SendResponse(false, "Booking not found"));
      }

      res
        .status(200)
        .send(
          SendResponse(true, "Booking updated successfully", updatedBooking)
        );
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).send(SendResponse(false, "Internal server error"));
    }
  },

  del: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const deletedBooking = await Booking.findByIdAndDelete(bookingId);

      if (!deletedBooking) {
        return res.status(404).send(SendResponse(false, "Booking not found"));
      }

      res.status(200).send(SendResponse(true, "Booking deleted successfully"));
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).send(SendResponse(false, "Internal server error"));
    }
  },

  deleteAll: async (req, res) => {
    try {
      const deletedUser = await Booking.deleteMany({});

      if (deletedUser.deletedCount === 0) {
        return res
          .status(404)
          .send(SendResponse(false, "No User found to delete"));
      }

      res.status(200).send(SendResponse(true, "All User deleted successfully"));
    } catch (error) {
      console.error("Error deleting all User:", error);
      res.status(500).send(SendResponse(false, "Internal server error"));
    }
  },
};

module.exports = BookingController;
