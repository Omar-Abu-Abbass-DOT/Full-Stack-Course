const Category = require("../models/category");

// GET /api/category
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("createdBy", "name");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/category — Admin only
const createCategory = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    const existing = await Category.findOne({ title });
    if (existing) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await Category.create({
      title,
      description,
      imageUrl,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/category/:id — Admin only
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category updated", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/category/:id — Admin only
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
