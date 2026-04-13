const express = require("express");
const connectDB = require("./models/db");
const productRoutes = require("./routes/products");

const app = express();
const PORT = 3000;

app.use(express.json());

connectDB();

app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
