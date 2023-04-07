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
  displayName: {
    type: String,
  },

  isFavourite: {},

  billingAddress: {
    type: [
      {
        billingFirstName : { type: String, required : true},
        billingLastName : { type: String, required : true},
        billingCompanyName : { type: String, required : false},
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
        shippingFirstName : { type: String , required: true},
        shippingLastName : { type:String , required:true},
        shippingCompanyName : {type : String , required : false},
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
