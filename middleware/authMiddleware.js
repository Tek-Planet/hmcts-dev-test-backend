







const jwt = require("jsonwebtoken");
const SECRET = "supersecret"; // keep in sync with authController.js

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);

    // attach user info to request
    req.user = decoded;

    // ✅ refresh token on each request (sliding session)
    const newToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      SECRET,
      { expiresIn: "1h" }
    );
    res.setHeader("x-refresh-token", newToken);

    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authMiddleware

