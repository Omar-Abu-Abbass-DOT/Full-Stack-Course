const Todo = require("../models/todoSchema")

const createTodo = async (req, res) => {
  try {
    const todo = new Todo(req.body)
    const saved = await todo.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(500).json(err)
  }
}

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find()
    res.json(todos)
  } catch (err) {
    res.status(500).json(err)
  }
}

const updateTodo = async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json(err)
  }
}

const deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id)
    res.json({ message: "Todo deleted" })
  } catch (err) {
    res.status(500).json(err)
  }
}

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
}
