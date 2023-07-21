const express = require("express");

const router = express.Router();

let catergoryController = require("../controllers/category ");

router.post("/insert", catergoryController.insertCategory);
router.get("/:id", catergoryController.getSubCatergoryById);
router.get("/:id", catergoryController.getParentCatergoryById);
router.get("/", catergoryController.getParent);
router.get("/name/:id", catergoryController.getCatergoryName);
router.get("/catname/:name", catergoryController.getCatergoryIDbyName);
module.exports = router;
