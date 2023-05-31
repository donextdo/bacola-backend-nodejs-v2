const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  orderNumber: {},
  userId: {
    type: String,
    required: true,
  },

  useName: {},

  userBillingAddress: {},

  userShippingAddress: {},

  items: [],

  itemsDetails: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      productTitle: {
        type: String,
      },
      productUnitPrice: {
        type: Number,
      },
      productQuentity: {
        type: Number,
      },
      productTotalPrice: {
        type: Number,
      },
      productFront: {
        type: String,
      },
    },
  ],

  billingAddress: {
    type: {
      billingFirstName: { type: String, required: true },
      billingLastName: { type: String, required: true },
      billingCompanyName: { type: String, required: false },
      billingPhone: { type: String, required: true, trim: true },
      street: { type: String, required: true },
      apartment: { type: String, required: false },
      town: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
      billingEmail: { type: String, required: true },
      note: { type: String, required: false },
    },

    required: true,
  },

  shippingAddress: {
    type: {
      shippingFirstName: { type: String, required: false },
      shippingLastName: { type: String, required: false },
      shippingCompanyName: { type: String, required: false },
      shippingPhone: { type: String, required: false, trim: true },
      street: { type: String, required: false },
      apartment: { type: String, required: false },
      town: { type: String, required: true },
      state: { type: String, required: false },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
      shippingEmail: { type: String, required: false },
    },

    required: false,
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
