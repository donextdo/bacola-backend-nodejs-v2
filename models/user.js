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
  },
  lastname: {
    type: String,
  },
  companyName: {
    type: String,
  },

  isFavourite: {},

  billingAddress: {
    type: [
      {
        street: {
          type: String,
        },
        town: {
          type: String,
        },
        state: {
          type: String,
        },
        country: {
          type: String,
        },
        zipCode: {
          type: String,
        },
      },
    ],
  },
  phone: {
    type: String,
   
    trim: true,
  },

  shippingAddress: {
    type: [
      {
        street: {
          type: String,
        },
        town: {
          type: String,
        },
        state: {
          type: String,
        },
        country: {
          type: String,
        },
        zipCode: {
          type: String,
        },
      },
    ],
    
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
