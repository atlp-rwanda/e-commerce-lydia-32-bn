import express from 'express';
import { UserController } from '../controllers/userController/registeruser.controller.js';
import { loginController } from '../controllers/userController/loginUser.js';
import { loginByGoogle } from '../controllers/userController/LoginUserByEmail.controller.js';
import { blockUser } from '../controllers/userController/blockUser.controller.js';
import { isBlocked } from '../middleware/isBlockedMiddleware.js';
import { userAuthJWT, adminAuthJWT } from '../middleware/verfication.middleware.js';
import { isRoleAdmin } from '../middleware/checkAdminRoleMiddleware.js';
import { verifyTwoFactor } from '../controllers/userController/2Factor.controller.js';
import { authenticateAndAuthorizeUserController } from '../middleware/authenticateAndAuthorizeUser.js';
import { BuyerRequestInstance } from '../controllers/userController/user.getItem.js';
import { validateBuyerProductRequest } from '../middleware/validateSearch.js';
import { getUserCredentials } from '../controllers/userController/getCredentials.controller.js';

export const usersRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users/register:
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
usersRouter.post('/users/register', UserController.createUser);

/**
 * @swagger
 * /api/users/verify:
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
usersRouter.get('/users/verify', UserController.verifyUser);

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
usersRouter.post(
  '/login/user',
  isBlocked,
  authenticateAndAuthorizeUserController.authenticateAndAuthorizeUser,
  loginController.login,
);
usersRouter.get('/users/:id', UserController.getUserById);

/**
 * @swagger
 * /api/users/block/{id}:
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

usersRouter.put('/users/block/:id', isRoleAdmin, blockUser);

/**
 * @swagger
 * /api/users/changepassword/:
 *   patch:
 *     summary: User changes their password
 *     description: Change password with the current password
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

usersRouter.patch('/users/changepassword', userAuthJWT, UserController.changePassword);

/**
 * @swagger
 * /api/users/update:
 *   patch:
 *     summary: User Update personal information
 *     description: User must login and update their information in settings
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Information updated successfully
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

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieves a list of all users in the system. This endpoint is restricted to users with the 'admin' role only.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
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
 *                   example: Users Retrieved succesfully
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden - User does not have admin role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the user
 *         firstName:
 *           type: string
 *           description: First name of the user
 *         lastName:
 *           type: string
 *           description: Last name of the user
 *         email:
 *           type: string
 *           description: Email address of the user
 *         # Add other user properties here
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Logout the currently authenticated user by clearing the JWT cookie and setting a loggedOut cookie.
 *     responses:
 *       '200':
 *         description: Logout successful
 *       '400':
 *         description: Bad Request (e.g., already logged out or not logged in)
 *       '401':
 *         description: Unauthorized - User is not authenticated
 *       '500':
 *         description: Internal Server Error
 */

usersRouter.post('/users/logout', userAuthJWT, UserController.logout);
/**
 * @swagger
 * /api/users/factor:
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

usersRouter.post('/users/factor', verifyTwoFactor);

/**
 * @swagger
 * /api/product/{productId}:
 *   get:
 *     summary: Get a specific available product
 *     description: Retrieves details of a specific available product
 *     tags:
 *       - Products
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

usersRouter.get('/product/:productId', BuyerRequestInstance.getBuyerProduct);
usersRouter.get('/user', userAuthJWT, getUserCredentials);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get current user's credentials
 *     description: Retrieves the credentials of the currently authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: 'Authentication required. Please log in.'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidToken:
 *                 value:
 *                   error: 'Failed to authenticate token, Please Login again'
 *               notVerified:
 *                 value:
 *                   error: 'You are not Verified please verify your email at /verify'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: jwt
 *
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

usersRouter.get('/');
