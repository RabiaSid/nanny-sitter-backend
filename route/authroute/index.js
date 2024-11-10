const express = require("express");
const AuthController = require("../../controllers/authcontroller");
const route = express.Router();
const passport = require("passport");

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

route.get("/", AuthController.getUsers);
route.get("/:id", AuthController.getUserById);
route.post("/user-signup", AuthController.userSignup);
route.post("/nanny-signup", AuthController.nannySignup);
route.post("/admin-signup", AuthController.adminSignup);
route.post("/login", AuthController.login);
route.put("/:id", AuthController.editUsers);
route.delete("/:id", AuthController.deleteUser);
route.delete("/", AuthController.deleteAll);
// route.post('/setup-payment', AuthController.createOrUpdateStripeCustomer);
// route.post('/charge-customer', AuthController.chargeCustomer);

module.exports = route;
