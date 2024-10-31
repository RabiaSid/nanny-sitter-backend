require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authroute = require("./route/authroute");
const bookingroute = require("./route/bookingroute");

const App = express();
App.use(express.json());
const corsOptions = {
  origin: "https://nanny-sitter-backend.vercel.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

App.use(cors());

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
