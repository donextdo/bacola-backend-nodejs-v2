const Product = require("../models/product");
const { request } = require("express");
const axios = require("axios");

const getproductByfilter = async (req, res) => {
  const baseUrl = "http://localhost:4000/api";

  try {
    // Retrieve query parameters from the request
    const categoryId = req.query.categoryId;
    const subCategories = req.query.subCategories;
    const brands = req.query.brands;

    console.log("categoryId : ", categoryId);
    console.log("subCategories : ", subCategories);
    console.log("brands : ", brands);
    // Create an array of subcategories
    const subCatArr =
      typeof subCategories === "string" ? subCategories.split(",") : [];

    // Create an array of brands
    const brandArr = typeof brands === "string" ? brands.split(",") : [];

    // Make an API request to retrieve products by category or subcategory
    const url =
      subCatArr.length > 0
        ? `${baseUrl}/products/${subCatArr}`
        : `${baseUrl}/products/${categoryId}`;
    const response = await axios.get(url);

    // Filter products by brands, if applicable
    let products = response.data;
    if (brandArr.length > 0) {
      products = products.filter((product) => brandArr.includes(product.brand));
    }

    res.status(200).json(products);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getproductByfilter,
};
