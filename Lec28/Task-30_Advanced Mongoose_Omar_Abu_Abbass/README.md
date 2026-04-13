# Task 30 - Advanced Mongoose

## Project Structure

```
project/
├── controllers/
│   ├── categoriesController.js
│   ├── productsController.js
│   └── ordersController.js
├── routes/
│   ├── categoriesRouter.js
│   ├── productsRouter.js
│   └── ordersRouter.js
├── models/
│   ├── db.js
│   ├── categorySchema.js
│   ├── productSchema.js
│   └── orderSchema.js
├── index.js
└── README.md
```

## Installation

```bash
npm install
```

## Run

```bash
node index.js
```

## API Endpoints

### Categories

| Method | Endpoint      | Description         |
| ------ | ------------- | ------------------- |
| POST   | /categories   | Create new category |
| GET    | /categories   | Get all categories  |

### Products

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| POST   | /products      | Create new product       |
| GET    | /products      | Get all products         |
| GET    | /products/:id  | Get single product by ID |

### Orders

| Method | Endpoint | Description      |
| ------ | -------- | ---------------- |
| POST   | /orders  | Create new order |
| GET    | /orders  | Get all orders   |

## Features

- **Mongoose Middleware (Post Save):** Logs a message every time a product is saved
- **Instance Method:** `product.isExpensive()` checks if product price > 500
- **Relationships:** Products reference Categories, Orders reference Products using ObjectId
- **Populate:** GET endpoints return full related data instead of just IDs

## Example Requests

### Create Category

```json
POST /categories
{
  "name": "Electronics",
  "description": "Electronic devices"
}
```

### Create Product

```json
POST /products
{
  "name": "Laptop",
  "price": 900,
  "category": "<categoryId>"
}
```

### Create Order

```json
POST /orders
{
  "product": "<productId>",
  "quantity": 2,
  "userName": "Ali"
}
```
