import express from 'express';
import verifyToken from '../middleware/verfication.middleware.js';
import { UserController } from '../controllers/userController/registeruser.controller.js';
import { login } from '../controllers/userController/loginUser.js';
import { loginByGoogle } from '../controllers/userController/LoginUserByEmail.controller.js';



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
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication
 *
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
usersRouter.post('/login/user', login);
usersRouter.get('/users/:id', UserController.getUserById);
usersRouter.get('/users', UserController.getAllUsers);
usersRouter.put('/users/update//:id', UserController.updateUser);
usersRouter.delete('/users/delete/:id', UserController.deleteUser);
usersRouter.post('/login', loginByGoogle);
usersRouter.post('/forgot', UserController.forgotPassword);
usersRouter.get('/reset', UserController.resetPassword);



