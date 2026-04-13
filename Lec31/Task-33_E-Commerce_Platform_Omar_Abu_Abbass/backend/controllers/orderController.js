const Order = require("../models/Order");
const Product = require("../models/Product");

// POST /api/orders — Logged-in user
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order must have at least one item" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      totalPrice += product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalPrice,
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/my — Logged-in user
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name imageUrl")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/:id — Order owner or Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name imageUrl");

    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders — Admin only
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/orders/:id/status — Admin only
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
