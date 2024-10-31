require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./route/authroute");
const bookingRoute = require("./route/bookingroute");

const App = express();
App.use(express.json());
// App.use(cors());

// Routes
App.use("/auth", authRoute);
App.use("/booking", bookingRoute);
App.get("/", (req, res) => {
  res.send("Server Started");
});

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    App.listen(process.env.PORT, () => {
      console.log(
        `Database Connected and server is listening on http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err); // Added detailed error log
  });

module.exports = App;
