import express from 'express';
import OrderController from '../controllers/ordersController/orderController.js';
import {userAuthJWT} from '../middleware/verfication.middleware.js'
import {isBuyer} from '../middleware/isBuyerMiddleware.js'
import {isRoleAdmin} from '../middleware/checkAdminRoleMiddleware.js'

export const ordersRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Orders management end-points
 */

/**
 * @swagger
 * /orders/newOrder:
 *   post:
 *     summary: Create a new order
 *     description: Place a new order.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       '201':
 *         description: Order Sent Successful 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 *
 */
ordersRouter.post('/orders/newOrder', userAuthJWT, isBuyer, OrderController.createOrder);
 
/** 
 * @swagger
 * /orders/getOrderById/{orderId}:
 *   get:
 *     summary: Get an order by ID
 *     description: Get order with a specific ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Order retrieved Successful 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Internal Server Error
 */ 
ordersRouter.get('/orders/getOrderById/:orderId', userAuthJWT, isBuyer, OrderController.getOrderById);

 /**
 * @swagger
 * /orders/getAllOrdersByUser:
 *   get:
 *     summary: Get all orders for a user
 *     description: Get all orders for a currently logged in user.
 *     tags: [Orders]
 *     responses:
 *       '200':
 *         description: Successfully Retrieved your orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       '500':
 *         description: Internal Server Error
 */
 ordersRouter.get('/orders/getAllOrdersByUser', userAuthJWT, isBuyer, OrderController.getOrdersByUserId);

 /**
 * @swagger
 * /orders/getAllOrders:
 *   get:
 *     summary: Get all orders from users
 *     description: Get all Users orders Reserved For admins only.
 *     tags: [Orders]
 *     responses:
 *       '200':
 *         description: Successfully Retrieved all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       '500':
 *         description: Internal Server Error
 */
 ordersRouter.get('/orders/getAllOrders', isRoleAdmin, OrderController.getAllOrders);
