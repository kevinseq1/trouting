const authenticateToken = require('./Middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('./Models/user');
const Todo = require('./Models/todo');
const express = require('express');
const dotenv = require('dotenv');  
const db = require('./db');

const app = express();                 // Create an Express application instance
app.use(express.json());               // Middleware: parse incoming JSON requests automatically
app.use('/todos', authenticateToken);  // Authenticate all /todo routes

dotenv.config();                       // Load environment variables from .env file

// ----------------------------
// Routes / Controllers
// ----------------------------

// GET /todos
// Returns all todos from the database
app.get('/todos', (req, res) => {
  // const todos = Todo.findAll(); // fetch all todos
  const todos = db.prepare('SELECT * FROM todos WHERE user_id = ?').all(req.user.id);
  res.status(200).json(todos); // 200 OK + respond with JSON array
});

// GET /todos/:id
// Returns a single todo by ID (Must belong to the logged-in user)
app.get('/todos/:id', (req, res) => {
  const todo = db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(200).json(todo);
});

// POST /todos
// Creates a new todo item
app.post('/todos', (req, res) => {
  const { title } = req.body;
  const stmt = db.prepare('INSERT INTO todos (title, user_id) VALUES (?, ?)');
  const result = stmt.run(title, req.user.id);
  res.status(201).json({ id: result.lastInsertRowid, title, completed: 0 });
});

// PUT /todos/:id
// Updates a todo item by ID
app.put('/todos/:id', (req, res) => {
  const { title, completed } = req.body;
  const stmt = db.prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ? AND user_id = ?');
  const result = stmt.run(title, completed, req.params.id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Todo not found or not yours' });
  }
  res.status(200).json({ message: 'Todo updated' });
});

// DELETE /todos/:id
// Deletes a todo item by ID
app.delete('/todos/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
  const result = stmt.run(req.params.id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Todo not found or not yours' });
  }
  res.status(200).json({ message: 'Todo deleted' });
});

// POST /register
// Creates a new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const newUser = User.create(username, password);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: 'Username already taken' });
  }
});

// POST /login
// Authenticates a user and returns a JWT
app.post(`/login`, (req, res) => {
  const { username, password } = req.body;
  const user = User.findByUsername(username);

  if (!user || !User.verifyPassword(user, password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create a token with user ID
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });

});


// ----------------------------
// Start the server
// ----------------------------
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});