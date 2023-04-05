const express = require("express");

const router = express.Router();

let userController = require("../controllers/user");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", userController.getAllUsers);
router.get("/:email", userController.getOneUser);
router.get("/:email", userController.getOneUser);
router.put("/:email/:pwd", userController.updateUserPassword);
router.put("/:email", userController.updateUser);

module.exports = router;
