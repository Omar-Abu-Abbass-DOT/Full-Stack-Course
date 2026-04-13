# Task 29 - Introduction to Databases and MongoDB

## Description

A RESTful API for managing products using Node.js, Express, MongoDB, and Mongoose with MVC architecture.

## Project Structure

```
project/
├── models/
│   ├── db.js              - Database connection
│   └── productsSchema.js  - Product Schema & Model
├── controllers/
│   └── products.js        - CRUD operations logic
├── routes/
│   └── products.js        - API routes
├── server.js              - Entry point
└── package.json
```

## Installation

```bash
npm install
```

## Run

Make sure MongoDB is running, then:

```bash
node server.js
```

Server runs on `http://localhost:3000`

## API Endpoints

| Method   | Route            | Description         |
| -------- | ---------------- | ------------------- |
| `POST`   | `/products`      | Add a new product   |
| `GET`    | `/products`      | Get all products    |
| `PUT`    | `/products/:id`  | Update a product    |
| `DELETE` | `/products/:id`  | Delete a product    |

## Product Schema

| Field    | Type   | Required |
| -------- | ------ | -------- |
| name     | String | Yes      |
| price    | Number | Yes      |
| category | String | Yes      |

## Example Request Body (POST / PUT)

```json
{
  "name": "Laptop",
  "price": 900,
  "category": "Electronics"
}
```

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
