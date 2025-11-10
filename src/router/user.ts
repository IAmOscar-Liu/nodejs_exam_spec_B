import { Router } from "express";
import UserController from "../controller/user";
import isAuth from "../middleware/isAuth";

const router = Router();
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The user's unique identifier.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         name:
 *           type: string
 *           description: The user's name.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was last updated.
 *
 *     NewUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password. Must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.
 *         name:
 *           type: string
 *           description: The user's name.
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password.
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: The JWT access token.
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         statusCode:
 *           type: integer
 *         message:
 *           type: string
 *
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags: [User]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUserInput'
 *     responses:
 *       200:
 *         description: User registered successfully. Returns user info and access token.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad Request - Missing fields or invalid password policy.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/register", UserController.register);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags: [User]
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful. Returns user info and access token. Sets refresh token in an HTTP-only cookie.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad Request - Missing email or password.
 *       404:
 *         description: Not Found - Invalid email or password.
 */
router.post("/login", UserController.login);

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     tags: [User]
 *     summary: Get current user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       404:
 *         description: Not Found - User not found.
 */
router.get("/me", isAuth, UserController.getUserProfile);

/**
 * @swagger
 * /api/user/refresh-token:
 *   post:
 *     tags: [User]
 *     summary: Refresh access token
 *     description: Uses the refresh token from the HTTP-only cookie to issue a new access token.
 *     responses:
 *       200:
 *         description: Successfully refreshed token.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: The new JWT access token.
 *       401:
 *         description: Unauthorized - Refresh token does not exist.
 *       403:
 *         description: Forbidden - Invalid refresh token or user no longer exists.
 */
router.post("/refresh-token", UserController.refreshToken);

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     tags: [User]
 *     summary: Log out a user
 *     description: Clears the refresh token cookie.
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: "OK"
 */
router.post("/logout", UserController.logout);

export default router;
