# Task 32 - Authentication vs Authorization

## Overview

This project demonstrates the core concepts of **Authentication vs Authorization**, **password hashing with bcrypt**, and **environment variables with dotenv**.

## Concepts Covered

| Concept        | Description                                          |
| -------------- | ---------------------------------------------------- |
| Authentication | Verifies identity (Who are you?) - Status `401`      |
| Authorization  | Verifies permissions (What can you do?) - Status `403`|
| Hashing        | One-way transformation of passwords using bcrypt     |
| Salt           | Random value added to prevent rainbow table attacks  |
| .env           | File for storing sensitive config outside your code  |

## Setup

```bash
npm install
```

Create a `.env` file:

```
PORT=3000
SALT_ROUNDS=10
DB_URI=mongodb://localhost:27017/auth-practice
```

Run the server:

```bash
node app.js
```

## API Endpoints

### POST `/register`

Register a new user. The password is automatically hashed using a Mongoose `pre("save")` hook before storing.

**Request Body:**

```json
{
  "username": "omar",
  "password": "mypassword123"
}
```

**Response:**

```json
{
  "message": "User registered successfully!"
}
```

### GET `/test-hash`

Demonstrates that hashing the same password twice produces different hashes due to the random salt.

**Response:**

```json
{
  "password": "mypassword123",
  "hash1": "$2b$10$...",
  "hash2": "$2b$10$...",
  "areHashesDifferent": true,
  "message": "Same password produces different hashes because of the random salt!"
}
```

## Project Structure

```
.
├── app.js            # Express server with /register and /test-hash endpoints
├── models/
│   └── User.js       # Mongoose User model with pre-save password hashing hook
├── .env              # Environment variables (PORT, SALT_ROUNDS, DB_URI)
├── .gitignore        # Ignores .env and node_modules
├── package.json
└── README.md
```

## Technologies Used

- Express.js
- Mongoose
- bcrypt
- dotenv
