const  Product = require("../models/product");
const { request } = require("express");
const axios = require("axios");

//insert product
const addProduct = async (req, res) => {
  const title = req.body.title;
  const brand = req.body.brand;
  const description = req.body.description;
  //const image = req.body.image;
  const front = req.body.front;
  const back = req.body.back;
  const side = req.body.side;
  const category = req.body.category;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const isAvailable = req.body.isAvailable;
  const skuNumber = req.body.price;
  const type = req.body.type;
  const mfgDate = req.body.mfgDate;
  const expDate = req.body.expDate;
  const discount = req.body.discount;
  const review = req.body.review;
  const additionalInformation = req.body.additionalInformation;
  const createdAt = new Date();
  const updatedAt = null;
  const deletedAt = null;
  //const isFavourite = req.body.isFavourite;

  const product = new Product({
    title,
    brand,
    description,
    //image,
    front,
    back,
    side,
    category,
    quantity,
    price,
    isAvailable,
    skuNumber,
    type,
    mfgDate,
    expDate,
    discount,
    review,
    additionalInformation,
    createdAt,
    updatedAt,
    deletedAt,
    // isFavourite,
  });
  try {
    let response = await product.save();
    if (response) {
      return res.status(201).send({ message: "New Product Insered" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Error while saving products" });
  }
};

//get All Product
const getAllProduct = async (req, res) => {
  try {
    let products = await Product.find();
    if (products) {
      return res.json(products);
    } else {
      return res
        .status(404)
        .send({ message: "Error occured when retrieving products" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

//get product by id
const getProductById = async (req, res) => {
  const productId = req.params.id;
  //console.log("data", productId);

  try {
    let response = await Product.findById(productId);
    // console.log("response", response);
    if (response) {
      return res.json(response);
    } else {
      return res.status(404).send({ message: "No such product found" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

//update product by id
const updateProduct = async (req, res) => {
  const Id = req.params.id;
  const product = await Product.findById({ _id: Id });

  let productUpdate = {
    Id: Id,
    title: product.title,
    brand: req.body.brand,
    description: req.body.description,
    //image: req.body.image,
    front: req.body.front,
    back: req.body.back,
    side: req.body.side,
    category: req.body.category,
    quantity: req.body.quantity,
    price: req.body.price,
    isAvailable: req.body.isAvailable,
    skuNumber: req.body.price,
    type: req.body.type,
    mfgDate: req.body.mfgDate,
    expDate: req.body.expDate,
    discount: req.body.discount,
    review: req.body.review,
    additionalInformation: req.body.additionalInformation,
    updatedAt: new Date(),
  };

  try {
    const response = await Product.findOneAndUpdate({ _id: Id }, productUpdate);

    if (response) {
      return res.status(200).send({ message: "Successfully updated Product " });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log("errror", err);
    return res.status(400).send({ message: "Unable to update" });
  }
};

const deleteUpdate = async (req, res) => {
  const Id = req.params.id;
  let updateDeleteDate = await Product.findById(Id);
  updateDeleteDate.deletedAt = new Date();
  // return await response.save();
  try {
    let response = await updateDeleteDate.save();
    if (response) {
      return res.status(201).send({ message: "delete date is updated" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Error while saving products" });
  }
};

//delete product by id
const deleteProduct = async (req, res) => {
  const Id = req.params.id;
  try {
    const response = await Product.findByIdAndDelete({ _id: Id });
    if (response) {
      return res
        .status(204)
        .send({ message: "Successfully deleted a Request" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(400).send({ message: "Could not delete the request" });
  }
};

//search by product name
async function searchProducts(query) {
  try {
    const regex = new RegExp(query, "i");
    //console.log("regex ", regex);
    const searchResult = await Product.find({
      $or: [
        { title: regex },
        { brand: regex },
        { description: regex },
        { type: regex },
      ],
    });
    //console.log("searchResult ", searchResult);
    return searchResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const search = async (req, res) => {
  try {
    const query = req.query.q;
    //console.log("query ", query);
    const results = await searchProducts(query);
    //console.log("results ", results);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getCategories = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId })
      .populate("category")
      .exec();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getBrandsName = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
    }).select("brand");
    const brands = products.map((product) => product.brand);
    const uniqueBrands = [...new Set(brands)]; // Get unique brands using a Set

    res.status(200).json({ brands: uniqueBrands });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// const getSubCatergory = async (req, res) => {
//   const categoryId = req.params.categoryId;
//   const subCategoryId = req.params.subCategoryId;

//   try {
//     const products = await Product.find({
//       category: { $in: [categoryId, subCategoryId] },
//     })
//       .populate({
//         path: "category",
//         populate: { path: "subcategories" },
//       })
//       .exec();
//     res.json(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// Endpoint for filtering products by category, subcategory, and brands
// const getproductByfilter = async (req, res) => {
//   const baseUrl = "http://localhost:4000/api";

//   try {
//     // Retrieve query parameters from the request
//     const categoryId = req.query.categoryId;
//     const subCategories = req.query.subCategories;
//     const brands = req.query.brands;

//     // Create an array of subcategories
//     const subCatArr =
//       typeof subCategories === "string" ? subCategories.split(",") : [];

//     // Create an array of brands
//     const brandArr = typeof brands === "string" ? brands.split(",") : [];

//     // Make an API request to retrieve products by category or subcategory
//     const url =
//       subCatArr.length > 0
//         ? `${baseUrl}/products/${subCatArr}`
//         : `${baseUrl}/products/${categoryId}`;
//     const response = await axios.get(url);

//     // Filter products by brands, if applicable
//     let products = response.data;
//     if (brandArr.length > 0) {
//       products = products.filter((product) => brandArr.includes(product.brand));
//     }

//     res.status(200).json(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

const getproductByfilter = async (req, res) => {
  const baseUrl = "http://localhost:4000/api";

  const subCategories = [
    "644601e0c972e44bd4e6ea91",
    // "64460154c972e44bd4e6ea84",
    // "644601cdc972e44bd4e6ea8d",
    // "64403937a462a1a4d60e76c6",
  ];
  const brands = ["Oreo"];

  const categoryId = "644007834ddc2982ee097a72";

  try {
    // const categoryId = req.query.categoryId;
    // const subCategories = req.query.subCategories;
    // const brands = req.query.brands;

    const subCatArr =
      typeof subCategories === "string" ? subCategories.split(",") : [];
    console.log("subCatArr ", subCatArr);
    const brandArr = typeof brands === "string" ? brands.split(",") : [];

    const url =
      subCatArr.length > 0
        ? `${baseUrl}/products/${subCategories}`
        : `${baseUrl}/products/${categoryId}`;
    // const url =
    //   subCatArr.length > 0
    //     ? `${baseUrl}/products/${subCatArr}`
    //     : `${baseUrl}/products/${catArr}`;
    const response = await axios.get(url);
    console.log("response", response.data);
    console.log("dhjj");
    // Filter products by brands, if applicable
    let products = response.data;
    if (brandArr.length > 0) {
      products = products.filter((product) => brandArr.includes(product.brand));
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteUpdate,
  search,
  getCategories,
  getBrandsName,
  //getSubCatergory,
  getproductByfilter,
};
