# HMCTS Task Management API

This project is a simple backend service built for the HMCTS DTS Developer Technical Test. It allows caseworkers to manage their tasks — create, view, update and delete them — with authentication and password reset functionality.

## 🚀 Tech Stack
- Node.js + Express
- SQLite (better-sqlite3) for storage
- JWT for authentication
- bcrypt for password hashing
- Jest + Supertest for testing

## ⚙️ Getting Started

Clone the repo and install dependencies:
```bash
git clone https://github.com/Tek-Planet/hmcts-dev-test-backend.git
cd hmcts-task-api
npm install
```

Start the dev server:
```bash
npm run dev
```

API runs on **http://localhost:3000**

Run the test suite:
```bash
npm test
```

## 📚 API Endpoints

### 🔐 Auth
**POST /api/register**  
Register a new user  
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "123456" }
```

**POST /api/login**  
Login and get a JWT  
```json
{ "email": "jane@example.com", "password": "123456" }
```
Response:
```json
{ "token": "..." }
```

**GET /api/verify-token**  
Verify a token (requires `Authorization: Bearer <token>`)

**POST /api/forgot-password**  
Generates reset token (normally emailed, here just returned in JSON)  
```json
{ "email": "jane@example.com" }
```

**POST /api/reset-password**  
Reset password using token  
```json
{ "token": "resetToken123", "newPassword": "newPass123" }
```

### ✅ Tasks (require `Authorization: Bearer <token>`)
**POST /api/tasks**  
Create a task  
```json
{ "title": "Prepare bundle", "description": "Check docs", "dueDateTime": "2025-09-05T12:00:00Z" }
```

**GET /api/tasks**  
Get all tasks for logged-in user

**GET /api/tasks/:id**  
Get task by ID

**PUT /api/tasks/:id**  
Update a task (title, description, status, dueDateTime)  
```json
{ "status": "completed" }
```

**DELETE /api/tasks/:id**  
Delete a task

## 🗄️ Database Schema

### Users
- id (PK)
- name
- email (unique)
- password (hashed)
- resetToken
- resetTokenExpiry
- createdAt
- updatedAt

### Tasks
- id (PK)
- title
- description
- dueDateTime
- status (default: pending)
- userId (FK → users.id)
- createdAt
- updatedAt

## 🧪 Tests
The project includes Jest + Supertest tests for both auth and tasks.

- Auth: register, login, invalid login, token check, password reset
- Tasks: create, list, get by id, update, delete

Run tests:
```bash
npm test
```

Example output:
```
PASS  tests/auth.test.js
PASS  tests/task.test.js
Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
```

## 📝 Notes
- All requests/responses are JSON
- Tasks require a valid Bearer token
- Password reset returns a token in JSON (no email sending in this test build)
- The app is small but extendable — can swap SQLite for Postgres/MySQL easily

## ✅ Submission
This repo is my submission for the HMCTS DTS Developer Technical Test. It covers:
- Authentication
- Task CRUD
- Password reset
- Validation and error handling
- Database integration
- Unit and integration tests
- Documentation (this README)

## Live Demo  🚀 
https://api.merchantgroup.com.ng


