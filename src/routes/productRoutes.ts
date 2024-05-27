import express from "express";
import { ProductControllerInstance } from "../controllers/productController/productController.js";
import checkToken from "../middleware/checkToken.js";
import { userAuthJWT, sellerAuthJWT, adminAuthJWT } from "../middleware/verfication.middleware.js"


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

productRouter.post('/product/create', sellerAuthJWT, ProductControllerInstance.createProduct);
productRouter.put('/product/update/:productId', sellerAuthJWT, ProductControllerInstance.updateProduct);

/**
 * @swagger
 * /api/product/deleteProduct/:productId:
 *   delete:
 *     summary: Delete an existing product
 *     description: Endpoint to delete an existing product.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of product to be deleted
 *     responses:
 *       '200':
 *         description: Product deleted successfully
 *       '404':
 *         description: Bad request - Either product doesn't exist or belongs to you
 *       '401':
 *         description: Unauthorized - You are not authorized to perform such action
 */
productRouter.delete('/product/deleteProduct/:productId', checkToken, ProductControllerInstance.deleteProduct);
