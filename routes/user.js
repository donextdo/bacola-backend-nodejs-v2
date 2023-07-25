const express = require("express");
const rateLimit = require("express-rate-limit");
const { authenticateToken } = require("../middlewares/jwt");
const router = express.Router();

let userController = require("../controllers/user");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many requests from this IP. Please try again later.",
});

router.post("/register", apiLimiter, userController.register);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPasswordController);
router.get("/getAll", userController.getAllUsers);
router.get("/:id", userController.getOneUser);
router.get("/verify/:token", userController.VerifyEmailByUser);
router.put("/:id/password", userController.updateUserPassword);
router.patch("/:id", userController.updateUser);
router.get("/getUser/:usernameOrEmail", userController.getOneUserByEmail);
router.post("/wishList/:id", userController.addWishList);
router.delete("/:id/wishList/:productId", userController.deleteFromWishList);
router.post("/checkIsFavourite", userController.checkIsFavourite);
router.get("/getProduct/:id", userController.getFavouriteProduct);

module.exports = router;
