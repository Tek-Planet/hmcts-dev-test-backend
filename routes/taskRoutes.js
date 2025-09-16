// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  searchTasks
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected routes
router.get("/",authMiddleware, getTasks);
router.get("/:id",authMiddleware, getTaskById);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.get("/search", authMiddleware, searchTasks);

module.exports = router;
