const Product = require("../models/product");
const { request } = require("express");
const socketIOClient = require("socket.io-client");

//insert product
const addProduct = async (req, res) => {
  const title = req.body.title;
  const brand = req.body.brand;
  const description = req.body.description;

  const front = req.body.front;
  const back = req.body.back;
  const side = req.body.side;
  const imageArray = req.body.imageArray;
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
  const tags = req.body.tags;
  const life = req.body.life;
  const speacialtag = req.body.speacialtag;
  const isNewArrival = req.body.isNewArrival;
  const isBestSeller = req.body.isBestSeller;
  const createdAt = new Date();
  const updatedAt = null;
  const deletedAt = null;

  const product = new Product({
    title,
    brand,
    description,
    front,
    back,
    side,
    imageArray,
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
    life,
    tags,
    speacialtag,
    isNewArrival,
    isBestSeller,
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

const getAlllProduct = async (req, res) => {
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

const getAllBestSellerProducts = async (req, res) => {
  try {
    let products = await Product.find({ isBestSeller: true });
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

const getAllNewArrivalProducts = async (req, res) => {
  try {
    let products = await Product.find({ isNewArrival: true });
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
    imageArray: req.body.imageArray,
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
    life: req.body.life,
    tag: req.body.tag,
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
  try {
    let response = await updateDeleteDate.save();
    if (response) {
      return res.status(201).send({ message: "delete date is updated" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
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
    return res.status(400).send({ message: "Could not delete the request" });
  }
};

// search by product name
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
    throw error;
  }
}

const search = async (req, res) => {
  try {
    const query = req.query.q;
    const results = await searchProducts(query);
    res.json(results);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const searchBySocket = async (req, res) => {
  const { query } = req.body;

  // Create a Socket.io client
  const socket = socketIOClient("http://localhost:3000");

  // Socket.io event listener for search results
  socket.on("searchResults", (results) => {

    // Send the search results back to the client
    res.status(200).json(results);

    // Disconnect the Socket.io client
    socket.disconnect();
  });

  // Send the search query to the server
  socket.emit("search", query);
};

const getCategories = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId })
      .populate("category")
      .exec();
    res.json(products);
  } catch (error) {
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
    const {
      page = 1,
      perpage = 12,
      brands,
      min_price,
      max_price,
      stock_status,
      on_sale,
      sort,
    } = req.query;

    const brandArr = typeof brands === "string" ? brands.split(",") : [];

    const skip = (page - 1) * perpage;
    let products = await Product.find().skip(skip).limit(parseInt(perpage));

    if (brandArr.length > 0) {
      products = products.filter((product) => brandArr.includes(product.brand));
    }

    if (!isNaN(parseFloat(min_price)) && !isNaN(parseFloat(max_price))) {
      products = products.filter(
        (product) =>
          product.price >= parseFloat(min_price) &&
          product.price <= parseFloat(max_price)
      );
    }

    if (stock_status === "true") {
      products = products.filter((product) => product.inStock === true);
    }

    if (on_sale === "true") {
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

    const count = await Product.countDocuments();
    const response = {
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / perpage),
      totalItems: count,
    };

    res.json(response);
  } catch (error) {
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
  pagePagination,
  searchBySocket,
  getAllNewArrivalProducts,
  getAllBestSellerProducts,
  getAlllProduct,
};
