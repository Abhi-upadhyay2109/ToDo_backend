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
    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Ensure SALT_ROUNDS is set properly
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new userModel({ email, password: hashedPassword });

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });

  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
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
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.password) {
      return res.status(500).json({ msg: "User password is missing in the database" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ msg: "Incorrect password" });
    }

    if (!process.env.SECERT_KEY) {
      console.error("SECRET_KEY is missing!");
      return res.status(500).json({ msg: "Server configuration error" });
    }

    const token = jwt.sign({ email }, process.env.SECERT_KEY, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.json({ msg: "Login successful", token });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
});

module.exports = userRouter;
