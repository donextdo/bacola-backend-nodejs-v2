const express = require("express");

const router = express.Router();

let catergoryController = require("../controllers/category ");

router.post("/insert", catergoryController.insertCategory);
router.get("/:id", catergoryController.getSubCatergoryById);
router.get("/parent-categories", catergoryController.getParentCatergoryById);

module.exports = router;
