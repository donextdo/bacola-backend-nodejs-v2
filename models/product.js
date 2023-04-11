const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

const Category = mongoose.model("Category", categorySchema);

const imageSchema = new mongoose.Schema({
  front: {
    type: String,
    required: true,
  },
  side: {
    type: String,
    required: true,
  },
  back: {
    type: String,
    required: true,
  },
});

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  brand: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: [imageSchema],
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
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
});

const Product = mongoose.model("product", ProductSchema);
module.exports = { Product, Category };
