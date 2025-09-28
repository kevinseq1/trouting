const Database = require('better-sqlite3');
const db = new Database('data.sqlite');

///Create todo's table if it doesn't exist
db.prepare(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT 0,
        user_id INTEGER NOT NULL
    )
`).run();

/// Create Users table to store user credentials if it doesn't exist
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`).run();

module.exports = db;
