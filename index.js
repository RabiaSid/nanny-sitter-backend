require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authroute = require("./route/authroute");
const bookingroute = require("./route/bookingroute");
const sendEmailRoute = require("./route/sendemailroute");

const App = express();
App.use(express.json());
// const corsOptions = {
//   origin: " http://localhost:3000",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
// };

App.use(cors());

// App.options("*", cors());

// Routes
App.use("/auth", authroute);
App.use("/booking", bookingroute);
App.use("/sendEmail", sendEmailRoute);
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
