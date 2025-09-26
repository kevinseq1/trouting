const Database = require('better-sqlite3');
const db = new Database('data.sqlite');

///Create tabele if it doesn't exist
db.prepare(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT 0
    )
`).run();

module.exports = db;
