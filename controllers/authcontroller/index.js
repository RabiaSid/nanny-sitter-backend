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

      // Check if the user exists
      const userExist = await UserModel.findOne({ email });
      if (!userExist) {
        return res.status(400).send(SendResponse(false, "Credential Error"));
      }

      // Verify the password
      const isPasswordCorrect = await bcrypt.compare(
        password,
        userExist.password
      );
      if (!isPasswordCorrect) {
        return res.status(400).send(SendResponse(false, "Credential Error"));
      }

      // If JWT secret key is missing, send an error
      if (!process.env.Jwt_KEY) {
        return res
          .status(500)
          .send(
            SendResponse(false, "Internal Server Error: Missing secret key")
          );
      }

      // Update the user's lastSeen field to the current time
      const updatedUser = await UserModel.findByIdAndUpdate(
        userExist._id,
        { lastSeen: Date.now() }, // Set lastSeen to the current time
        { new: true } // Return the updated user document
      );

      // Create a JWT token for the user
      const token = jwt.sign({ id: updatedUser._id }, process.env.Jwt_KEY, {
        expiresIn: "24h",
      });

      // Send the response back with user details and token
      return res
        .status(200)
        .send(
          SendResponse(true, "Login Successfully", { user: updatedUser, token })
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
        "image",
        "email",
        "role",
        "password",
        "region",
        "serviceType",
        "zipCode",
        "isActive",
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
        "image",
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

  deleteAll: async (req, res) => {
    try {
      const deletedUser = await UserModel.deleteMany({});

      if (deletedUser.deletedCount === 0) {
        return res
          .status(404)
          .send(SendResponse(false, "No User found to delete"));
      }

      res.status(200).send(SendResponse(true, "All User deleted successfully"));
    } catch (error) {
      console.error("Error deleting all User:", error);
      res.status(500).send(SendResponse(false, "Internal server error"));
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Validate email
      if (!email) {
        return res.status(400).send(SendResponse(false, "Email is required"));
      }

      // Find user by email
      const user = await UserSchema.findOne({ email });
      if (!user) {
        return res.status(404).send(SendResponse(false, "User not found"));
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

      // Generate reset token and expiry time
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // Token expires in 1 hour

      // Update user's reset token, expiry, and OTP in database
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      user.resetPasswordOTP = otp; // Store the OTP in the database
      await user.save();

      // Send email with OTP and reset token
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      });

      const mailOptions = {
        from: "rabiasid984@gmail.com",
        to: user.email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. Use this along with the reset token ${resetToken}.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res
            .status(500)
            .send(SendResponse(false, "Failed to send OTP email"));
        }
        console.log("Email sent:", info.response);
        return res
          .status(200)
          .send(SendResponse(true, "Password reset OTP sent to your email"));
      });
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .send(SendResponse(false, "Internal Server Error", e.message || e));
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { resetToken, otp, password } = req.body;

      // Validate inputs
      if (!resetToken || !otp || !password) {
        return res
          .status(400)
          .send(
            SendResponse(
              false,
              "Reset token, OTP, and new password are required"
            )
          );
      }

      // Find the user by reset token and check expiry
      const user = await UserSchema.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: new Date() }, // Check if expiry date is in the future
      });

      if (!user) {
        return res
          .status(400)
          .send(SendResponse(false, "Invalid or expired reset token"));
      }

      // Verify OTP
      if (user.resetPasswordOTP !== parseInt(otp, 10)) {
        return res.status(400).send(SendResponse(false, "Invalid OTP"));
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user's password and clear reset token fields
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      user.resetPasswordOTP = null;
      await user.save();

      return res
        .status(200)
        .send(SendResponse(true, "Password reset successfully"));
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .send(SendResponse(false, "Internal Server Error", e.message || e));
    }
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
