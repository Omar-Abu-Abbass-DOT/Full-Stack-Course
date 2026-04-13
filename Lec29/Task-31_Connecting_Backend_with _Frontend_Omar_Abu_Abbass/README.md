# Todo List - Full Stack Application

A full-stack Todo List application connecting React frontend with Node.js/Express backend and MongoDB database.

## Project Structure

```
├── backend/
│   ├── models/
│   │   └── todoSchema.js
│   ├── controllers/
│   │   └── todoController.js
│   ├── routes/
│   │   └── todoRoutes.js
│   ├── db.js
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── TodoList.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Other:** CORS

## Features (Practice Task)

1. **Update Todo endpoint** - `PUT /api/todos/:id` to update task text or completed status
2. **Completed status** - Each todo has a `completed` field (default: false)
3. **Mark as completed button** - Toggle todo between completed and not completed
4. **Different style for completed todos** - Completed todos have line-through text and gray background
5. **Loading state** - Shows "Loading todos..." while fetching data from backend
6. **Delete and Update buttons** - Each todo has Edit and Delete buttons
7. **Create new task** - Input form at the top to add new todos

## API Endpoints

| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| GET    | /api/todos        | Get all todos      |
| POST   | /api/todos        | Create a new todo  |
| PUT    | /api/todos/:id    | Update a todo      |
| DELETE | /api/todos/:id    | Delete a todo      |

## How to Run

### 1. Start MongoDB

Make sure MongoDB is running locally on port 27017.

### 2. Start Backend

```bash
cd backend
npm install
npm start
```

Server will run on `http://localhost:5000`

### 3. Start Frontend

```bash
cd frontend
npm install
npm start
```

React app will run on `http://localhost:3000`

## How It Works

```
React UI (User Interaction)
        ↓
Fetch Request (HTTP)
        ↓
Express API (Routes → Controllers)
        ↓
MongoDB (Database Operations)
        ↓
JSON Response
        ↓
React UI Update (Re-render)
```
