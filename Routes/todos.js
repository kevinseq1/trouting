// routes/todos.js

const express = require('express');
const router = express.Router();
const Todo = require('../models/todo'); // your Todo model
const authenticateToken = require('../middleware/auth'); // auth middleware

// Apply auth middleware to all routes in this file
router.use(authenticateToken);

// GET /todos - all todos for user
router.get('/', (req, res) => {
  const todos = Todo.findAll(req.user.id);
  res.status(200).json(todos);
});

// GET /todos/:id - single todo
router.get('/:id', (req, res) => {
  const todo = Todo.findById(req.params.id, req.user.id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.status(200).json(todo);
});

// POST /todos - create new todo
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const newTodo = Todo.create(title, req.user.id);
  res.status(201).json(newTodo);
});

// PUT /todos/:id - update todo
router.put('/:id', (req, res) => {
  const { title, completed } = req.body;
  const updated = Todo.update(req.params.id, req.user.id, { title, completed });
  if (!updated) return res.status(404).json({ error: 'Todo not found' });
  res.status(200).json(updated);
});

// DELETE /todos/:id - delete todo
router.delete('/:id', (req, res) => {
  const success = Todo.remove(req.params.id, req.user.id);
  if (!success) return res.status(404).json({ error: 'Todo not found' });
  res.status(204).send();
});

module.exports = router;
