const express = require("express");
const router = express.Router();
const { getAllCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

// Public routes
router.get("/", getAllCategories);

// Admin routes
router.post("/", auth, authorizeRole("admin"), createCategory);
router.put("/:id", auth, authorizeRole("admin"), updateCategory);
router.delete("/:id", auth, authorizeRole("admin"), deleteCategory);

module.exports = router;
