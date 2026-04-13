const Product = require("../models/Product");

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const { search, categoryId, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(query)
      .populate("categoryId", "title")
      .populate("createdBy", "name")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId", "title")
      .populate("createdBy", "name");

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/products — Admin only
const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, stock, imageUrl } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      categoryId,
      stock,
      imageUrl,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/products/:id — Admin only
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/products/:id — Admin only
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
