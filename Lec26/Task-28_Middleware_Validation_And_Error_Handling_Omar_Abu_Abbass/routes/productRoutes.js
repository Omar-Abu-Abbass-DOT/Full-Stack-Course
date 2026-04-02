const express = require("express");
const router = express.Router();
const validateProduct = require("../middlewares/validateProduct");

// In-memory products array
const products = [
  { id: 1, name: "Laptop", price: 800 },
  { id: 2, name: "Phone", price: 500 },
];

let nextId = 3;

// Task 7: GET /products - Return all products
router.get("/", (req, res) => {
  res.json(products);
});

// Task 8, 10: GET /products/:id - Get product by ID
router.get("/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    // Task 10: Throw error and let global error middleware handle it
    const error = new Error("Product not found");
    error.statusCode = 404;
    return next(error);
  }

  res.json(product);
});

// Task 2: POST /products - Create a product (with validation middleware)
router.post("/", validateProduct, (req, res) => {
  const { name, price } = req.body;

  const newProduct = {
    id: nextId++,
    name,
    price,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

module.exports = router;
