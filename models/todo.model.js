const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           example: "65abc123ef456gh789ijkl"
 *         title:
 *           type: string
 *           description: Title of the todo item
 *           example: "Buy groceries"
 *         description:
 *           type: string
 *           description: Detailed description of the task
 *           example: "Get milk, eggs, and bread from the supermarket"
 *         completed:
 *           type: boolean
 *           description: Status of the task (completed or not)
 *           example: false
 *         isPublic:
 *           type: boolean
 *           description: Whether the task is visible to other users
 *           example: false
 *         userId:
 *           type: string
 *           description: ID of the user who created the todo
 *           example: "65xyz987lmno456pqrs123"
 */

const TodoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  },
  { versionKey: false }
);

const todoModel = mongoose.model("todo", TodoSchema);

module.exports = todoModel;
