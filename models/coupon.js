const mongoose = require("mongoose");
const { Schema } = mongoose;

const CouponSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },

  coupon_code: {
    type: String,
    required: true,
    unique: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  expiredate: {
    type: Date,
  },

  dicount_amount: {
    type: Number,
    required: true,
  },
});

const Coupon = mongoose.model("coupon", CouponSchema);
module.exports = Coupon;
