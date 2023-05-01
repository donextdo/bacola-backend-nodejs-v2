const express = require("express");

const router = express.Router();

let favouriteController = require("../controllers/favourite");

router.post("/insert", favouriteController.addFavourite);
router.put("/:userId", favouriteController.updateFavouriteList);
router.put("/:userId/:productId", favouriteController.deleteFavouriteProduct);
router.get("/:userId", favouriteController.getFavouriteByUserId);
router.get("/", favouriteController.getAllfavourite);

module.exports = router;
