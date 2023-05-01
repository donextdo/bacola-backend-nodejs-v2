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

  bill: {
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
        note: {
          type: String,
        },
      },
    ],
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
