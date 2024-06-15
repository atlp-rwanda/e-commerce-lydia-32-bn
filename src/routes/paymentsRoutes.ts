import express from "express";
import PaymentController from '../controllers/paymentController/paymentController.js'
import { isBuyer } from "../middleware/isBuyerMiddleware.js";
import {isPasswordNotExpired} from '../middleware/isPasswordExpired.js'
import { userAuthJWT } from "../middleware/verfication.middleware.js";

export const paymentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payments management end-points
 */

/**
 * @swagger
 * /api/payment/pay:
 *   post:
 *     summary: add new payment
 *     description: Endpoint to save customer payment.
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       '201':
 *         description: Payment done successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       '400':
 *         description: Bad request - Invalid payment details
 *       '401':
 *         description: Unauthorized - Token is missing or invalid
 *       '500':
 *         description: Internal server error
 */

paymentRouter.post('/payment/pay',isPasswordNotExpired, userAuthJWT, isBuyer, PaymentController.makePaymentSession);

/**
 * @swagger
 * /api/payment/success:
 *   get:
 *     summary: Handle payment success
 *     description: Endpoint to handle successful payment.
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The Session Id for the payment.
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order for which the payment was successful.
 *     responses:
 *       '200':
 *         description: Payment successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       '400':
 *         description: Bad request - Missing or invalid orderID
 *       '404':
 *         description: Payment not found
 *       '500':
 *         description: Internal server error
 */
paymentRouter.get('/payment/success', isPasswordNotExpired,userAuthJWT, isBuyer, PaymentController.paymentSuccess);

/**
 * @swagger
 * /api/payment/cancel:
 *   get:
 *     summary: Handle payment cancellation
 *     description: Endpoint to handle payment cancellation.
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The Session ID for the payment.
 *       - in: query
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order for which the payment was canceled.
 *     responses:
 *       '200':
 *         description: Payment canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Cancellation message
 *       '400':
 *         description: Bad request - Missing or invalid orderID
 *       '404':
 *         description: Payment not found
 *       '500':
 *         description: Internal server error
 */
paymentRouter.get('/payment/cancel',isPasswordNotExpired, userAuthJWT, isBuyer, PaymentController.paymentCancel);

export default paymentRouter;
