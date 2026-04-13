import { useState, useEffect } from "react"

const API = "http://localhost:5000/api/todos"

function TodoList() {
  const [todos, setTodos] = useState([])
  const [task, setTask] = useState("")
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState("")

  // Get all todos
  const getTodos = async () => {
    setLoading(true)
    const res = await fetch(API)
    const data = await res.json()
    setTodos(data)
    setLoading(false)
  }

  useEffect(() => {
    getTodos()
  }, [])

  // Create new todo
  const addTodo = async (e) => {
    e.preventDefault()
    if (!task.trim()) return
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task })
    })
    setTask("")
    getTodos()
  }

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" })
    getTodos()
  }

  // Toggle completed status
  const toggleComplete = async (id, completed) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    })
    getTodos()
  }

  // Start editing
  const startEdit = (id, currentTask) => {
    setEditId(id)
    setEditText(currentTask)
  }

  // Save edit
  const saveEdit = async (id) => {
    if (!editText.trim()) return
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: editText })
    })
    setEditId(null)
    setEditText("")
    getTodos()
  }

  // Cancel edit
  const cancelEdit = () => {
    setEditId(null)
    setEditText("")
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Todo List</h2>

      {/* Add new task form */}
      <form onSubmit={addTodo} style={styles.form}>
        <input
          type="text"
          placeholder="Enter a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.addBtn}>Add Task</button>
      </form>

      {/* Loading state */}
      {loading ? (
        <p style={styles.loading}>Loading todos...</p>
      ) : todos.length === 0 ? (
        <p style={styles.empty}>No todos yet. Add one above!</p>
      ) : (
        <ul style={styles.list}>
          {todos.map((todo) => (
            <li
              key={todo._id}
              style={{
                ...styles.item,
                ...(todo.completed ? styles.completedItem : {})
              }}
            >
              {editId === todo._id ? (
                // Edit mode
                <div style={styles.editRow}>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={styles.editInput}
                  />
                  <button onClick={() => saveEdit(todo._id)} style={styles.saveBtn}>Save</button>
                  <button onClick={cancelEdit} style={styles.cancelBtn}>Cancel</button>
                </div>
              ) : (
                // Display mode
                <div style={styles.displayRow}>
                  <span
                    style={{
                      ...styles.taskText,
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: todo.completed ? "#888" : "#333"
                    }}
                  >
                    {todo.task}
                  </span>
                  <div style={styles.buttons}>
                    <button
                      onClick={() => toggleComplete(todo._id, todo.completed)}
                      style={todo.completed ? styles.undoBtn : styles.completeBtn}
                    >
                      {todo.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      onClick={() => startEdit(todo._id, todo.task)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif"
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px"
  },
  addBtn: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  loading: {
    textAlign: "center",
    color: "#666",
    fontSize: "18px"
  },
  empty: {
    textAlign: "center",
    color: "#999"
  },
  list: {
    listStyle: "none",
    padding: 0
  },
  item: {
    padding: "12px",
    marginBottom: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#fff"
  },
  completedItem: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc"
  },
  displayRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  taskText: {
    fontSize: "16px",
    flex: 1
  },
  buttons: {
    display: "flex",
    gap: "5px"
  },
  completeBtn: {
    padding: "5px 10px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  },
  undoBtn: {
    padding: "5px 10px",
    backgroundColor: "#FF9800",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  },
  editBtn: {
    padding: "5px 10px",
    backgroundColor: "#9C27B0",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  },
  deleteBtn: {
    padding: "5px 10px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  },
  editRow: {
    display: "flex",
    gap: "5px",
    alignItems: "center"
  },
  editInput: {
    flex: 1,
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "3px"
  },
  saveBtn: {
    padding: "5px 10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  },
  cancelBtn: {
    padding: "5px 10px",
    backgroundColor: "#666",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  }
}

export default TodoList
