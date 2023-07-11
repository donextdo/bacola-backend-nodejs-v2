const express = require("express");
const { authenticateToken } = require("../middlewares/jwt");

const router = express.Router();

let productAdditionalController = require("../controllers/productAdditional");

router.get(
  "/",
  authenticateToken,
  productAdditionalController.getproductByfilter
);
router.get("/brand/", productAdditionalController.BrandsName);

module.exports = router;
