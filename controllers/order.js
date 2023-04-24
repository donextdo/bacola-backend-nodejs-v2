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




//get all orders
const getAllOrders = async (req, res) => {
  try {
    let orders = await Order.find();
    if (products) {
      return res.json(orders);
    } else {
      return res
        .status(404)
        .send({ message: "Error occured when retrieving orders" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};


//get order by id
const getOrderById = async (req, res) => {
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
     orderId : req.body.orderId,
     userId : req.body.userId,
     item : req.body.item,
     date : req.body.date,
     total : req.body.total,
     status : req.body.status,
     createdAt : new Date(),
     deletedAt : null,
   
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


//delete order by id
const deleteOrder = async (req, res) => {
  const Id = req.params.id;
  try {
    const response = await Order.findByIdAndDelete({ _id: Id });
    if (response) {
      return res
        .status(204)
        .send({ message: "Successfully deleted a Order" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(400).send({ message: "Could not delete the request" });
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};