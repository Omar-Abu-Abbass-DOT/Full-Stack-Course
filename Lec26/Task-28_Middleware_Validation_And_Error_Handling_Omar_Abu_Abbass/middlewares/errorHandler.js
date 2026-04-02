// Task 9, 11: Global Error Handling Middleware
// Returns consistent error format with correct status codes

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
