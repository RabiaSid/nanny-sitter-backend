const express = require("express");
const router = express.Router();
const BookingController = require("../../controllers/bookingcontroller");

router.post("/chatbot-Booking", BookingController.chatBotBooking);

router.post("/", BookingController.add);

router.get("/", BookingController.get);

router.get("/all", BookingController.getAll);

router.get("/:id", BookingController.getById);

router.put("/:id", BookingController.edit);

router.delete("/:id", BookingController.del);

router.delete("/", BookingController.deleteAll);

module.exports = router;
