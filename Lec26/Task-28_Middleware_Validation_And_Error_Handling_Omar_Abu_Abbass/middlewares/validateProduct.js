// Task 4, 5, 6: Validation Middleware
// Checks: name exists, price exists, price is a number, price > 0

function validateProduct(req, res, next) {
  const { name, price } = req.body;

  // Task 4: Check if name and price are provided
  if (!name || price === undefined) {
    return res.status(400).json({
      success: false,
      message: "Name and price are required",
    });
  }

  // Task 5: Check if price is a number
  if (typeof price !== "number") {
    return res.status(400).json({
      success: false,
      message: "Price must be a number",
    });
  }

  // Task 6: Check if price is greater than 0
  if (price <= 0) {
    return res.status(400).json({
      success: false,
      message: "Price must be greater than 0",
    });
  }

  next();
}

module.exports = validateProduct;
