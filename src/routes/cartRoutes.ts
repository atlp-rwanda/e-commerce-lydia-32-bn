import { addItemToCart, viewUserCart } from "../controllers/cartController/cartControllers.js";
import { Router } from "express";

import { isLoggedIn } from "../middleware/authMiddleware.js";


const cartRoutes = Router();

cartRoutes.get("/cart",isLoggedIn,viewUserCart);
cartRoutes.post("/cart/add",isLoggedIn,addItemToCart);




/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: add item to cart
 *     tags: [Cart]
 *     description: enter details for product to add it to cart
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
 *       '200':
 *         description: item added to cart 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 
 *       '401':
 *         description: login as buyer
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: display cart
 *     tags: [Cart]
 *     description: edisplaying items in cart
 *     
 *     responses:
 *       '200':
 *         description: displaying item from cart 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   type: object
 *                 
 *       '401':
 *         description: login as buyer
 *       '500':
 *         description: Internal Server Error
 */



export default cartRoutes;