const express = require("express");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const productRoutes = require("./routes/productRoutes");

// Task 1: Create a new server
const app = express();
const PORT = 5000;

// Built-in middleware to parse JSON
app.use(express.json());

// Task 3: Apply logger middleware to all routes
app.use(logger);

// Routes
app.use("/products", productRoutes);

// Task 9: Global error handler (must be after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
