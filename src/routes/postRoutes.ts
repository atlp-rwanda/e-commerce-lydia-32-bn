import { Router } from 'express';
import { createMessage, viewAllMessage } from '../controllers/postController/messageController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';
import { isPasswordNotExpired } from '../middleware/isPasswordExpired.js';

const postRoutes = Router();

postRoutes.get('/post', viewAllMessage);
postRoutes.post('/post/add', isPasswordNotExpired, isLoggedIn, createMessage);

/**
 * @swagger
 * /api/post:
 *   get:
 *     summary: Get all posts
 *     description: Retrieves all posts from the database.
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         content:
 *           type: string
 *         name:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         message:
 *           type: string
 *
 * @route GET /api/post
 * @summary Get all posts
 * @description Retrieves all posts from the database.
 * @returns {Promise<Response>} - Promise resolving with the response object containing an array of posts
 * @throws {Error} - If there is an error retrieving posts
 */

/**
 * @swagger
 * /api/post/add:
 *   post:
 *     summary: Create a new post
 *     description: Creates a new post in the database. Requires authentication.
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - bearerAuth: []
 *
 * components:
 *   schemas:
 *     PostInput:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         content:
 *           type: string
 *         name:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         message:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * @route POST /api/post/add
 * @summary Create a new post
 * @description Creates a new post in the database. Requires authentication.
 * @security Bearer
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing the post content
 * @param {string} req.body.content - Content of the new post
 * @returns {Promise<Response>} - Promise resolving with the response object containing the created post
 * @throws {Error} - If there is an error creating the post
 */

export default postRoutes;
