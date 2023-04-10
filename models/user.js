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
  firstName: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
  },

  isFavourite: {},

  billingAddress: {
    type: [
      {
        street: { type: String, required: true },
        town: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
      },
    ],
    required: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },

  shippingAddress: {
    type: [
      {
        street: { type: String, required: true },
        town: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
      },
    ],
    required: true,
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
