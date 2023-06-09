const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
  },

  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  isFooterMenu: {
    type: Boolean,
  },
});
const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
