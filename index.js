require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const authRoute = require("./route/authroute");
const packageRoute = require("./route/packageroute");
const bookingRoute = require("./route/bookingroute");
const passport = require("passport");
const cookieSession = require("cookie-session");
const passportStrategy = require("./config/passport");

const App = express();

App.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

App.use(passport.initialize());
App.use(passport.session());
App.use(express.json());
App.use(cors())

// Routes
App.use("/auth", authRoute);
App.use("/package", packageRoute);
App.use("/booking", bookingRoute);
App.get("/", (req, res) => {
    res.send("Server Started");
});


mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => {
        App.listen(process.env.PORT, () => {
            console.log(
                `Database Connected and server is listening https://localhost:${process.env.PORT}`
            );
        });
    })
    .catch((err) => {
        console.log("err", err);
    });


