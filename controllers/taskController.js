const { getDB } = require("../db");


function getTasks(req, res) {
  const db = getDB();
  const tasks = db.prepare("SELECT * FROM tasks WHERE userId = ?").all(req.user.id);
  res.json(tasks);
}

function getTaskById(req, res) {
  const db = getDB();
  const task = db.prepare("SELECT * FROM tasks WHERE id = ? AND userId = ?").get(req.params.id, req.user.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
}

function createTask(req, res) {
  const db = getDB();
  const { title, description, dueDateTime } = req.body;

  if (!title) return res.status(400).json({ error: "Title is required" });

  const stmt = db.prepare(
    "INSERT INTO tasks (title, description, dueDateTime, userId) VALUES (?, ?, ?, ?)"
  );
  const info = stmt.run(title, description, dueDateTime, req.user.id);

  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(task);
}

function updateTask(req, res) {
  const db = getDB();
  const { title, description, status, dueDateTime } = req.body;

  const existing = db.prepare("SELECT * FROM tasks WHERE id = ? AND userId = ?").get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ error: "Task not found" });

  const stmt = db.prepare(
    `UPDATE tasks SET 
       title = COALESCE(?, title),
       description = COALESCE(?, description),
       status = COALESCE(?, status),
       dueDateTime = COALESCE(?, dueDateTime)
     WHERE id = ? AND userId = ?`
  );

  stmt.run(title, description, status, dueDateTime, req.params.id, req.user.id);

  const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
  res.json(updated);
}

function deleteTask(req, res) {
  const db = getDB();
  const result = db.prepare("DELETE FROM tasks WHERE id = ? AND userId = ?").run(req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: "Task not found" });
  res.status(204).send();
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};


