const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required"],
    },

    lastName: {
      type: String,
      required: [true, "Last Name is Required"],
    },

    image: {
      type: String,
    },

    email: {
      type: String,
      required: [true, "Email Name is Required"],
    },

    role: {
      type: String,
      enum: ["user", "nanny", "admin"],
      required: [true, "Role Name is Required"],
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
    },

    region: {
      type: String,
      enum: ["usa", "canada"],
    },

    serviceType: {
      type: String,
      enum: ["full-time", "part-time", "occasional"],
    },

    shareNanny: {
      type: Boolean,
    },

    zipCode: {
      type: String,
    },

    isActive: {
      type: Boolean,
    },

    // user entities
    // totalKids: [
    //   {
    //     age: { type: Number },
    //     gender: {
    //       type: String,
    //       enum: ['male', 'female', 'other'],
    //     }
    //   }
    // ],

    parentJobDescription: {
      type: String,
    },

    selectPackage: {
      type: String,
    },

    isPayable: {
      type: Boolean,
    },

    // nanny entities
    budget: {
      type: String,
    },

    isAIDcertificate: {
      type: Boolean,
    },

    isCPRcertificate: {
      type: Boolean,
    },

    isDrivingLicense: {
      type: Boolean,
    },

    haveCar: {
      type: Boolean,
    },
    // isDrivingLicense: [
    //   {
    //     haveCar: {
    //       type: Boolean,
    //     },
    //   }
    // ],

    doHouseKeeping: {
      type: Boolean,
    },

    doMealPrep: {
      type: Boolean,
    },

    // houseKeeping: {
    //   type: Boolean,
    // },

    careSpecialChild: {
      type: Boolean,
    },

    isLiven: {
      type: Boolean,
    },

    aboutYourself: {
      type: String,
    },

    Language: {
      type: String,
      enum: ["english", "spanish", "both"],
    },

    childAgeGroup: {
      type: String,
      enum: ["0-11", "1-3", "4-9", "10+", "all"],
    },

    experience: {
      type: String,
      enum: [
        "infant",
        "toddlers",
        "pre-school",
        "grade-school",
        "high-school",
        "adult",
      ],
    },

    availability: [{ day: String, slots: [String] }],

    bookings: [{ startTime: Date, endTime: Date }],

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
      default: Date.now,
    },

    resetPasswordOTP: {
      type: Number,
    },

    otp: {
      type: Number,
    },

    // stripeCustomerId: { type: String },
    // stripePaymentMethodId: { type: String },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
