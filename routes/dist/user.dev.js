"use strict";

var express = require("express");

var router = express.Router();

var userController = require("../controllers/user");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", userController.getAllUsers);
router.get("/:email", userController.getOneUser);
router.put("/:email/:pwd", userController.updateUserPassword);
router.put("/:email", userController.updateUser);
router.put("/billingAddress/:email", userController.updateBillingAddress);
module.exports = router;
//# sourceMappingURL=user.dev.js.map
