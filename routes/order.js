const express = require("express");
const { authenticateToken } = require("../middlewares/jwt");

const router = express.Router();

let orderController = require("../controllers/order");

router.post("/place", authenticateToken, orderController.createOrder);
router.get("/", authenticateToken, orderController.getAllOrders);
router.get("/:id", authenticateToken, orderController.getOrderById);
router.put("/:id", authenticateToken, orderController.updateOrder);
router.put(
  "/change/status/:id",
  authenticateToken,
  orderController.updateStatus
);
router.delete("/:id", authenticateToken, orderController.deleteOrder);
router.get("/get/:userId", authenticateToken, orderController.getOrderByUser);

module.exports = router;
