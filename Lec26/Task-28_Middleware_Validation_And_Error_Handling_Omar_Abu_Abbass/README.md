# Lecture 26: Middleware, Validation & Error Handling

## Topics Covered

- **Middleware**: Logger middleware that logs HTTP method, URL, and time
- **Validation**: Product validation middleware (name, price, type checking, range)
- **Error Handling**: Global error handler with consistent response format

## Project Structure

```
Lec26/
├── server.js                        # Entry point
├── routes/
│   └── productRoutes.js             # Product routes (GET, POST)
├── middlewares/
│   ├── logger.js                    # Logger middleware
│   ├── validateProduct.js           # Validation middleware
│   └── errorHandler.js              # Global error handler
├── package.json
└── README.md
```

## Setup

```bash
npm install
node server.js
```

Server runs on `http://localhost:5000`

## API Endpoints

### GET /products

Returns all products.

**Response:**

```json
[
  { "id": 1, "name": "Laptop", "price": 800 },
  { "id": 2, "name": "Phone", "price": 500 }
]
```

### GET /products/:id

Returns a single product by ID.

**Success Response:**

```json
{ "id": 1, "name": "Laptop", "price": 800 }
```

**Error Response (404):**

```json
{ "success": false, "message": "Product not found" }
```

### POST /products

Creates a new product.

**Request Body:**

```json
{ "name": "Tablet", "price": 300 }
```

**Success Response (201):**

```json
{ "id": 3, "name": "Tablet", "price": 300 }
```

**Validation Errors (400):**

| Case                    | Message                        |
| ----------------------- | ------------------------------ |
| Missing name or price   | Name and price are required    |
| Price is not a number   | Price must be a number         |
| Price is 0 or negative  | Price must be greater than 0   |

## Middleware Flow

```
Client Request
  → Logger Middleware (logs method, URL, time)
  → Validation Middleware (on POST /products)
  → Route / Controller
  → Error Handler (if error occurs)
  → Response
```

## Practice Tasks Solved

1. Create a new server
2. POST /products route
3. Logger middleware
4. Validation: name & price required
5. Validation: price must be a number
6. Validation: price > 0
7. GET /products route
8. Handle not found products (404)
9. Global error handling middleware
10. Throw errors in controllers
11. Consistent error responses with correct status codes


Author
Omar Abu Abbass