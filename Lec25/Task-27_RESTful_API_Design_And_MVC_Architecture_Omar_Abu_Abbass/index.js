const express = require("express");
const app = express();

app.use(express.json());

// 2. Array of books
const books = [
  { id: 1, title: "The Great Gatsby", author: "Scott", price: 15 },
  { id: 2, title: "1984", author: "George", price: 20 },
  { id: 3, title: "Clean Code", author: "Robert", price: 30 },
];

// 3. GET /books - return all books
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// 4. POST /create/book - add a new book
app.post("/create/book", (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// 5. PUT /update/book/:id - update title and price
app.put("/update/book/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  book.title = req.body.title || book.title;
  book.price = req.body.price || book.price;

  res.status(200).json(book);
});

// 6. DELETE /delete/book/:id - delete a book
app.delete("/delete/book/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const deleted = books.splice(index, 1);
  res.status(200).json(deleted[0]);
});

// 7. GET /book?author=Jhon&price=30 - filter books
app.get("/book", (req, res) => {
  let result = [...books];

  if (req.query.author) {
    result = result.filter((b) => b.author === req.query.author);
  }

  if (req.query.price) {
    result = result.filter((b) => b.price === parseInt(req.query.price));
  }

  res.status(200).json(result);
});

// 1. Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
