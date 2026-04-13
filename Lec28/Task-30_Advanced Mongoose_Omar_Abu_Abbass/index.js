const express = require("express");
require("./models/db");

const categoriesRouter = require("./routes/categoriesRouter");
const productsRouter = require("./routes/productsRouter");
const ordersRouter = require("./routes/ordersRouter");

const app = express();

app.use(express.json());

app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
