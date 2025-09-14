const Database = require("better-sqlite3");

let db;

function initDB() {
  db = new Database("./task.db");

  // Users table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      resetToken TEXT,
      resetTokenExpiry INTEGER,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `).run();

  // Tasks table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      dueDateTime TEXT, 
      status TEXT DEFAULT 'pending',
      userId INTEGER,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `).run();

  return db;
}

function getDB() {
  if (!db) throw new Error("DB not initialized");
  return db;
}

module.exports = { initDB, getDB };
