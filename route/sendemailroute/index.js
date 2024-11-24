const express = require("express");
const SendEmailController = require("../../controllers/send-email-controller");
const route = express.Router();

route.post("/", SendEmailController.sendEmail);
route.get("/", SendEmailController.getSendEmails);

module.exports = route;
