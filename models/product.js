const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  brand: {
    type: String,
    
  },
  description: {
    type: String,
    required: true,
  },
 
  front: {
    type: String,
  },
  side: {
    type: String,
  },
  back: {
    type: String,
  },
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
  additionalInformation: {
    type: Object,
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
module.exports = Product;
