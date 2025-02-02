const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * security:
 *   - BearerAuth: []
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Invalid or missing token"
 */

const isAuthenticated = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Please Login First !" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Something Went Wrong !" });
  }
};

module.exports = isAuthenticated;
