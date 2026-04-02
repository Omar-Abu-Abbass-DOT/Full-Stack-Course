// Task 3: Logger Middleware
// Logs HTTP method, URL, and current time for every request

function logger(req, res, next) {
  const now = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  console.log(`${req.method} ${req.url} - ${now}`);
  next();
}

module.exports = logger;
