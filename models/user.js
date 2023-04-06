const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  isFavourite: {},

  billingAddress: {},

  shippingAddress: {},
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
//  {
//   firstName: "",
//   lastName: "",
//   companyName: "",
//   country: "",
//   street: "",
//   town: "",
//   state: "",
//   zipCode: "",
//   phone: "",
// },
