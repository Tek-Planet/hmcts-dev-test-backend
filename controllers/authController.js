const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { getDB } = require("../db");

require("dotenv").config();
const SECRET = process.env.JWT_SECRET;

function register(req, res) {
  const db = getDB();
  const { name, email, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: "name, email and password required" });
  }

  try {
    const hashed = bcrypt.hashSync(password, 10);
    db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(
      name,
      email,
      hashed
    );
    res.json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).json({ error: "name or email already exists" });
    }
    res.status(500).json({ error: err.message });
  }
}

function login(req, res) {
  const db = getDB();
  const { email, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) return res.status(400).json({ error: "Invalid email or password" });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid email or password" });

  const token = jwt.sign({ id: user.id, email: user.email, name:user.name }, SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
}

function verifyToken(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ valid: false });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ valid: false });
  }
}

function forgotPassword(req, res) {
  const { email } = req.body;
  const db = getDB();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) return res.status(404).json({ error: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiry = Date.now() + 15 * 60 * 1000;

  db.prepare("UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?")
    .run(resetToken, expiry, user.id);

  // 🚨 In production: send via email
  res.json({ message: "Reset link generated", resetToken });
}

function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  const db = getDB();
  const user = db.prepare("SELECT * FROM users WHERE resetToken = ?").get(token);

  if (!user || user.resetTokenExpiry < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  const hashed = bcrypt.hashSync(newPassword, 10);
  db.prepare("UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?")
    .run(hashed, user.id);

  res.json({ message: "Password reset successful" });
}

module.exports = { register, login, verifyToken, forgotPassword, resetPassword };
