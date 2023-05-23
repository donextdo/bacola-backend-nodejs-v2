const Product = require("../models/product");
const { request } = require("express");
const axios = require("axios");

const getproductByfilter = async (req, res) => {
  const baseUrl = "http://localhost:4000/api";

  try {
    const categoryId = req.query.categoryId;
    const subCategories = req.query.subCategories;
    const brands = req.query.brands;
    const minPrice = parseFloat(req.query.min_price);
    const maxPrice = parseFloat(req.query.max_price);
    const inStock = req.query.stock_status;
    const onSale = req.query.on_sale;

    const subCatArr =
      typeof subCategories === "string" ? subCategories.split(",") : [];

    const brandArr = typeof brands === "string" ? brands.split(",") : [];

    const url =
      subCatArr.length > 0
        ? `${baseUrl}/products/${subCatArr}`
        : `${baseUrl}/products/${categoryId}`;
    const response = await axios.get(url);

    let products = response.data;
    if (brandArr.length > 0) {
      products = products.filter((product) => brandArr.includes(product.brand));
    }

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      products = products.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    if (inStock === "true") {
      products = products.filter((product) => product.inStock === true);
    }

    if (onSale === "true") {
      products = products.filter((product) => product.onSale === true);
    }

    res.status(200).json(products);
  } catch (error) {
    console.log("error : ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getproductByfilter,
};
