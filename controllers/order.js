const Order = require("../models/order");
const { request } = require("express");
const Product = require("../models/product");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { logger } = require("express-winston");

const createOrder = async (req, res) => {
  const baseUrl = process.env.BACKEND_BASE_URL;
  // const orderId = req.body.orderId;
  const userId = req.body.userId;
  const items = req.body.items;
  const billingAddress = req.body.billingAddress;
  const shippingAddress = req.body.shippingAddress;
  const date = req.body.date;
  const totalprice = req.body.totalprice;
  const status = "Processing";
  const createdAt = new Date();
  const deletedAt = null;
  const itemsDetails = [];
  const address = req.body.address;
  const payment = req.body.payment;

  try {
    for (const itemId of items) {
      const response = await axios.get(
        `${baseUrl}/products/getOne/${itemId.productId}`
      );

      const product = response.data;
      if (product) {
        const itemDetail = {
          productId: product._id,
          productTitle: product.title,
          productUnitPrice: product.price,
          productQuentity: itemId.orderquantity,
          productTotalPrice: product.price * itemId.orderquantity,
        };

        itemsDetails.push(itemDetail);
      }
    }
  } catch (error) {
    logger.error("An error occurred: ", error);
    return res
      .status(500)
      .send({ message: "Error while fetching product details" });
  }

  try {
    const userResponse = await axios.get(`${baseUrl}/users/${userId}`);
    const user = userResponse.data;
    const orderCount = await axios.get(`${baseUrl}/orders/`);
    const count = orderCount.data.length;
    const orderNumber =
      process.env.ORDERCURRENTBRAND +
      (parseInt(process.env.ORDERCURRENTAMOUNT) + (count + 1));
    const order = new Order({
      // orderId,
      orderNumber,
      userId,
      items,
      billingAddress,
      shippingAddress,
      date,
      totalprice,
      address,
      payment,
      status,
      createdAt,
      deletedAt,
      itemsDetails: itemsDetails,
      useName: user.name,
      userBillingAddress: user.billingAddress,
      userShippingAddress: user.shippingAddress,
    });
    let response = await order.save();
    if (response) {
      logger.info('"Order Successful."');
      return res
        .status(201)
        .send({ orderId: response._id, message: "Order Successful" });
    } else {
      logger.error("Internal server error");
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    logger.error("An error occurred: ", err);
    return res.status(500).send({ message: "Error while placing Order" });
  }
};

//get all orders
const getAllOrders = async (req, res) => {
  try {
    let orders = await Order.find();
    if (orders) {
      return res.json(orders);
    } else {
      logger.warn("Error occured when retrieving orders");
      return res
        .status(404)
        .send({ message: "Error occured when retrieving orders" });
    }
  } catch (err) {
    logger.error("An error occurred:", err);
    return res.status(500).send({ message: "Internal server error" });
  }
};

//get order by id
const getOrderByOrderId = async (req, res) => {
  const orderId = req.params.id;

  try {
    let response = await Order.findById(orderId);

    if (response) {
      return res.json(response);
    } else {
      return res.status(404).send({ message: "No such order found" });
    }
  } catch (err) {
    return res.status(404).send({ message: "No such order found" });
  }
};

//update order by id

const updateOrder = async (req, res) => {
  const Id = req.params.id;

  let orderUpdate = {
    orderId: req.body.orderId,
    userId: req.body.userId,
    items: req.body.items,
    billingAddress: req.body.billingAddress,
    shippingAddress: req.body.shippingAddress,
    date: req.body.date,
    totalprice: req.body.totalprice,
    status: req.body.status,
    createdAt: new Date(),
    deletedAt: null,
  };

  try {
    const response = await Order.findOneAndUpdate({ _id: Id }, orderUpdate);

    if (response) {
      return res.status(200).send({ message: "Successfully updated Order " });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    return res.status(400).send({ message: "Unable to update" });
  }
};

const updateStatus = async (req, res) => {
  const orderId = req.params.id;
  const newStatus = req.body.status;

  try {
    const response = await Order.findOneAndUpdate(
      { _id: orderId },
      { status: newStatus }
    );
    if (response) {
      return res
        .status(200)
        .send({ message: "Successfully updated order status" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Unable to update order status" });
  }
};

//delete order by id
const deleteOrder = async (req, res) => {
  const Id = req.params.id;
  try {
    const response = await Order.findByIdAndDelete({ _id: Id });
    if (response) {
      return res.status(204).send({ message: "Successfully deleted a Order" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    return res.status(400).send({ message: "Could not delete the request" });
  }
};

const getOrderByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const orders = await Order.find({ userId: userId });

    const orderDetails = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];

      const productIds = [
        ...new Set(order.items.map((item) => item.productId)),
      ];

      const products = await Product.find({ _id: { $in: productIds } });

      const productMap = {};
      products.forEach((product) => {
        productMap[product._id] = {
          name: product.title,
          brand: product.brand,
          description: product.description,
          price: product.price,
          front: product.front,
        };
      });

      const itemDetails = [];

      for (let j = 0; j < order.items.length; j++) {
        const item = order.items[j];

        itemDetails.push({
          productId: item.productId,
          orderquantity: item.orderquantity,
          productDetails: productMap[item.productId],
        });
      }

      orderDetails.push({
        orderNumber: order.orderNumber,
        orderId: order._id,
        userId: order.userId,
        items: itemDetails,
        billingAddress: order.billingAddress,
        shippingAddress: order.shippingAddress,
        date: order.date,
        totalprice: order.totalprice,
        status: order.status,
        createdAt: order.createdAt,
        deletedAt: order.deletedAt,
        address: order.address,
        payment: order.payment,
      });
    }

    res.json(orderDetails);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
const getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({ _id: orderId });

    const productIds = order.items.map((item) => item.productId);

    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = {};
    products.forEach((product) => {
      productMap[product._id] = {
        name: product.title,
        brand: product.brand,
        description: product.description,
        price: product.price,
        front: product.front,
      };
    });

    const itemDetails = [];
    for (let j = 0; j < order.items.length; j++) {
      const item = order.items[j];

      itemDetails.push({
        productId: item.productId,
        orderquantity: item.orderquantity,
        productDetails: productMap[item.productId],
      });
    }

    const orderDetails = {
      orderNumber: order.orderNumber,
      orderId: order._id,
      userId: order.userId,
      items: itemDetails,
      billingAddress: order.billingAddress,
      shippingAddress: order.shippingAddress,
      date: order.date,
      totalprice: order.totalprice,
      status: order.status,
      createdAt: order.createdAt,
      deletedAt: order.deletedAt,
      address: order.address,
      payment: order.payment,
    };

    res.json(orderDetails);
  } catch (error) {
    logger.error("An error occurred:", error);

    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderByUser,
  updateStatus,
};
