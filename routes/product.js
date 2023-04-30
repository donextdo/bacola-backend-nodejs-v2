const express = require("express");

const router = express.Router();

let productController = require("../controllers/product");

router.post("/insert", productController.addProduct);
router.get("/getAll/", productController.getAllProduct);
router.get("/getOne/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.post("/deletSave/:id", productController.deleteUpdate);
router.get("/search", productController.search);
router.get("/:categoryId", productController.getCategories);
router.get("/brands/:categoryId", productController.getBrandsName);
// router.get("/", productController.getproductByfilter);
// router.get(
//   "/categoryId/:categoryId/subcategory/:subCategoryId",
//   productController.getSubCatergory
// );
module.exports = router;
