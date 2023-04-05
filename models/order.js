const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },

  item: [{ itemId: "", quantity: "" }],

  date: {
    type: String,
  },

  total: {},

  paymentMethod: {},

  status: {},
});

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;
