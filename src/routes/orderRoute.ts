import { Router } from 'express';
import { checkout } from '../controllers/orderController.ts/checkoutController.js';
import {isRoleAdmin} from '../middleware/checkAdminRoleMiddleware.js'
import {buyerCheckout} from '../middleware/buyerCheckout.js'
import {validateOrderStatusRequest} from '../middleware/validateSearch.js'
import {OrderStatusControllerInstance} from '../controllers/orderController.ts/orderStatus.js'
import {isPasswordNotExpired} from '../middleware/isPasswordExpired.js'


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


orderRoutes.post('/order',isPasswordNotExpired, buyerCheckout, checkout);

/**
* @swagger
* /api/order/status/{orderId}:
*   get:
*     summary: Get order status
*     description: Retrieve the status of an order
*     tags:
*       - Orders
*     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
*     responses:
*       '200':
*         description: Order status retrieved successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 orderStatus:
*                   type: string
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

orderRoutes.get('/order/status/:orderId', isPasswordNotExpired,buyerCheckout, OrderStatusControllerInstance.getOrderStatus);

/**
* @swagger
* /api/order/status/update/{orderId}:
 *   put:
 *     summary: Update order status
 *     description: Update the status of an order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New order status
 *     responses:
 *       '200':
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedOrder:
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

orderRoutes.put('/order/status/update/:orderId', isRoleAdmin,validateOrderStatusRequest, OrderStatusControllerInstance.updateOrderStatus)

export default orderRoutes;
