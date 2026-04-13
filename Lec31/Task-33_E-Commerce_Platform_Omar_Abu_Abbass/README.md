# ShopZone - E-Commerce Platform

A fully functional E-Commerce web application built with **Node.js**, **Express**, **MongoDB**, and **React**.

## Features

- User registration and login with JWT authentication
- Role-based authorization (Admin / User)
- Full CRUD operations for products and categories
- Product search, category filtering, and pagination
- Shopping cart with quantity management
- Order placement and order history tracking
- Admin dashboard to manage products and update order statuses
- Responsive design for mobile and desktop

## Tech Stack

| Layer    | Technology                  |
| -------- | --------------------------- |
| Frontend | React, React Router, Axios  |
| Backend  | Node.js, Express            |
| Database | MongoDB, Mongoose           |
| Auth     | JWT, bcryptjs               |
| Build    | Vite                        |

## Project Structure

```
ecommerce-project/
├── backend/
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth & role middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── server.js           # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React page components
│   │   ├── context/        # Auth context provider
│   │   ├── App.jsx         # Main app with routing
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here
```

Start the server:

```bash
npm run dev
```

The API will run on `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
```

The `.env` file in `frontend/` is already configured:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The app will run on `http://localhost:5173`.

## API Endpoints

### Auth

| Method | Endpoint             | Access | Description |
| ------ | -------------------- | ------ | ----------- |
| POST   | `/api/auth/register` | Public | Register    |
| POST   | `/api/auth/login`    | Public | Login       |

### Products

| Method | Endpoint            | Access     | Description        |
| ------ | ------------------- | ---------- | ------------------ |
| GET    | `/api/products`     | Public     | Get all products   |
| GET    | `/api/products/:id` | Public     | Get single product |
| POST   | `/api/products`     | Admin only | Create product     |
| PUT    | `/api/products/:id` | Admin only | Update product     |
| DELETE | `/api/products/:id` | Admin only | Delete product     |

### Categories

| Method | Endpoint            | Access     | Description     |
| ------ | ------------------- | ---------- | --------------- |
| GET    | `/api/category`     | Public     | Get all         |
| POST   | `/api/category`     | Admin only | Create category |
| PUT    | `/api/category/:id` | Admin only | Update category |
| DELETE | `/api/category/:id` | Admin only | Delete category |

### Orders

| Method | Endpoint                   | Access         | Description          |
| ------ | -------------------------- | -------------- | -------------------- |
| POST   | `/api/orders`              | Logged-in user | Place order          |
| GET    | `/api/orders/my`           | Logged-in user | Get my orders        |
| GET    | `/api/orders/:id`          | Owner or Admin | Get single order     |
| GET    | `/api/orders`              | Admin only     | Get all orders       |
| PATCH  | `/api/orders/:id/status`   | Admin only     | Update order status  |

### Users

| Method | Endpoint             | Access         | Description    |
| ------ | -------------------- | -------------- | -------------- |
| GET    | `/api/users/profile` | Logged-in user | Get profile    |
| PUT    | `/api/users/profile` | Logged-in user | Update profile |
| GET    | `/api/users`         | Admin only     | Get all users  |
| DELETE | `/api/users/:id`     | Admin only     | Delete user    |

## User Roles

- **User**: Can browse products, add to cart, place orders, and view order history
- **Admin**: Can manage products, categories, view all orders, and update order statuses

## Author

Omar Abu Abbass
