const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: false
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: false
  },
  lastname: {
    type: String,
    required: false
  },
  displayName: {
    type: String,
    required: false
  },

  isFavourite: {},

  billingAddress: {
    type: [
      {
        billingFirstName : { type: String, required : false},
        billingLastName : { type: String, required : false},
        billingCompanyName : { type: String, required : false},
        street: { type: String, required: false },
        town: { type: String, required: false },
        state: { type: String, required: false },
        country: { type: String, required: false },
        zipCode: { type: String, required: false },
      },
    ],
    required: false,
  },
  phone: {
    type: String,
    required: false,
    trim: true,
  },

  shippingAddress: {
    type: [
      {
        shippingFirstName : { type: String , required: false},
        shippingLastName : { type:String , required: false},
        shippingCompanyName : {type : String , required : false},
        street: { type: String, required: false},
        town: { type: String, required: false },
        state: { type: String, required: false },
        country: { type: String, required: false },
        zipCode: { type: String, required: false },
      },
    ],
    required: false,
  },
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
