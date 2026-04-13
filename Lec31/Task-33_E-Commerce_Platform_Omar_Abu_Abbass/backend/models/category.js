const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Category", categorySchema);
