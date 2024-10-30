require("dotenv").config();
console.log("CONNECTION_STRING:", process.env.CONNECTION_STRING);
console.log("PORT:", process.env.PORT);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoute = require("./route/authroute");
const bookingRoute = require("./route/bookingroute");
const passport = require("passport");
const cookieSession = require("cookie-session");

const App = express();

App.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

App.use(passport.initialize());
App.use(passport.session());
App.use(express.json());
App.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    credentials: true,
  })
);

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
