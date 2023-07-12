const Favourite = require("../models/favourite");
const { request } = require("express");

const addFavourite = async (req, res) => {
  const userId = req.body.userId;
  const productId = req.body.productId;

  const favourite = new Favourite({
    userId,
    productId,
  });
  try {
    let response = await favourite.save();
    if (response) {
      return res.status(201).send({ message: "Favourite Product Insered" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Error while saving favourite product" });
  }
};

const getAllfavourite = async (req, res) => {
  try {
    let favourite = await Favourite.find();
    if (favourite) {
      return res.json(favourite);
    } else {
      return res
        .status(404)
        .send({ message: "Error occured when retrieving favourites" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getFavouriteByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    let response = await Favourite.findOne({ userId: userId });
    if (response) {
      return res.json(response);
    } else {
      return res.status(404).send({ message: "No such user found" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

//update the favourite list
const updateFavouriteList = async (req, res) => {
  const userId = req.params.userId;
  const favourite = await Favourite.findOne({ userId: userId });

  let favouriteUpdate = {
    userId: favourite.userId,
    productId: req.body.productId,
  };

  try {
    const response = await Favourite.findOneAndUpdate(
      { userId: userId },
      favouriteUpdate
    );

    if (response) {
      return res
        .status(200)
        .send({ message: "Successfully updated favourite list " });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    return res.status(400).send({ message: "Unable to update" });
  }
};

//delete favourite product Id iside of product Id list based on the user Id
const deleteFavouriteProduct = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  try {
    const response = await Favourite.updateOne(
      { userId: userId },
      { $pull: { productId: productId } }
    );
    if (response) {
      return res
        .status(200)
        .send({ message: "Successfully remove product from favourite list " });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Unable to remove product from favourite list" });
  }
};

module.exports = {
  addFavourite,
  updateFavouriteList,
  deleteFavouriteProduct,
  getFavouriteByUserId,
  getAllfavourite,
};
