import { Router } from 'express';
import { addItemToCart, viewUserCart } from '../controllers/cartController/cartControllers.js';

import { isLoggedIn } from '../middleware/authMiddleware.js';

const cartRoutes = Router();

cartRoutes.get('/cart', isLoggedIn, viewUserCart);
cartRoutes.post('/cart/add', isLoggedIn, addItemToCart);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     description: Enter details for the product to add it to the cart.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *               quantity:
 *                 type: number
 *     responses:
 *       '201':
 *         description: cart item created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item added to cart"
 *       '401':
 *         description: Unauthorized - Please log in as buyer
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Display cart
 *     tags: [Cart]
 *     description: Displaying items in cart.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Displaying items from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: number
 *                       quantity:
 *                         type: number
 *       '401':
 *         description: Unauthorized - Please log in as buyer
 *       '500':
 *         description: Internal Server Error
 */

export default cartRoutes;
