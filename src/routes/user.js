import express from "express";

import {
  deleteUserController,
  forgotPassword,
  getUserController,
  getUsersController,
  loginController,
  logoutController,
  refreshAccessToken,
  registerController,
  resetPassword,
  updateUserController,
} from "../controllers/user.js";

import { isAdmin, verifyAccessToken } from "../middlewares/verifyToken.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: The unique identifier of the product
 *       userName:
 *         type: string
 *         description: The user name
 *       email:
 *         type: string
 *         description: Email user
 *       password:
 *         type: string
 *         description: User password
 *       mobile:
 *         type: string
 *         description: Mobile
 *       birthDay:
 *         type: string
 *         description: Birthday
 *       gender:
 *         type: string
 *         description: Gender
 *     required:
 *       - userName
 *       - email
 *       - password
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns access and refresh tokens
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userData:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *       '400':
 *         description: Bad request. Missing email or password.
 *       '404':
 *         description: Email not found.
 *       '500':
 *         description: Internal server error. Failed to log in.
 */
router.post("/login", loginController);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: User logout
 *     description: Clears the refresh token cookie and logs out the user
 *     tags:
 *       - Authentication
 *     responses:
 *       '200':
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad request. No refresh token found in cookies.
 *       '500':
 *         description: Internal server error. Failed to log out.
 */
router.get("/logout", logoutController);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               userName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully registered a new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *                 token:
 *                   type: string
 *       '400':
 *         description: Bad request. Missing username, password, or email.
 *       '500':
 *         description: Internal server error. Failed to register the user.
 */
router.post("/register", registerController);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Sends a password reset email to the user's email address
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad request. Missing email.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal server error. Failed to send the password reset email.
 */
router.post("/forgotpassword", forgotPassword);

/**
 * @swagger
 * /users/refresh-token:
 *   get:
 *     summary: Refresh access token
 *     description: Refreshes the access token using the refresh token stored in the cookie
 *     tags:
 *       - Authentication
 *     responses:
 *       '200':
 *         description: Successfully refreshed the access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 newAccessToken:
 *                   type: string
 *       '400':
 *         description: Bad request. No refresh token found in cookies.
 *       '500':
 *         description: Internal server error. Failed to refresh the access token.
 */
router.post("/refreshtoken", refreshAccessToken);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Resets the user's password using the provided reset token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error. Failed to reset the password.
 */
router.put("/resetpassword", resetPassword);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves a user by their ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       '200':
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error. Failed to get the user.
 */
router.get("/:id", verifyAccessToken, getUserController);

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     tags: ["Users"]
 *     summary: Update user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: false
 *       content:
 *          application/json:
 *           schema:
 *              type: object
 *              properties:
 *                userName:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *                mobile:
 *                  type: string
 *                birthDay:
 *                  type: string
 *                address:
 *                  type: string
 *                gender:
 *                  type: string
 *              example:
 *                userName: string
 *                email: string
 *                password: string
 *                mobile: string
 *                birthDay: string
 *                address: string
 *                gender: string
 *     responses:
 *       '200':
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Missing inputs
 *       '500':
 *         description: Internal server error. Failed to update the user profile.
 */
router.put("/:id", verifyAccessToken, updateUserController);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Deletes a user by their ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Deletion success message
 *       '500':
 *         description: Internal server error. Failed to delete the user.
 */
router.delete("/:id", [verifyAccessToken, isAdmin], deleteUserController);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '404':
 *         description: No users found
 *       '500':
 *         description: Internal server error. Failed to get users.
 */
router.get("/", [verifyAccessToken, isAdmin], getUsersController);

export default router;
