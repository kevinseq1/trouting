const db = require('../db');
const bcrypt = require('bcrypt');

// Hashing "cost factor" (higher = more secure but slower)
const SALT_ROUNDS = 10;

// Create a new user hash password before storing
function create(username, password) {
    const hashed = bcrypt.hashSync(password, SALT_ROUNDS);
    const stmt = db.prepare(`
        INSERT INTO users (username, password) VALUES (?, ?)
    `);
    const info = stmt.run(username, hashed);
    return {
        id: info.lastInsertedRow,
        username
    };
}
// Find a user by username
function findByUsername(username) {
    const stmt = db.prepare(`
        SELECT * FROM users WHERE username = ?
    `);
    return stmt.get(username);
}

// Verify password
function verifyPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
}

module.exports = {
    create,
    findByUsername,
    verifyPassword
};