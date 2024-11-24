// controllers/send-email-controller.js
const { SendResponse } = require("../../helper/index");
const SendEmail = require("../../model/sendemailmodel"); // Adjust the path if necessary
const User = require("../../model/authmodel"); // Adjust the path if necessary
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL, // Ensure these environment variables are set
    pass: process.env.PASS,
  },
});

// Read email template HTML file
const emailTemplatePath = path.join(__dirname, "./email-template.html");
const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");

const SendEmailController = {
  sendEmail: async (req, res) => {
    try {
      const { email, url } = req.body;
      let obj = { email, url };

      // Validation logic
      let errArr = [];
      if (!obj.email) {
        errArr.push("Required email");
      }
      if (!obj.url) {
        errArr.push("Required URL");
      }
      if (errArr.length > 0) {
        return res
          .status(400)
          .json(SendResponse(false, "Validation Error!", errArr));
      }

      // Save obj into SendEmail collection
      const savedObj = await SendEmail.create({
        email: obj.email,
        url: obj.url,
      });

      // Retrieve all users
      const users = await User.find(); // Fetch all user documents

      if (!users.length) {
        return res
          .status(404)
          .json(SendResponse(false, "No users found to send emails."));
      }

      // Extract emails from user documents
      const emailList = users.map((user) => user.email);

      // Create the email message
      const mailOptions = {
        from: process.env.EMAIL, // Use the authenticated email
        to: emailList, // Array of recipient emails
        subject: "Email sent to all users",
        html: emailTemplate.replace("{{ email }}", obj.email),
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          // Optionally, handle email sending errors (e.g., retry logic)
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      // Log and send response
      console.log(`Email sent to ${users.length} users`);
      return res
        .status(200)
        .json(SendResponse(true, `Email sent to ${users.length} users`));
    } catch (error) {
      console.error("Error sending email:", error);
      return res
        .status(500)
        .json(
          SendResponse(false, "Failed to send email", error.message || error)
        );
    }
  },

  getSendEmails: async (req, res) => {
    try {
      const sentEmails = await SendEmail.find(); // Fetch all records from SendEmail collection
      return res
        .status(200)
        .json(SendResponse(true, "Data Fetched Successfully", sentEmails));
    } catch (e) {
      console.error("Error fetching sent emails:", e);
      return res
        .status(500)
        .json(SendResponse(false, "Internal Server Error", e.message || e));
    }
  },
};

module.exports = SendEmailController;
