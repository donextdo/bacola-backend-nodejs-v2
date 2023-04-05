const express = require("express");

const router = express.Router();

let productController = require("../controllers/product");

router.post("/insert", productController.addProduct);
router.get("/", productController.getAllProduct);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.post("/deletSave/:id", productController.deleteUpdate);
module.exports = router;
