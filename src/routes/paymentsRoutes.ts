 import express from "express";
import checkToken from "../middleware/checkToken.js";
import PaymentController from '../controllers/paymentController/paymentController.js'
import { isBuyer } from "../middleware/isBuyerMiddleware.js";
import bodypaarser from 'body-parser';

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

paymentRouter.post('/payment/pay', checkToken, isBuyer, PaymentController.createPaymentIntent.bind(PaymentController));


// /**
//  * @swagger
//  * /api/webhook:
//  *   post:
//  *     summary: confirm payment
//  *     description: Endpoint to confirm customer payment.
//  *     tags: [Payments]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Payment'
//  *     responses:
//  *       '201':
//  *         description: Payment done successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Payment'
//  *       '400':
//  *         description: Bad request - Invalid payment details
//  *       '401':
//  *         description: Unauthorized - Token is missing or invalid
//  *       '500':
//  *         description: Internal server error
//  */
paymentRouter.post('/webhook', bodypaarser.raw({ type: 'application/json' }), PaymentController.handleWebhook.bind(PaymentController));

