import express from 'express';
import { UserController } from '../controllers/userController/registeruser.controller.js';
import { login } from '../controllers/userController/loginUser.js';
import { loginByGoogle } from '../controllers/userController/LoginUserByEmail.controller.js';
import { validateRequest, getBuyerProductSchema } from '../validations/getItem.validation.js';
import {getBuyerProduct} from '../controllers/userController/user.getItem.js'
import { blockUser } from '../controllers/userController/blockUser.controller.js';
import { isBlocked } from '../middleware/isBlockedMiddleware.js';
import isAdmin from '../middleware/isAdminMiddleware.js';

import { userAuthJWT, sellerAuthJWT, adminAuthJWT } from "../middleware/verfication.middleware.js"


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
 *         description: Signup was successful, Verification Email sent
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
usersRouter.post('/verify', UserController.verifyUser);

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication
 */

/**
 * @swagger
 * /api/login/user:
 *   post:
 *     summary: User login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       '401':
 *         description: Invalid email or password, or user not verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: myPassword123
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Login successful
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Invalid email or password
 */
usersRouter.post('/login/user', isBlocked, login);
usersRouter.get('/users/:id', UserController.getUserById);
usersRouter.get('/users', adminAuthJWT, UserController.getAllUsers);
usersRouter.put('/users/update/:id', UserController.updateUser);

usersRouter.get('/users',isAdmin, UserController.getAllUsers);
usersRouter.patch('/changepassword',userAuthJWT, UserController.changePassword);
/**
 * @swagger
 * /api/users/update/:id:
 *   patch:
 *     summary: update user information
 *     description: update personal information
 *   post:
 *     summary: Update user information
 *     description: Update personal information
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User info updated successfully
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
usersRouter.patch('/users/update', userAuthJWT, UserController.updateUser);
usersRouter.delete('/users/delete/:id', UserController.deleteUser);
usersRouter.post('/login', loginByGoogle);
usersRouter.post('/forgot', UserController.forgotPassword);
usersRouter.get('/reset', UserController.resetPassword);
usersRouter.put('/block/:id', isAdmin, blockUser);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - User
 *     description: Logout the currently authenticated user by clearing the JWT cookie and setting a loggedOut cookie.
 *     responses:
 *       '200':
 *         description: Logout successful
 *       '400':
 *         description: Bad Request (e.g., already logged out or not logged in)
 *       '500':
 *         description: Internal Server Error
 */

/**
 * Logout the currently authenticated user.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the logout operation is complete.
 */

usersRouter.post('/users/logout', UserController.logout);

/**
 * @swagger
 * /api/users/products/{productId}:
 *   get:
 *     summary: Get a specific product for a buyer
 *     description: Retrieves details of a specific available product
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product available in store
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *               example:
 *                 message: Oops!!! There is no match for this product in available products
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


usersRouter.get('/users/products/:productId', validateRequest(getBuyerProductSchema), getBuyerProduct);
