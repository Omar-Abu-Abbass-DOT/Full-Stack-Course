const Order = require("../models/orderSchema");

// Task 14: Create order
const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Task 14: Get all orders with populated product
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getAllOrders };
