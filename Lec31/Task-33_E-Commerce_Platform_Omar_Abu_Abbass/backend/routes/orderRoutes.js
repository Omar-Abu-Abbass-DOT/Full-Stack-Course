const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

// User routes
router.post("/", auth, createOrder);
router.get("/my", auth, getMyOrders);
router.get("/:id", auth, getOrderById);

// Admin routes
router.get("/", auth, authorizeRole("admin"), getAllOrders);
router.patch("/:id/status", auth, authorizeRole("admin"), updateOrderStatus);

module.exports = router;
