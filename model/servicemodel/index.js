const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({

  name: {
    type: String,
    required: [true, "Name is Required"],
  },

  price: {
    type: Number,
    required: [true, "Price is Required"],
  },

  detail: {
    type: [String],
  },
}, { timestamps: true });

const UserModel = mongoose.model("package", UserSchema);
module.exports = UserModel;