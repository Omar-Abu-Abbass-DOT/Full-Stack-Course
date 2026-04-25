const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

// Admin: GET / must come before user: GET /:id to avoid route collision
router.get("/", auth, authorizeRole("admin"), getAllOrders);
router.get("/my", auth, getMyOrders);
router.get("/:id", auth, getOrderById);
router.post("/", auth, createOrder);
router.patch("/:id/status", auth, authorizeRole("admin"), updateOrderStatus);

module.exports = router;
