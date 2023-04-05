const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {},
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
  },
  skuNumber: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  mfgDate: {
    type: String,
    required: true,
  },
  expDate: {
    type: String,
    required: true,
  },
  discount: {
    type: String,
  },
  review: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  // isFavourite: {
  //   type: Boolean,
  // },
});

const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
