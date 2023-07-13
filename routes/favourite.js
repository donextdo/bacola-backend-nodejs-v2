const express = require("express");
const { authenticateToken } = require("../middlewares/jwt");

const router = express.Router();

let favouriteController = require("../controllers/favourite");

router.post("/insert", authenticateToken, favouriteController.addFavourite);
router.put(
  "/:userId",
  authenticateToken,
  favouriteController.updateFavouriteList
);
router.put(
  "/:userId/:productId",
  authenticateToken,
  favouriteController.deleteFavouriteProduct
);
router.get(
  "/:userId",
  authenticateToken,
  favouriteController.getFavouriteByUserId
);
router.get("/", authenticateToken, favouriteController.getAllfavourite);

module.exports = router;
