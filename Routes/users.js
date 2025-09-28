const User = require('../Models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); 

// POST /register
// Creates a new user
router.post('/register', (req, res) => {
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
router.post(`/login`, (req, res) => {
  const { username, password } = req.body;
  const user = User.findByUsername(username);

  if (!user || !User.verifyPassword(user, password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create a token with user ID
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });

});

module.exports = router;