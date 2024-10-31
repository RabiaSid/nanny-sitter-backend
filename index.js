require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authroute = require("./route/authroute");
const bookingroute = require("./route/bookingroute");

const App = express();
App.use(express.json());
// const corsOptions = {
//   origin: "http://localhost:3000", // Adjust to your frontend's URL
//   methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
//   credentials: true, // Allow credentials (if needed)
// };

// App.use(cors(corsOptions));

// Routes
App.use("/auth", authroute);
App.use("/booking", bookingroute);
App.get("/", (req, res) => {
  res.send({ message: "Server Started" });
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
