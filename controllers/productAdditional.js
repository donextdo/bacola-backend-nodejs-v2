const Product = require("../models/product");
const { request } = require("express");
const axios = require("axios");

const getproductByfilter = async (req, res) => {
  const baseUrl = "http://localhost:3000/api";

  try {
    const { sort, page = 1, perpage = 12 } = req.query;
    const skip = (page - 1) * perpage;

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

    switch (sort) {
      case "popularity":
        products = products.sort((a, b) => b.popularity - a.popularity);
        break;
      case "rating":
        products = products.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "date":
        products = products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "price":
        products = products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products = products.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    const paginatedProducts = products.slice(skip, skip + perpage);

    const count = products.length;

    const responses = {
      products: paginatedProducts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / perpage),
      totalItems: count,
    };

    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const BrandsName = async (req, res) => {
  try {
    const brandCounts = await Product.aggregate([
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $project: { brand: "$_id", count: 1, _id: 0 } },
    ]);

    res.json(brandCounts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = {
  getproductByfilter,
  BrandsName,
};
