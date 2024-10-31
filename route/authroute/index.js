const express = require("express");
const authcontroller = require("../../controllers/authcontroller");
const route = express.Router();
// const passport = require("passport");

// route.get("/login/success", (req, res) => {
//     if (req.user) {
//         res.status(200).json({
//             error: false,
//             message: "Successfully Loged In",
//             user: req.user,
//         });
//     } else {
//         res.status(403).json({ error: true, message: "Not Authorized" });
//     }
// });

// route.get("/login/failed", (req, res) => {
//     res.status(401).json({
//         error: true,
//         message: "Log in failure",
//     });
// });

// route.get("/google", passport.authenticate("google", ["profile", "email"]));

// route.get(
//     "/google/callback",
//     passport.authenticate("google", {
//         successRedirect: process.env.CLIENT_URL,
//         failureRedirect: "/login/failed",
//     })
// );

// route.get("/logout", (req, res) => {
//     req.logout();
//     res.redirect(process.env.CLIENT_URL);
// });

route.get("/user", authcontroller.getUsers);
route.post("/user-signup", authcontroller.userSignup);
route.post("/nanny-signup", authcontroller.nannySignup);
route.post("/admin-signup", authcontroller.adminSignup);
route.post("/login", authcontroller.login);
route.put("/:id", authcontroller.editUsers);
route.delete("/:id", authcontroller.deleteUser);
// route.post('/setup-payment', authcontroller.createOrUpdateStripeCustomer);
// route.post('/charge-customer', authcontroller.chargeCustomer);

module.exports = route;
