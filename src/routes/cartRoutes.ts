import {
  addItemToCart,
  viewUserCart,
  deleteCartItem,
  updateCartItem,
} from '../controllers/cartController/cartControllers.js';
import { Router } from 'express';

import { isLoggedIn } from '../middleware/authMiddleware.js';

const cartRoutes = Router();

cartRoutes.get('/cart', isLoggedIn, viewUserCart);
cartRoutes.post('/cart/add', isLoggedIn, addItemToCart);
cartRoutes.post('/cart/update/:cartItemId', isLoggedIn, updateCartItem);
cartRoutes.delete('/cart/delete/:cartItemId', isLoggedIn, deleteCartItem);

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

/**
 * @swagger
 * /api/cart/update/{cartItemId}:
 *   post:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cart item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item updated successfully
 *                 updatedItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Invalid quantity or unauthorized access
 *       404:
 *         description: Cart item or product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart/delete/{cartItemId}:
 *   delete:
 *     summary: Delete a cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cart item to delete
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: cart item deleted successfully
 *                 updatedItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Invalid quantity or unauthorized access
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */

export default cartRoutes;
