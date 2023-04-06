const express = require("express");

const router = express.Router();

let productController = require("../controllers/order");

router.post("/place", orderController.addOrder);

module.exports = router;