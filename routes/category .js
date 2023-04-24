const express = require("express");

const router = express.Router();

let catergoryController = require("../controllers/category ");

router.post("/insert", catergoryController.categoryInsert);

module.exports = router;
