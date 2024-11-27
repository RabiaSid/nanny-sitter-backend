const UserModel = require("../../model/authmodel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
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

      // Send Welcome Back Email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      });

      const mailOptions = {
        from: "your-email@example.com", // Replace with your email
        to: email,
        subject: "Welcome Back!",
        text: `Hello ${updatedUser.firstName}, welcome back to our platform!`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) console.error("Error sending email:", error);
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

  // ------------------------- 2 part -------------------------

  sendOtp: async (req, res) => {
    try {
      const { email, firstName } = req.body;

      const requiredFields = ["email", "firstName"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length) {
        return res
          .status(400)
          .send(SendResponse(false, "Some fields are missing", missingFields));
      }

      const otp = Math.floor(100000 + Math.random() * 900000);

      await UserModel.updateOne({ email }, { otp }, { upsert: true });

      // Respond immediately
      res.status(200).send(SendResponse(true, "OTP sent for verification"));

      // Send email asynchronously
      setImmediate(() => {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
          },
        });

        const mailOptions = {
          from: "rabiasid984@gmail.com",
          to: UserModel.email,
          subject: "Verify Your OTP",
          text: `Hi ${firstName}, your OTP"s is ${otp}. It expires in 10 minutes.`,
        };

        // transporter.sendMail(mailOptions, (error) => {
        //   if (error) {
        //     console.error("Error sending email:", error);
        //     return res
        //       .status(500)
        //       .send(SendResponse(false, "Error sending OTP email:"));
        //   }
        //   console.log("Email sent:", info.response);
        //   return res
        //     .status(200)
        //     .send(
        //       SendResponse(true, "Password reset OTP sent to your email", user)
        //     );
        // });
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            return res
              .status(500)
              .send(SendResponse(false, "Error sending OTP email", error));
          }
          console.log("Email sent:", info.response);
        });
      });
    } catch (error) {
      console.error("Error in sendOtp:", error);
      res
        .status(500)
        .send(SendResponse(false, "Internal Server Error", error.message));
    }
    // try {
    //   const { email, firstName } = req.body;
    //   const requiredFields = ["email", "firstName"];
    //   const missingFields = requiredFields.filter((field) => !req.body[field]);

    //   if (missingFields.length) {
    //     return res
    //       .status(400)
    //       .send(SendResponse(false, "Some fields are missing", missingFields));
    //   }

    //   // const existingUser = await UserModel.findOne({ email });
    //   // if (existingUser) {
    //   //   return res
    //   //     .status(400)
    //   //     .send(SendResponse(false, "This Email is already registered"));
    //   // }

    //   // Generate OTP
    //   const otp = Math.floor(100000 + Math.random() * 900000);

    //   // Save OTP and email temporarily in DB (or use a cache like Redis)
    //   // const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    //   await UserModel.updateOne(
    //     { email },
    //     { otp: otp },
    //     // { otp, otpExpiry },
    //     { upsert: true } // Create document if it doesn't exist
    //   );

    //   // Send OTP via email
    //   const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //       user: process.env.EMAIL,
    //       pass: process.env.PASS,
    //     },
    //   });

    //   const mailOptions = {
    //     from: "your-email@example.com",
    //     to: email,
    //     subject: "Verify Your OTP",
    //     text: `Hi ${firstName}, your OTP for verification is ${otp}. This OTP will expire in 10 minutes.`,
    //   };

    //   transporter.sendMail(mailOptions, (error) => {
    //     if (error) {
    //       console.error("Error sending OTP email:", error);
    //       return res
    //         .status(500)
    //         .send(SendResponse(false, "Failed to send OTP email"));
    //     }
    //   });

    //   return res
    //     .status(200)
    //     .send(SendResponse(true, "OTP sent to your email for verification"));
    // } catch (error) {
    //   console.error("Signup error:", error);
    //   return res
    //     .status(500)
    //     .send(SendResponse(false, "Internal Server Error", error.message));
    // }
  },

  signup: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        image,
        role,
        otp,
        password,
        region,
        serviceType,
        zipCode,
        isActive,
        budget,
        isAIDcertificate,
        isCPRcertificate,
        isDrivingLicense,
        doHouseKeeping,
        doMealPrep,
        careSpecialChild,
        isLiven,
        Language,
        childAgeGroup,
        experience,
        aboutYourself,
        parentJobDescription,
      } = req.body;

      // Validate that all required fields are included in the request
      const requiredFields = [
        "email", // Ensure email is present
        "otp", // Ensure OTP is present
        "password", // Ensure password is present
        "firstName", // Ensure firstName is present
        "lastName", // Ensure lastName is present
        "role", // Ensure role is present
      ];

      const missingFields = requiredFields.filter((field) => !req.body[field]);
      if (missingFields.length) {
        return res
          .status(400)
          .send(SendResponse(false, "Some fields are missing", missingFields));
      }

      // Debugging logs
      console.log("Received input:", { email, otp, password });

      // Fetch user by email
      const user = await UserModel.findOne({ email });

      // Log fetched user data
      console.log("Fetched user from DB:", user);

      if (!user) {
        return res.status(404).send(SendResponse(false, "User not found"));
      }

      // Verify OTP
      if (user.otp !== parseInt(otp, 10)) {
        console.log("Invalid OTP:", { expected: user.otp, received: otp });
        return res.status(400).send(SendResponse(false, "Invalid OTP"));
      }

      // Check OTP expiry (if you choose to implement expiry again)
      // if (user.otpExpiry < Date.now()) {
      //   return res.status(400).send(SendResponse(false, "OTP has expired"));
      // }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;

      // Update the missing fields (including 'role' which was missing earlier)
      // user.firstName = firstName;
      // user.lastName = lastName;
      // user.email = email;
      // user.role = role; // Make sure to add the role
      // user.otp = null; // Clear OTP after successful verification

      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.image = image;
      user.role = role; // Fixed here
      user.otp = otp;
      user.password = hashedPassword; // Use the hashed password here
      user.region = region;
      user.serviceType = serviceType;
      user.zipCode = zipCode;
      user.isActive = isActive;
      user.budget = budget;
      user.isAIDcertificate = isAIDcertificate;
      user.isCPRcertificate = isCPRcertificate;
      user.isDrivingLicense = isDrivingLicense;
      user.doHouseKeeping = doHouseKeeping;
      user.doMealPrep = doMealPrep;
      user.careSpecialChild = careSpecialChild;
      user.isLiven = isLiven;
      user.Language = Language;
      user.childAgeGroup = childAgeGroup;
      user.experience = experience;
      user.aboutYourself = aboutYourself;
      user.parentJobDescription = parentJobDescription;

      // Save the updated user object
      await user.save();

      // Send success email after user account creation
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL, // Your email here
          pass: process.env.PASS, // Your email password here
        },
      });

      const mailOptions = {
        from: "your-email@example.com", // Replace with your email
        to: user.email,
        subject: "Account Created Successfully",
        text: `Dear ${firstName},\n\nYour account has been successfully created. Welcome to our platform!\n\nThank you for signing up with us.\n\nBest regards,\nYour Team`,
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending confirmation email:", error);
          return res
            .status(500)
            .send(SendResponse(false, "Failed to send confirmation email"));
        } else {
          console.log("Confirmation email sent:", info.response);
        }
      });

      return res
        .status(200)
        .send(
          SendResponse(
            true,
            "User created successfully and confirmation email sent"
          )
        );
    } catch (error) {
      console.error("OTP Verification error:", error);
      return res
        .status(500)
        .send(SendResponse(false, "Internal Server Error", error.message));
    }
  },

  //------------------------- 2 part -------------------------

  // userSignup: async (req, res) => {
  //   try {
  //     const { email, firstName } = req.body;
  //     const requiredFields = [
  //       "firstName",
  //       "lastName",
  //       "image",
  //       "email",
  //       "role",
  //       "password",
  //       "region",
  //       "serviceType",
  //       "zipCode",
  //       "parentJobDescription",
  //     ];
  //     const missingFields = requiredFields.filter((field) => !req.body[field]);

  //     if (missingFields.length) {
  //       return res
  //         .status(400)
  //         .send(SendResponse(false, "Some fields are missing", missingFields));
  //     }

  //     const existingUser = await UserModel.findOne({ email });
  //     if (existingUser) {
  //       return res
  //         .status(400)
  //         .send(SendResponse(false, "This Email is already registered"));
  //     }

  //     // Generate OTP
  //     const otp = Math.floor(100000 + Math.random() * 900000);

  //     // Save OTP and email temporarily in DB (or use a cache like Redis)
  //     // const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  //     await UserModel.updateOne(
  //       { email },
  //       { otp: otp },
  //       // { otp, otpExpiry },
  //       { upsert: true } // Create document if it doesn't exist
  //     );

  //     // Send OTP via email
  //     const transporter = nodemailer.createTransport({
  //       service: "gmail",
  //       auth: {
  //         user: process.env.EMAIL,
  //         pass: process.env.PASS,
  //       },
  //     });

  //     const mailOptions = {
  //       from: "your-email@example.com",
  //       to: email,
  //       subject: "Verify Your OTP",
  //       text: `Hi ${firstName}, your OTP for verification is ${otp}. This OTP will expire in 10 minutes.`,
  //     };

  //     transporter.sendMail(mailOptions, (error) => {
  //       if (error) {
  //         console.error("Error sending OTP email:", error);
  //         return res
  //           .status(500)
  //           .send(SendResponse(false, "Failed to send OTP email"));
  //       }
  //     });

  //     return res
  //       .status(200)
  //       .send(SendResponse(true, "OTP sent to your email for verification"));
  //   } catch (error) {
  //     console.error("Signup error:", error);
  //     return res
  //       .status(500)
  //       .send(SendResponse(false, "Internal Server Error", error.message));
  //   }
  // },

  // nannySignup: async (req, res) => {
  //   try {
  //     const { email, firstName } = req.body;
  //     const requiredFields = [
  //       "firstName",
  //       "lastName",
  //       "email",
  //       "image",
  //       "role",
  //       "password",
  //       "region",
  //       "serviceType",
  //       "zipCode",
  //       "isActive",
  //       "budget",
  //       "isAIDcertificate",
  //       "isCPRcertificate",
  //       "isDrivingLicense",
  //       "doHouseKeeping",
  //       "doMealPrep",
  //       "careSpecialChild",
  //       "isLiven",
  //       "Language",
  //       "childAgeGroup",
  //       "experience",
  //       "aboutYourself",
  //     ];
  //     const missingFields = requiredFields.filter((field) => !req.body[field]);

  //     if (missingFields.length) {
  //       return res
  //         .status(400)
  //         .send(SendResponse(false, "Some fields are missing", missingFields));
  //     }

  //     const existingUser = await UserModel.findOne({ email });
  //     if (existingUser) {
  //       return res
  //         .status(400)
  //         .send(SendResponse(false, "This Email is already registered"));
  //     }

  //     // Generate OTP
  //     const otp = Math.floor(100000 + Math.random() * 900000);

  //     // Save OTP and email temporarily in DB (or use a cache like Redis)
  //     // const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
  //     await UserModel.updateOne(
  //       { email },
  //       { otp: otp },
  //       // { otp, otpExpiry },
  //       { upsert: true } // Create document if it doesn't exist
  //     );

  //     // Send OTP via email
  //     const transporter = nodemailer.createTransport({
  //       service: "gmail",
  //       auth: {
  //         user: process.env.EMAIL,
  //         pass: process.env.PASS,
  //       },
  //     });

  //     const mailOptions = {
  //       from: "your-email@example.com",
  //       to: email,
  //       subject: "Verify Your OTP",
  //       text: `Hi ${firstName}, your OTP for verification is ${otp}. This OTP will expire in 10 minutes.`,
  //     };

  //     transporter.sendMail(mailOptions, (error) => {
  //       if (error) {
  //         console.error("Error sending OTP email:", error);
  //         return res
  //           .status(500)
  //           .send(SendResponse(false, "Failed to send OTP email"));
  //       }
  //     });

  //     return res
  //       .status(200)
  //       .send(SendResponse(true, "OTP sent to your email for verification"));
  //   } catch (error) {
  //     console.error("Signup error:", error);
  //     return res
  //       .status(500)
  //       .send(SendResponse(false, "Internal Server Error", error.message));
  //   }
  // },

  // verifyOTP: async (req, res) => {
  //   try {
  //     const {
  //       firstName,
  //       lastName,
  //       email,
  //       image,
  //       role,
  //       otp,
  //       password,
  //       region,
  //       serviceType,
  //       zipCode,
  //       isActive,
  //       budget,
  //       isAIDcertificate,
  //       isCPRcertificate,
  //       isDrivingLicense,
  //       doHouseKeeping,
  //       doMealPrep,
  //       careSpecialChild,
  //       isLiven,
  //       Language,
  //       childAgeGroup,
  //       experience,
  //       aboutYourself,
  //       parentJobDescription,
  //     } = req.body;

  //     // Validate that all required fields are included in the request
  //     const requiredFields = [
  //       "email", // Ensure email is present
  //       "otp", // Ensure OTP is present
  //       "password", // Ensure password is present
  //       "firstName", // Ensure firstName is present
  //       "lastName", // Ensure lastName is present
  //       "role", // Ensure role is present
  //     ];

  //     const missingFields = requiredFields.filter((field) => !req.body[field]);
  //     if (missingFields.length) {
  //       return res
  //         .status(400)
  //         .send(SendResponse(false, "Some fields are missing", missingFields));
  //     }

  //     // Debugging logs
  //     console.log("Received input:", { email, otp, password });

  //     // Fetch user by email
  //     const user = await UserModel.findOne({ email });

  //     // Log fetched user data
  //     console.log("Fetched user from DB:", user);

  //     if (!user) {
  //       return res.status(404).send(SendResponse(false, "User not found"));
  //     }

  //     // Verify OTP
  //     if (user.otp !== parseInt(otp, 10)) {
  //       console.log("Invalid OTP:", { expected: user.otp, received: otp });
  //       return res.status(400).send(SendResponse(false, "Invalid OTP"));
  //     }

  //     // Check OTP expiry (if you choose to implement expiry again)
  //     // if (user.otpExpiry < Date.now()) {
  //     //   return res.status(400).send(SendResponse(false, "OTP has expired"));
  //     // }

  //     // Hash password
  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     user.password = hashedPassword;

  //     // Update the missing fields (including 'role' which was missing earlier)
  //     // user.firstName = firstName;
  //     // user.lastName = lastName;
  //     // user.email = email;
  //     // user.role = role; // Make sure to add the role
  //     // user.otp = null; // Clear OTP after successful verification

  //     user.firstName = firstName;
  //     user.lastName = lastName;
  //     user.email = email;
  //     user.image = image;
  //     user.role = role; // Fixed here
  //     user.otp = otp;
  //     user.password = hashedPassword; // Use the hashed password here
  //     user.region = region;
  //     user.serviceType = serviceType;
  //     user.zipCode = zipCode;
  //     user.isActive = isActive;
  //     user.budget = budget;
  //     user.isAIDcertificate = isAIDcertificate;
  //     user.isCPRcertificate = isCPRcertificate;
  //     user.isDrivingLicense = isDrivingLicense;
  //     user.doHouseKeeping = doHouseKeeping;
  //     user.doMealPrep = doMealPrep;
  //     user.careSpecialChild = careSpecialChild;
  //     user.isLiven = isLiven;
  //     user.Language = Language;
  //     user.childAgeGroup = childAgeGroup;
  //     user.experience = experience;
  //     user.aboutYourself = aboutYourself;
  //     user.parentJobDescription = parentJobDescription;

  //     // Save the updated user object
  //     await user.save();

  //     // Send success email after user account creation
  //     const transporter = nodemailer.createTransport({
  //       service: "gmail",
  //       auth: {
  //         user: process.env.EMAIL, // Your email here
  //         pass: process.env.PASS, // Your email password here
  //       },
  //     });

  //     const mailOptions = {
  //       from: "your-email@example.com", // Replace with your email
  //       to: user.email,
  //       subject: "Account Created Successfully",
  //       text: `Dear ${firstName},\n\nYour account has been successfully created. Welcome to our platform!\n\nThank you for signing up with us.\n\nBest regards,\nYour Team`,
  //     };

  //     // Send the email
  //     transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //         console.error("Error sending confirmation email:", error);
  //         return res
  //           .status(500)
  //           .send(SendResponse(false, "Failed to send confirmation email"));
  //       } else {
  //         console.log("Confirmation email sent:", info.response);
  //       }
  //     });

  //     return res
  //       .status(200)
  //       .send(
  //         SendResponse(
  //           true,
  //           "User created successfully and confirmation email sent"
  //         )
  //       );
  //   } catch (error) {
  //     console.error("OTP Verification error:", error);
  //     return res
  //       .status(500)
  //       .send(SendResponse(false, "Internal Server Error", error.message));
  //   }
  // },

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
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).send(SendResponse(false, "User not found"));
      }

      console.log("User found:", user); // Log the user object to check its state

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

      // Generate reset token and expiry time
      // const resetToken = crypto.randomBytes(20).toString("hex");
      // const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // Token expires in 1 hour
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

      // Update user's reset token, expiry, and OTP in the database
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      user.resetPasswordOTP = otp;

      // Save the user, bypassing validation if necessary
      await user.save({ validateBeforeSave: false }); // Bypass validation if needed

      // Send email with OTP and reset token
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      });

      const mailOptions = {
        from: "rabiasid984@gmail.com", // Update this with your email
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
          .send(
            SendResponse(true, "Password reset OTP sent to your email", user)
          );
      });
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .send(SendResponse(false, "Internal Server Error", e.message || e));
    }
  },

  // forgotPassword: async (req, res) => {
  //   try {
  //     const { email } = req.body;

  //     // Validate email
  //     if (!email) {
  //       return res.status(400).send(SendResponse(false, "Email is required"));
  //     }

  //     // Find user by email
  //     const user = await UserModel.findOne({ email });

  //     if (!user) {
  //       return res.status(404).send(SendResponse(false, "User not found"));
  //     }

  //     // Generate OTP
  //     const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

  //     // Generate reset token and expiry time
  //     const resetToken = crypto.randomBytes(20).toString("hex");
  //     const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // Token expires in 1 hour

  //     // Update user's reset token, expiry, and OTP in the database
  //     user.resetPasswordToken = resetToken;
  //     user.resetPasswordExpires = resetTokenExpiry;
  //     user.resetPasswordOTP = otp;
  //     await user.save(); // Save the updated user document

  //     // Send email with OTP and reset token
  //     const transporter = nodemailer.createTransport({
  //       service: "gmail",
  //       auth: {
  //         user: process.env.EMAIL,
  //         pass: process.env.PASS,
  //       },
  //     });

  //     const mailOptions = {
  //       from: "rabiasid984@gmail.com", // Update this with your email
  //       to: user.email,
  //       subject: "Password Reset OTP",
  //       text: `Your OTP for password reset is: ${otp}. Use this along with the reset token ${resetToken}.`,
  //     };

  //     transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //         console.error("Error sending email:", error);
  //         return res
  //           .status(500)
  //           .send(SendResponse(false, "Failed to send OTP email"));
  //       }
  //       console.log("Email sent:", info.response);
  //       return res
  //         .status(200)
  //         .send(SendResponse(true, "Password reset OTP sent to your email"));
  //     });
  //   } catch (e) {
  //     console.error(e);
  //     return res
  //       .status(500)
  //       .send(SendResponse(false, "Internal Server Error", e.message || e));
  //   }
  // },

  resetPassword: async (req, res) => {
    try {
      const { resetToken, otp, password } = req.body;

      // Validate inputs
      if (!resetToken || !otp || !password) {
        return res.status(400).send({
          isSuccessfull: false,
          message: "Reset token, OTP, and new password are required",
        });
      }

      // Find the user by reset token and check expiry
      const user = await UserModel.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() }, // Ensure the token is not expired
      });

      if (!user) {
        return res.status(400).send({
          isSuccessfull: false,
          message: "Invalid or expired reset token",
        });
      }

      // Verify OTP
      if (user.resetPasswordOTP !== parseInt(otp, 10)) {
        return res
          .status(400)
          .send({ isSuccessfull: false, message: "Invalid OTP" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user's password and clear reset token fields
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      user.resetPasswordOTP = null;

      // Save the user, bypassing the validation for missing required fields
      await user.save({ validateBeforeSave: false });

      return res.status(200).send({
        isSuccessfull: true,
        message: "Password reset successfully",
        user,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).send({
        isSuccessfull: false,
        message: "Internal Server Error",
        error: e.message || e,
      });
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
