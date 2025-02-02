const express = require("express");
require("dotenv").config();
const mongoDb = require("./config/db");
const app = express();
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const todoRouter = require("./routes/todo.routes");
const swaggerDocs = require("./swagger"); 
const cors = require("cors")
/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Todo API
 *   description: API for managing users and todos
 *   version: 1.0.0
 * servers:
 *   - url: http://localhost:3000
 *     description: Local server
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     description: Returns a welcome message
 *     responses:
 *       200:
 *         description: A welcome message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Hello welcome!"
 */

app.use(express.json());
app.use(cookieParser());
app.use(cors())

app.get("/", (req, res) => {
  res.send("Hello welcome !");
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: User Registration & Login Routes
 *     description: Handles user registration and login
 *     tags:
 *       - Users
 * /todos:
 *   post:
 *     summary: Todo Management Routes
 *     description: Handles CRUD operations for todos
 *     tags:
 *       - Todos
 */

app.use("/users", userRouter);
app.use("/todos", todoRouter);

swaggerDocs(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  mongoDb();
  console.log(`Server is running on http://localhost:${PORT}`);
});
