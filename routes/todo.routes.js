const express = require("express");
const todoModel = require("../models/todo.model");
const isAuthenticated = require("../middleware/authenticated");
const userModel = require("../models/user.model");
const todoRouter = express.Router();

/**
 * @swagger
 * /todos/add:
 *   post:
 *     summary: Add a new todo
 *     description: Creates a new todo item and saves it in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Buy groceries"
 *               description:
 *                 type: string
 *                 example: "Get milk, eggs, and bread"
 *               isPublic:
 *                 type: boolean
 *                 example: false
 *               userId:
 *                 type: string
 *                 example: "65abc123ef456gh789ijkl"
 *     responses:
 *       201:
 *         description: Todo item added successfully
 *       404:
 *         description: Error while adding todo
 */
todoRouter.post("/add", async (req, res) => {
  try {
    const todo = await todoModel.create(req.body);
    await todo.save();
    res.status(201).json({ msg: "Todo added...", todo });
  } catch (error) {
    res.status(404).json({ error });
  }
});

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get user's todos (private & public)
 *     description: Fetches private todos of the logged-in user and public todos of other users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched todos
 *       404:
 *         description: Error while fetching todos
 */
todoRouter.get("/", isAuthenticated, async (req, res) => {
  const email = req.user;
  const userID = await userModel.find({ email });
  try {
    const id = userID[0]._id.toString();
    const userdata = await todoModel.find({ userId: id, isPublic: false });
    const publicData = await todoModel.find({ isPublic: true, email: { $ne: email } });

    res.status(200).send({ userdata, publicData });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo
 *     description: Updates a specific todo based on the ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65abc123ef456gh789ijkl"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated todo title"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               isPublic:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       400:
 *         description: Error updating todo
 */
todoRouter.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    await todoModel.findByIdAndUpdate({ _id: id }, req.body);
    res.send({ msg: "Todo details updated" });
  } catch (error) {
    res.send({ msg: "There has been an error", error });
  }
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     description: Deletes a specific todo based on the ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65abc123ef456gh789ijkl"
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       400:
 *         description: Error deleting todo
 */
todoRouter.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    await todoModel.findByIdAndDelete({ _id: id });
    res.send({ msg: "Todo deleted successfully" });
  } catch (error) {
    res.send({ msg: "There has been an error", error });
  }
});

module.exports = todoRouter;
