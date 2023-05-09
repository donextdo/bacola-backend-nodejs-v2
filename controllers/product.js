const Product = require("../models/product");
const { request } = require("express");
// const axios = require("axios");

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
  const soldCount = req.body.soldCount;
  const popularity = req.body.popularity;
  const averageRating = req.body.averageRating;
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
    soldCount,
    popularity,
    averageRating,
    additionalInformation,
    createdAt,
    updatedAt,
    deletedAt,
    // isFavourite,
  });
  try {
    let response = await product.save();
    if (response) {
      return res.status(201).send({ message: "New Product Inserted" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Error while saving products" });
  }
};

// //get All Product
// const getAllProduct = async (req, res) => {
//   try {
//     let products = await Product.find();
//     //products = products.sort((a, b) => b.createdAt - a.createdAt);
//     if (products) {
//       return res.json(products);
//     } else {
//       return res
//         .status(404)
//         .send({ message: "Error occured when retrieving products" });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(500).send({ message: "Internal server error" });
//   }
// };

//get product by id
const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    let response = await Product.findById(productId);

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
    soldCount: req.body.soldCount,
    popularity: req.body.review,
    averageRating: req.body.averageRating,
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
    const searchResult = await Product.find({
      $or: [
        { title: regex },
        { brand: regex },
        { description: regex },
        { type: regex },
      ],
    });
    return searchResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const search = async (req, res) => {
  try {
    const query = req.query.q;
    const results = await searchProducts(query);
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

const pagePagination = async (req, res) => {
  try {
    const { page = 1, perpage = 12 } = req.query;
    const skip = (page - 1) * perpage;

    const products = await Product.find()
      .skip(skip)
      .limit(parseInt(perpage))
      .exec();

    const count = await Product.countDocuments();

    const response = {
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / perpage),
      totalItems: count,
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { sort } = req.query;
    let products = await Product.find();

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
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
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
  pagePagination,
};
