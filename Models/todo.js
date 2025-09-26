const db = require('../db');

function create(title) {
  const stmt = db.prepare('INSERT INTO todos (title) VALUES (?)');
  const info = stmt.run(title);
  return db.prepare('SELECT * FROM todos WHERE id = ?').get(info.lastInsertRowid);
}

function findAll() {
  return db.prepare('SELECT * FROM todos ORDER BY id DESC').all();
}

function findById(id) {
  return db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
}

function update(id, fields) {
  const todo = findById(id);
  if (!todo) return null;

  const newTitle = fields.title ?? todo.title;
  const newCompleted =
    fields.completed === undefined ? todo.completed : fields.completed ? 1 : 0;

  db.prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ?')
    .run(newTitle, newCompleted, id);

  return findById(id);
}

function remove(id) {
  const info = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  return info.changes > 0;
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};