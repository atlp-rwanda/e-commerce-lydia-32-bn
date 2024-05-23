import express from 'express';
import verifyToken from '../middleware/verfication.middleware.js';
import { UserController } from '../controllers/userController/registeruser.controller.js';
import { login } from '../controllers/userController/loginUser.js';
import { loginByGoogle } from '../controllers/userController/LoginUserByEmail.controller.js';
import { blockUser } from '../controllers/userController/blockUser.controller.js';
import {isBlocked }from '../middleware/isBlockedMiddleware.js';
import isAdmin from '../middleware/isAdminMiddleware.js';

export const usersRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Sign Up
 *     description: Register a new user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: Signup was successfull, Verification Email sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
usersRouter.post('/register', UserController.createUser);

/**
 * @swagger
 * /api/verify:
 *   post:
 *     summary: Email Verification
 *     description: Verify user email
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '400':
 *         description: User is already verified
 *       '500':
 *         description: Internal server error
 */

usersRouter.post('/verify', verifyToken, UserController.verifyUser);
usersRouter.get('/users/:id', UserController.getUserById);
usersRouter.get('/users',isAdmin, UserController.getAllUsers);
usersRouter.put('/users/update//:id', UserController.updateUser);
/**
 * @swagger
 * /api/users/update/:id:
 *   post:
 *     summary: update user information
 *     description: update personal information
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User info updatede succesfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
usersRouter.patch('/users/update/:id',verifyToken, UserController.updateUser);
usersRouter.delete('/users/delete/:id', UserController.deleteUser);
usersRouter.post('/login/user',isBlocked, login);
usersRouter.post('/login',loginByGoogle)
usersRouter.post('/forgot', UserController.forgotPassword);
usersRouter.get('/reset', UserController.resetPassword);
usersRouter.put('/block/:id',isAdmin, blockUser)

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Log out
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Successfully logged out
 *       '400'
 *         description: You're not logged In
 *       '500':
 *         description: Internal server error
 */
usersRouter.post('/users/logout', UserController.logout);
