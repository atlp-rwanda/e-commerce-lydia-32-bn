import express from "express";
import { ProductControllerInstance } from "../controllers/productController/productController.js";
import verifyToken from '../middleware/verfication.middleware.js';



export const productRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/product/create:
 *   post:
 *     summary: Create a new product
 *     description: Endpoint to create a new product.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductDetails'
 *     responses:
 *       '201':
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Bad request - Invalid product data
 *       '401':
 *         description: Unauthorized - Token is missing or invalid
 *       '500':
 *         description: Internal server error
 */
productRouter.post('/product/create',verifyToken,ProductControllerInstance.createProduct);

productRouter.put('/product/update/:productId', verifyToken, ProductControllerInstance.updateProduct);
