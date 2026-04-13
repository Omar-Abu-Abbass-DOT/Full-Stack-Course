const mongoose = require("mongoose");

// Task 5: Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
