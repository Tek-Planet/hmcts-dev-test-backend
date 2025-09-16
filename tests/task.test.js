// tests/task.test.js
const request = require("supertest");
const app = require("../app");
const { getDB } = require("../db");

let token;
let task;

beforeAll(async () => {
  const db = getDB();

  // Clean tables in correct order 
  db.prepare("DELETE FROM tasks").run();
  db.prepare("DELETE FROM users").run();

  // Register a test user
  await request(app).post("/api/register").send({
    name: "Test User",
    email: "test@example.com",
    password: "1234",
  });

  // Login and get JWT
  const res = await request(app).post("/api/login").send({
    email: "test@example.com",
    password: "1234",
  });

  token = res.body.token;
});

describe("Task API", () => {
  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Task 1",
        description: "Test task",
        dueDateTime: "2025-09-05T12:00:00Z",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Task 1");
    expect(res.body.dueDateTime).toBe("2025-09-05T12:00:00Z");

    task = res.body;
  });

  it("should get all tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Task",
        status: "completed",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Task");
    expect(res.body.status).toBe("completed");
  });

  it("should delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});

describe("Auth extra flows", () => {
  it("should generate a reset token", async () => {
    const res = await request(app).post("/api/forgot-password").send({
      email: "test@example.com",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.resetToken).toBeDefined();

    // Use the token to reset password
    const resetRes = await request(app).post("/api/reset-password").send({
      token: res.body.resetToken,
      newPassword: "newpass123",
    });

    expect(resetRes.statusCode).toBe(200);
    expect(resetRes.body.message).toBe("Password reset successful");
  });

  it("should login with new password", async () => {
    const res = await request(app).post("/api/login").send({
      email: "test@example.com",
      password: "newpass123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
