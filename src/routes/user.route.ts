import express from 'express';
import { UserController } from '../controllers/userController/registeruser.controller.js';
import { loginController } from '../controllers/userController/loginUser.js';
import { loginByGoogle } from '../controllers/userController/LoginUserByEmail.controller.js';
import { blockUser } from '../controllers/userController/blockUser.controller.js';
import { isBlocked } from '../middleware/isBlockedMiddleware.js';
import { userAuthJWT, sellerAuthJWT, adminAuthJWT, verifyToken } from '../middleware/verfication.middleware.js';
import { isRoleAdmin } from '../middleware/checkAdminRoleMiddleware.js';
import { verifyTwoFactor } from '../controllers/userController/2Factor.controller.js'
import { authenticateAndAuthorizeUserController }from '../middleware/authenticateAndAuthorizeUser.js'
import { BuyerRequestInstance } from '../controllers/userController/user.getItem.js'
import { validateBuyerProductRequest} from '../middleware/validateSearch.js';

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
usersRouter.post('/verify', verifyToken, UserController.verifyUser);

/**
 * @swagger
 * /api/login/user:
 *   post:
 *     summary: Authenticate user
 *     tags: [Users]
 *     description: Authenticate a user and generate a JSON Web Token (JWT) for authentication. If the user's role is "seller", it also sends a two-factor authentication (2FA) code via email and SMS.
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
 *         description: Login successful or 2FA code sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       '401':
 *         description: Invalid email or password, user not verified, or user account blocked
 *       '500':
 *         description: Internal Server Error
 */

/**
 * Authenticate a user and generate a JSON Web Token (JWT) for authentication. If the user's role is "seller", it also sends a two-factor authentication (2FA) code via email and SMS.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the login operation is complete.
 */
usersRouter.post('/login/user', isBlocked, authenticateAndAuthorizeUserController.authenticateAndAuthorizeUser, loginController.login);
usersRouter.get('/users/:id', UserController.getUserById);
usersRouter.get('/users',isRoleAdmin, UserController.getAllUsers);
usersRouter.put('/users/update//:id', UserController.updateUser);


/**
 * @swagger
 * /api/block/{id}:
 *   put:
 *     summary: Block a user
 *     description: Blocks a user account and sends an email notification. Requires admin privileges.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to be blocked
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'user is blocked'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Only Admin can access this route'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'No token found'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *     security:
 *       - bearerAuth: []
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * @route PUT /users/block/{id}
 * @summary Block a user
 * @description Blocks a user account and sends an email notification. Requires admin privileges.
 * @param {Object} req - Express request object
 * @param {string} req.params.id - ID of the user to be blocked
 * @param {Object} res - Express response object
 * @returns {Promise<Response>} - Promise resolving with the response object
 */

usersRouter.put('/block/:id',isRoleAdmin, blockUser)
usersRouter.get('/users', adminAuthJWT, UserController.getAllUsers);
usersRouter.put('/users/update/:id', UserController.updateUser);

usersRouter.get('/users', isRoleAdmin, UserController.getAllUsers);
usersRouter.patch('/changepassword', userAuthJWT, UserController.changePassword);
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
usersRouter.get('/users', isRoleAdmin, UserController.getAllUsers);
usersRouter.put('/users/update/:id', UserController.updateUser);
usersRouter.put('/block/:id', isRoleAdmin, blockUser);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Users
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
 * /api/factor:
 *   post:
 *     summary: Verify two-factor authentication code
 *     tags: [Users]
 *     description: Verify the two-factor authentication (2FA) code provided by the user and generate a JSON Web Token (JWT) for authentication if the code is valid.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               twoFactorCode:
 *                 type: string
 *     responses:
 *       '200':
 *         description: 2FA code verified, login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       '400':
 *         description: Invalid user or 2FA not enabled, or invalid 2FA code
 *       '500':
 *         description: Internal Server Error
 */

/**
 * Verify the two-factor authentication (2FA) code provided by the user and generate a JSON Web Token (JWT) for authentication if the code is valid.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {string} req.body.twoFactorCode - The 2FA code provided by the user.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the 2FA verification operation is complete.
 */
usersRouter.post('/factor', verifyTwoFactor)

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

usersRouter.get('/users/products/:productId',validateBuyerProductRequest, BuyerRequestInstance.getBuyerProduct);

