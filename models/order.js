const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({

  orderId:{
    type: String,
    required : true,
    unique : true
  },

  userId: {
    type: String,
    required: true,
  },

  item:{},

  date: {
    type: String,
  },

  total: {},

  status: {},

  createdAt:{
    type: Date,
    default: Date.now
  },

  deletedAt:{
    type: Date,
    default:null

  }
});

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;
