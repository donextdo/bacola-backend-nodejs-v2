const mongoose = require("mongoose");
const { Schema } = mongoose;

const FavouriteSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  productId: [],
});

const Favourite = mongoose.model("favourite", FavouriteSchema);
module.exports = Favourite;
