const express = require("express");

const router = express.Router();

let userController = require("../controllers/user");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getOneUser);
router.get("/verify/:token", userController.getVerifyEmail);
router.patch("/:id/:pwd", userController.updateUserPassword);
router.patch("/:id", userController.updateUser);
router.get("/getUser/:usernameOrEmail", userController.getOneUserByEmail);
router.post("/wishList/:id", userController.addWishList);
router.delete("/:id/wishList/:productId", userController.deleteFromWishList);



module.exports = router;
