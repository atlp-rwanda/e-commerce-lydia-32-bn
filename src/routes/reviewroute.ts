import express from "express";
import {reviewControllers} from "../controllers/reviewController/review.controller.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";
import { BuyerMiddleware} from "../middleware/buyerMiddleware.js";
import {isPasswordNotExpired} from '../middleware/isPasswordExpired.js'

export const reviewRouter = express.Router();
/**
 * @swagger
 * /api/review/create:
 *   post:
 *     summary: Create   review for product
 *     description: A buyer should be able to provide a review on a product they have bought successfully, with feedback
 *     tags:
 *       - Review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: id of product to be reviewed
 *               RatingValue:
 *                 type: integer
 *                 description: Value of rating between 0-10
 *               review:
 *                 type: string
 *                 description: Feedback for product
 *
 *
 *
 *     responses:
 *       '201':
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '401':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 */

 reviewRouter.post('/review/create',isLoggedIn,isPasswordNotExpired, BuyerMiddleware, reviewControllers.addReview)
 
