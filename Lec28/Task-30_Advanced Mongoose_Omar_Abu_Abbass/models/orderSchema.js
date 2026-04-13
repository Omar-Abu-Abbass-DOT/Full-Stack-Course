const mongoose = require("mongoose");

// Task 13: Order Schema
const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: { type: Number },
  userName: { type: String },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
