const express = require("express");

const router = express.Router();

let productAdditionalController = require("../controllers/productAdditional");

router.get("/", productAdditionalController.getproductByfilter);

module.exports = router;
