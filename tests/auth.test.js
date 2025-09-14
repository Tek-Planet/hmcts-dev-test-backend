const request = require("supertest");
const app = require("../app");
const { getDB } = require("../db");

beforeAll(() => {
  const db = getDB();
  db.prepare("DELETE FROM users").run();
  db.prepare("DELETE FROM tasks").run();
});

describe("Auth API", () => {
  it("should not allow login with wrong password", async () => {
    // create user
    await request(app).post("/api/register").send({ name: "Test", email: "fail@test.com", password: "1234" });

    // wrong password
    const res = await request(app).post("/api/login").send({ email: "fail@test.com", password: "wrong" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid email or password");
  });

  it("should reject request with no token", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it("should reset password with valid token", async () => {
    const registerRes = await request(app).post("/api/register").send({ name: "Reset", email: "reset@test.com", password: "1234" });
    expect(registerRes.statusCode).toBe(200);

    const forgotRes = await request(app).post("/api/forgot-password").send({ email: "reset@test.com" });
    const token = forgotRes.body.resetToken;

    const resetRes = await request(app).post("/api/reset-password").send({ token, newPassword: "abcd" });
    expect(resetRes.statusCode).toBe(200);
    expect(resetRes.body.message).toBe("Password reset successful");
  });
});
