const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  // orderId: {
  //   type: String,
  //   // required: true,
  //   unique: true,
  // },

  userId: {
    type: String,
    required: true,
  },

  items: [],

  billingAddress: {
    type: 
      {
        billingFirstName : { type: String, required : true},
        billingLastName : { type: String, required : true},
        billingCompanyName : { type: String, required : false},
        billingPhone: { type: String, required: false, trim: true },
        street: { type: String, required: true },
        apartment: { type: String, required: false},
        town: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
        billingEmail: { type: String, required: true },
        note: { type: String, required:false},

      },
    
    required: true,
  },

  date: {
    type: String,
  },

  totalprice: {},

  status: {},

  createdAt: {
    type: Date,
    default: Date.now,
  },

  deletedAt: {
    type: Date,
    default: null,
  },
});

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;
// {
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   orderquantity: {
//     type: Number,
//     required: true,
//   },
// },
