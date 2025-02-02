const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/user.model");

const userRouter = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with hashed password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       201:
 *         description: User added successfully
 *       400:
 *         description: User not added (Error)
 */
userRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

    const user = await userModel.create({ email, password: hashedPassword });

    await user.save();
    res.status(201).json({ msg: "User added successfully...." });
  } catch (error) {
    return res.status(400).json({ msg: "User not added..." });
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Authenticates user and returns a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).send("Incorrect password");
    }

    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.cookie("token", token);
    res.send({ msg: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = userRouter;
