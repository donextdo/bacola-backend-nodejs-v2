const express = require("express");

const router = express.Router();

let locationController = require("../controllers/location");

router.post("/insert", locationController.createLocation);
router.get("/getAll", locationController.getAllLocation);

module.exports = router;
