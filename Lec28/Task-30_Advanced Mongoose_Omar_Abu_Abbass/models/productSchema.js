const mongoose = require("mongoose");

// Task 4 & 9: Product Schema with category as ObjectId reference
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  inStock: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
});

// Task 7: Post middleware - logs message after product is saved
// Post because we want to confirm the product was actually saved successfully
productSchema.post("save", function (doc) {
  console.log("New product saved:", doc.name);
});

// Task 8: Instance method - checks if product is expensive
productSchema.methods.isExpensive = function () {
  return this.price > 500;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
