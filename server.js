// Import Express framework
const express = require('express');

// Import our Todo model to interact with the database
const Todo = require('./Models/todo');

// Create an Express application instance
const app = express();

// Middleware: parse incoming JSON requests automatically
app.use(express.json());

// ----------------------------
// Routes / Controllers
// ----------------------------

// GET /todos
// Returns all todos from the database
app.get('/todos', (req, res) => {
  const todos = Todo.findAll(); // fetch all todos
  res.status(200).json(todos); // 200 OK + respond with JSON array
});

// GET /todos/:id
// Returns a single todo by ID
app.get('/todos/:id', (req, res) => {
  const { id } = req.params; // get todo id from URL
  const todo = Todo.findById(id); // fetch from DB
  if (todo) {
    res.status(200).json(todo); // 200 OK + return todo
  } else {
    res.status(404).send('Todo not found'); // ID doesn't exist
  }
});

// POST /todos
// Creates a new todo item
app.post('/todos', (req, res) => {
  const { title } = req.body; // get 'title' from request body
  if (!title) {
    // basic validation: title is required
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTodo = Todo.create(title); // insert into DB
  res.status(201).json(newTodo); // respond with created object
});

// PUT /todos/:id
// Updates a todo item by ID
app.put('/todos/:id', (req, res) => {
  const { id } = req.params; // get todo id from URL
  const { title, completed } = req.body; // fields to update
  const updatedTodo = Todo.update(id, { title, completed }); // update in DB

  if (updatedTodo) {
    res.status(200).json(updatedTodo); // 200 OK + return updated todo
  } else {
    res.status(404).send('Todo not found'); // handle invalid ID
  }
});

// DELETE /todos/:id
// Deletes a todo item by ID
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params; // get todo id from URL
  const success = Todo.remove(id); // delete from DB

  if (success) {
    res.status(204).send(); // 204 No Content for successful deletion
  } else {
    res.status(404).send('Todo not found'); // handle invalid ID
  }
});

// ----------------------------
// Start the server
// ----------------------------
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});