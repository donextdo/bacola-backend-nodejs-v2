const Order = require ("../models/order");
const { request } = require("express");

const createOrder = async (req,res)=>{
    const orderId = req.body.orderId;
    const userId = req.body.userId;
    const item = req.body.item;
    const date = req.body.date;
    const total = req.body.total;
    const status = req.body.status;
    const createdAt = new Date();
    const deletedAt = null;

    const order = new Order ({

    orderId,
    userId,
    item,
    date,
    total,
    status,
    createdAt,
    deletedAt
    
});
try {
    let response = await order.save();
    if (response) {
      return res.status(201).send({ message: "Order Successfull" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Error while placing Order" });
  }
};


module.exports = {
    createOrder
};