const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

let userController = require("../controllers/user");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many requests from this IP. Please try again later.",
});

router.post("/register", apiLimiter, userController.register);
router.post("/login", userController.login);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getOneUser);
router.get("/verify/:token", userController.VerifyEmailByUser);
router.get("/verify/:token", userController.getVerifyEmail);
router.patch("/:id/:pwd", userController.updateUserPassword);
router.patch("/:id", userController.updateUser);
router.get("/getUser/:usernameOrEmail", userController.getOneUserByEmail);
router.post("/wishList/:id", userController.addWishList);
router.delete("/:id/wishList/:productId", userController.deleteFromWishList);

module.exports = router;
