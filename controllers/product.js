const Product = require("../models/product");
const { request } = require("express");

//insert product
const addProduct = async (req, res) => {
  const title = req.body.title;
  const brand = req.body.brand;
  const description = req.body.description;
  const image = req.body.image;
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
  const createdAt = new Date();
  const updatedAt = null;
  const deletedAt = null;
  //const isFavourite = req.body.isFavourite;

  const product = new Product({
    title,
    brand,
    description,
    image,
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
    return res.status(404).send({ message: "No such product found" });
  }
};

//update product by id
const updateProduct = async (req, res) => {
  const Id = req.params.id;

  let productUpdate = {
    Id: Id,
    title: req.body.title,
    brand: req.body.brand,
    description: req.body.description,
    image: req.body.image,
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

module.exports = {
  addProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteUpdate,
};
