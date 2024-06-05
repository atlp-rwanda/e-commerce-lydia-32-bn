import { checkout } from '../controllers/orderController.ts/checkoutController.js';
import { Router } from 'express';
import { isLoggedIn } from '../middleware/authMiddleware.js';
import { buyerCheckout } from '../middleware/buyerCheckout.js';

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order with payment and address information
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment:
 *                 type: string
 *                 description: Payment information
 *               address:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     zipCode:
 *                       type: string
 *                     country:
 *                       type: string
 *     responses:
 *       '201':
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   type: object
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

const orderRoutes = Router();
orderRoutes.post('/order',buyerCheckout, isLoggedIn, checkout);

export default orderRoutes;