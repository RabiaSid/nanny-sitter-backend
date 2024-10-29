const UserModel = require("../../model/authmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SendResponse } = require("../../helper/index");

const AuthController = {
  login: async (req, res) => {
    let { email, password } = req.body;
    let obj = { email, password };
    let arr = ["email", "password"];
    let errArr = [];
    arr.forEach((x) => {
      if (!obj[x]) {
        errArr.push(x);
      }
    });
    if (errArr.length > 0) {
      res
        .send(SendResponse("Some Fields are missing", false, errArr))
        .status(400);
    } else {
      let userExist = await UserModel.findOne({ email: obj.email });
      if (!userExist) {
        res.status(400).send(SendResponse("Credential Error", false));
        return;
      } else {
        let isConfirm = bcrypt.compare(obj.password, userExist.password);
        if (isConfirm) {
          let token = jwt.sign({ ...userExist }, process.env.SECURE_KEY, {
            expiresIn: "24h",
          });
          res.status(200).send(
            SendResponse("Login Successfully", true, {
              user: userExist,
              token: token,
            })
          );
        }
      }
    }
  },
  userSignup: async (req, res) => {
    let {
      firstName, lastName, email, role, password, region, serviceType, zipCode, isActive, totalKids, sharingNanny, parentJobDescription,
    } = req.body;
    let obj = {
      firstName, lastName, email, role, password, region, serviceType, zipCode, isActive, totalKids, sharingNanny, parentJobDescription,
    };
    let arr = [
      "firstName", "lastName", "email", "role", "password", "region", "serviceType", "zipCode", "isActive", "totalKids", "sharingNanny", "parentJobDescription",];
    let errArr = [];

    arr.forEach((x) => {
      if (!obj[x]) {
        errArr.push(x);
        console.log(x);
      }
    });
    if (errArr.length > 0) {
      res.status(400).send(SendResponse(`Some Fields are Missing`, false));
    } else {
      obj.password = await bcrypt.hash(obj.password, 10);
      let existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res
          .status(400)
          .send(SendResponse("this Email is already Exist", false));
      } else {
        let user = new UserModel(obj);
        await user
          .save()
          .then((user) => {
            res
              .status(200)
              .send(SendResponse("User Created Successfully", true, user));
          })
          .catch((err) => {
            res
              .status(400)
              .send(SendResponse("Internal Server Error", false, err));
          });
      }
    }
  },
  nannySignup: async (req, res) => {
    let {
      firstName, lastName, email, role, password, region, serviceType, zipCode, isActive, budget, isAIDcertificate, isCPRcertificate, isDrivingLicense, doHouseKeeping, doMealPrep, houseKeeping, careSpecialChild, isLiven, Language, childAgeGroup, experience, aboutYourself
    } = req.body;
    let obj = {
      firstName, lastName, email, role, password, region, serviceType, zipCode, isActive, budget, isAIDcertificate, isCPRcertificate, isDrivingLicense, doHouseKeeping, doMealPrep, houseKeeping, careSpecialChild, isLiven, Language, childAgeGroup, experience,  aboutYourself
    };
    let arr = ["firstName", "lastName", "email", "role", "password", "region", "serviceType", "zipCode", "isActive", "budget", "isAIDcertificate", "isCPRcertificate", "isDrivingLicense", "doHouseKeeping", "doMealPrep", "houseKeeping", "careSpecialChild", "isLiven", "Language", "childAgeGroup", "experience", " aboutYourself"];
    let errArr = [];

    arr.forEach((x) => {
      if (!obj[x]) {
        errArr.push(x);
        console.log(x);

      }
    });
    if (errArr.length > 0) {
      res.status(400).send(SendResponse("Some Fields are Missing", false));
    } else {
      obj.password = await bcrypt.hash(obj.password, 10);
      let existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res
          .status(400)
          .send(SendResponse("this Email is already Exist", false));
      } else {
        let user = new UserModel(obj);
        await user
          .save()
          .then((user) => {
            res
              .status(200)
              .send(SendResponse("User Created Successfully", true, user));
          })
          .catch((err) => {
            res
              .status(400)
              .send(SendResponse("Internal Server Error", false, err));
          });
      }
    }
  },
  adminSignup: async (req, res) => {
    let {
      firstName, lastName, email, role, password
    } = req.body;
    let obj = {
      firstName, lastName, email, role, password
    };
    let arr = ["firstName", "lastName", "email", "role", "password"];
    let errArr = [];

    arr.forEach((x) => {
      if (!obj[x]) {
        errArr.push(x);
      }
    });
    if (errArr.length > 0) {
      res.status(400).send(SendResponse("Some Fields are Missing", false));
    } else {
      obj.password = await bcrypt.hash(obj.password, 10);
      let existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res
          .status(400)
          .send(SendResponse("this Email is already Exist", false));
      } else {
        let user = new UserModel(obj);
        await user
          .save()
          .then((user) => {
            res
              .status(200)
              .send(SendResponse("User Created Successfully", true, user));
          })
          .catch((err) => {
            res
              .status(400)
              .send(SendResponse("Internal Server Error", false, err));
          });
      }
    }
  },
  getUsers: async (req, res) => {
    try {
      UserModel.find({})
        .then((result) => {
          res.status(200).send(SendResponse("", true, result));
        })
        .catch((err) => {
          res
            .status(400)
            .send(SendResponse("Internal Server Error", false, err));
        });
    } catch (e) {
      res.status(400).send(SendResponse("Internal Server Error", false, e));
    }
  },
  editUsers: async (req, res) => {
    try {
      let id = req.params.id;

      UserModel.findById(id)
        .exec()
        .then((existing) => {
          if (!existing) {
            res.status(400).send(SendResponse("No record Found", false, null));
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
                  .send(SendResponse("Updated Successfully", true, result));
              })
              .catch((err) => {
                res
                  .status(500)
                  .send(SendResponse("Internal Server Error", false, err));
              });
          }
        })
        .catch((err) => {
          res
            .status(500)
            .send(SendResponse("Internal Server Error", false, err));
        });
    } catch (error) {
      res.status(500).send(SendResponse("Internal Server Error", false, error));
    }
  },
  deleteUser: async (req, res) => {
    try {
      let id = req.params.id;
      UserModel.findByIdAndDelete(id)
        .then((result) => {
          res.status(200).send(SendResponse("User Deleted Successfully", true));
        })
        .catch((err) => {
          res
            .status(400)
            .send(SendResponse("Internal Server Error", true, err));
        });
    } catch (e) {
      res.status(400).send(SendResponse("Internal Server Error", true, e));
    }
  },
  protected: async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).send(SendResponse("Un Authorized", false));
      return;
    }

    jwt.verify(token, process.env.SECURE_KEY, (err, decoded) => {
      if (err) {
        res.status(401).send(SendResponse("Un Authorized", false));
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
        return res.status(404).json({ message: 'User not found' });
      }

      // If the user doesn't have a Stripe customer ID, create a new customer
      if (!user.stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          payment_method: paymentMethodId,
          invoice_settings: { default_payment_method: paymentMethodId }
        });

        user.stripeCustomerId = customer.id;
      } else {
        // If customer exists, update their default payment method
        await stripe.customers.update(user.stripeCustomerId, {
          payment_method: paymentMethodId,
          invoice_settings: { default_payment_method: paymentMethodId }
        });
      }

      // Attach the payment method to the customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId,
      });

      user.stripePaymentMethodId = paymentMethodId;
      await user.save();

      res.status(200).json({ message: 'Stripe customer and payment method saved', user });
    } catch (error) {
      res.status(500).json({ message: 'Error setting up payment method', error: error.message });
    }
  },

  // Charge customer for a service
  chargeCustomer: async (req, res) => {
    const { userId, amount, currency } = req.body;

    try {
      const user = await CommonEntity.findById(userId);
      if (!user || !user.stripeCustomerId || !user.stripePaymentMethodId) {
        return res.status(404).json({ message: 'User or payment information not found' });
      }

      // Create payment intent using the saved customer ID and payment method
      const paymentIntent = await stripe.paymentIntents.create({
        customer: user.stripeCustomerId,
        amount: amount * 100, // Amount in cents
        currency: currency || 'usd',
        payment_method: user.stripePaymentMethodId,
        off_session: true, // To indicate this is an off-session charge
        confirm: true,
      });

      res.status(200).json({ message: 'Payment successful', paymentIntent });
    } catch (error) {
      res.status(500).json({ message: 'Error processing payment', error: error.message });
    }
  }
};

module.exports = AuthController;
