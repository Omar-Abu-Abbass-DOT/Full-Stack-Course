const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/", auth, authorizeRole("admin"), createProduct);
router.put("/:id", auth, authorizeRole("admin"), updateProduct);
router.delete("/:id", auth, authorizeRole("admin"), deleteProduct);

module.exports = router;
