const Product = require("../models/product");
const { request } = require("express");

const productCount = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    req.json(count);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  productCount,
};
