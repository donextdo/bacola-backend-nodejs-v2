const express = require("express");
const { authenticateToken } = require("../middlewares/jwt");

const router = express.Router();

let productController = require("../controllers/product");

router.post("/insert", productController.addProduct);
// router.get("/getAll/", productController.getAllProduct);
router.get("/getAll", productController.getAlllProduct);
router.get(
  "/getAllBestSellerProducts",

  productController.getAllBestSellerProducts
);
router.get(
  "/getAllNewArrivalProducts",

  productController.getAllNewArrivalProducts
);
router.get("/getOne/:id", productController.getProductById);
router.get("/getAll/products", productController.getProductByIds);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.post(
  "/deletSave/:id",

  productController.deleteUpdate
);
router.post("/search", productController.search);
router.post(
  "/searchBySocket",

  productController.searchBySocket
);
router.get("/:categoryId", productController.getCategories);
router.get(
  "/brands/:categoryId",

  productController.getBrandsName
);
router.get("/", productController.pagePagination);

module.exports = router;
