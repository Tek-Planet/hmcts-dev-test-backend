// app.js
const express = require("express");
const cors = require("cors");
const { initDB } = require("./db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

initDB();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send(
     'Welcome to HMCTS Task Management API, If you are seeing this then you made IT :-) ' 
    )
   })
app.use("/api", authRoutes);
app.use("/api/tasks", taskRoutes);

module.exports = app;
