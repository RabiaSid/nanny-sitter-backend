const UserModel = require("../../model/authmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SendResponse } = require("../../helper/index");

const AuthController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const missingFields = [];
      if (!email) missingFields.push("email");
      if (!password) missingFields.push("password");

      if (missingFields.length) {
        return res
          .status(400)
          .send(SendResponse(false, "Some fields are missing", missingFields));
      }

      const userExist = await UserModel.findOne({ email });
      if (!userExist) {
        return res.status(400).send(SendResponse(false, "Credential Error"));
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        userExist.password
      );
      if (!isPasswordCorrect) {
        return res.status(400).send(SendResponse(false, "Credential Error"));
      }

      if (!process.env.Jwt_KEY) {
        return res
          .status(500)
          .send(
            SendResponse(false, "Internal Server Error: Missing secret key")
          );
      }

      const token = jwt.sign({ id: userExist._id }, process.env.Jwt_KEY, {
        expiresIn: "24h",
      });
      return res
        .status(200)
        .send(
          SendResponse(true, "Login Successfully", { user: userExist, token })
        );
    } catch (error) {
      console.error("Login error:", error);
      return res
        .status(500)
        .send(SendResponse(false, "Internal Server Error", error.message));
    }
  },

  userSignup: async (req, res) => {
    try {
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "role",
        "password",
        "region",
        "serviceType",
        "zipCode",
        "isActive",
        "sharingNanny",
        "parentJobDescription",
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length) {
        return res
          .status(400)
          .send(SendResponse(false, "Some Fields are Missing", missingFields));
      }

      const { email, password } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .send(SendResponse(false, "This Email is already Exist"));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({ ...req.body, password: hashedPassword });
      const savedUser = await newUser.save();

      return res
        .status(200)
        .send(SendResponse(true, "User Created Successfully", savedUser));
    } catch (error) {
      console.error("Signup error:", error);
      return res
        .status(500)
        .send(SendResponse(false, "Internal Server Error", error.message));
    }
  },

  nannySignup: async (req, res) => {
    try {
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "role",
        "password",
        "region",
        "serviceType",
        "zipCode",
        "isActive",
        "budget",
        "isAIDcertificate",
        "isCPRcertificate",
        "isDrivingLicense",
        "doHouseKeeping",
        "doMealPrep",
        "careSpecialChild",
        "isLiven",
        "Language",
        "childAgeGroup",
        "experience",
        "aboutYourself",
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length) {
        return res
          .status(400)
          .send(SendResponse(false, "Some Fields are Missing", missingFields));
      }

      const { email, password } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .send(SendResponse(false, "This Email is already Exist"));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({ ...req.body, password: hashedPassword });
      const savedUser = await newUser.save();

      return res
        .status(200)
        .send(SendResponse(true, "User Created Successfully", savedUser));
    } catch (error) {
      console.error("Nanny signup error:", error);
      return res
        .status(500)
        .send(SendResponse(false, "Internal Server Error", error.message));
    }
  },

  adminSignup: async (req, res) => {
    try {
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "role",
        "password",
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length) {
        return res
          .status(400)
          .send(SendResponse(false, "Some Fields are Missing", missingFields));
      }

      const { email, password } = req.body;
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .send(SendResponse(false, "This Email is already Exist"));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({ ...req.body, password: hashedPassword });
      const savedUser = await newUser.save();

      return res
        .status(200)
        .send(SendResponse(true, "User Created Successfully", savedUser));
    } catch (error) {
      console.error("Admin signup error:", error);
      return res
        .status(500)
        .send(SendResponse(false, "Internal Server Error", error.message));
    }
  },

  getUsers: async (req, res) => {
    try {
      UserModel.find({})
        .then((result) => {
          res.status(200).send(SendResponse(true, "", result));
        })
        .catch((err) => {
          res
            .status(400)
            .send(SendResponse(false, "Internal Server Error", err));
        });
    } catch (e) {
      res.status(400).send(SendResponse(false, "Internal Server Error", e));
    }
  },

  getUserById: (req, res) => {
    try {
      let id = req.params.id;

      UserModel.findById(id)
        .then((result) => {
          res.status(200).send(SendResponse(true, "", result));
        })
        .catch((err) => {
          res
            .status(400)
            .send(SendResponse(false, "Internal Server Error 2222", err));
        });
    } catch (e) {
      res.status(400).send(SendResponse(false, "Internal Server Error", e));
    }
    // let id = req.params.id;

    // let obj = UserModel.find((x) => x.id == id);

    // if (obj) {
    //   res.send({
    //     isSuccessfull: true,
    //     data: obj,
    //     message: "",
    //   });
    // } else {
    //   res.send({
    //     isSuccessfull: true,
    //     data: null,
    //     message: "NO DATA Found",
    //   });
    // }
  },

  editUsers: async (req, res) => {
    try {
      let id = req.params.id;

      UserModel.findById(id)
        .exec()
        .then((existing) => {
          if (!existing) {
            res.status(400).send(SendResponse(false, "No record Found", null));
          } else {
            // Use req.body for the update data, not req.params.body
            UserModel.findByIdAndUpdate(id, req.body, {
              new: true,
              returnDocument: "after",
            })
              .exec()
              .then((result) => {
                res
                  .status(200)
                  .send(SendResponse(true, "Updated Successfully", result));
              })
              .catch((err) => {
                res
                  .status(500)
                  .send(SendResponse(false, "Internal Server Error", err));
              });
          }
        })
        .catch((err) => {
          res
            .status(500)
            .send(SendResponse(false, "Internal Server Error", err));
        });
    } catch (error) {
      res.status(500).send(SendResponse(false, "Internal Server Error", error));
    }
  },

  deleteUser: async (req, res) => {
    try {
      let id = req.params.id;
      UserModel.findByIdAndDelete(id)
        .then((result) => {
          res.status(200).send(SendResponse(true, "User Deleted Successfully"));
        })
        .catch((err) => {
          res
            .status(400)
            .send(SendResponse(true, "Internal Server Error", err));
        });
    } catch (e) {
      res.status(400).send(SendResponse(true, "Internal Server Error", e));
    }
  },

  protected: async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).send(SendResponse(false, "Un Authorized"));
      return;
    }

    jwt.verify(token, process.env.Jwt_KEY, (err, decoded) => {
      if (err) {
        res.status(401).send(SendResponse(false, "Un Authorized"));
      } else {
        // console.log(decoded)
        next();
      }
    });
  },

  // controllers/paymentController.js
  createOrUpdateStripeCustomer: async (req, res) => {
    const { userId, paymentMethodId } = req.body;

    try {
      const user = await CommonEntity.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If the user doesn't have a Stripe customer ID, create a new customer
      if (!user.stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          payment_method: paymentMethodId,
          invoice_settings: { default_payment_method: paymentMethodId },
        });

        user.stripeCustomerId = customer.id;
      } else {
        // If customer exists, update their default payment method
        await stripe.customers.update(user.stripeCustomerId, {
          payment_method: paymentMethodId,
          invoice_settings: { default_payment_method: paymentMethodId },
        });
      }

      // Attach the payment method to the customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId,
      });

      user.stripePaymentMethodId = paymentMethodId;
      await user.save();

      res
        .status(200)
        .json({ message: "Stripe customer and payment method saved", user });
    } catch (error) {
      res.status(500).json({
        message: "Error setting up payment method",
        error: error.message,
      });
    }
  },

  // Charge customer for a service
  chargeCustomer: async (req, res) => {
    const { userId, amount, currency } = req.body;

    try {
      const user = await CommonEntity.findById(userId);
      if (!user || !user.stripeCustomerId || !user.stripePaymentMethodId) {
        return res
          .status(404)
          .json({ message: "User or payment information not found" });
      }

      // Create payment intent using the saved customer ID and payment method
      const paymentIntent = await stripe.paymentIntents.create({
        customer: user.stripeCustomerId,
        amount: amount * 100, // Amount in cents
        currency: currency || "usd",
        payment_method: user.stripePaymentMethodId,
        off_session: true, // To indicate this is an off-session charge
        confirm: true,
      });

      res.status(200).json({ message: "Payment successful", paymentIntent });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error processing payment", error: error.message });
    }
  },
};

module.exports = AuthController;
