import express from 'express';
import { ProductControllerInstance } from '../controllers/productController/productController.js';
import checkToken from '../middleware/checkToken.js';
import { userAuthJWT, sellerAuthJWT, adminAuthJWT } from '../middleware/verfication.middleware.js';
import {
  validateSearchProduct,
  validateCreateProductRequest,
  validateUpdateProductRequest,
} from '../middleware/validateSearch.js';

import { authSellerRole } from '../middleware/checkSellerRole.js';
import { isPasswordNotExpired } from '../middleware/isPasswordExpired.js';

export const productRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductDetails:
 *       type: object
 *       required:
 *         - productName
 *         - description
 *         - productCategory
 *         - price
 *         - quantity
 *         - images
 *       properties:
 *         productName:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         productCategory:
 *           type: string
 *           description: The category of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         quantity:
 *           type: integer
 *           description: The quantity of the product
 *         images:
 *           type: string
 *           description: The comma-separated list of image URLs for the product
 *         dimensions:
 *           type: string
 *           description: The dimensions of the product
 *
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

productRouter.post(
  '/product/create',
  isPasswordNotExpired,
  sellerAuthJWT,
  validateCreateProductRequest,
  authSellerRole,
  ProductControllerInstance.createProduct,
);

/**
 * @swagger
 * /api/product/update/{productId}:
 *   put:
 *     summary: Update an existing product
 *     description: Endpoint to update an existing product.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *     responses:
 *       '200':
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateProductResponse'
 *       '404':
 *         description: Bad request - Product not found
 *       '403':
 *         description: Forbidden - You do not own this product, therefore you cannot update it
 *       '401':
 *         description: Unauthorized - You are not authorized to perform this action
 *       '500':
 *         description: Internal Server Error
 *
 * components:
 *   schemas:
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         productName:
 *           type: string
 *         description:
 *           type: string
 *         productCategory:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         dimensions:
 *           type: string
 *
 *     UpdateProductResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         updatedProduct:
 *           $ref: '#/components/schemas/Product'
 *
 *     Product:
 *       type: object
 *       properties:
 *         productId:
 *           type: number
 *         userId:
 *           type: number
 *         productName:
 *           type: string
 *         description:
 *           type: string
 *         productCategory:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         dimensions:
 *           type: string
 *         isAvailable:
 *           type: boolean
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

productRouter.put(
  '/product/update/:productId',
  isPasswordNotExpired,
  authSellerRole,
  ProductControllerInstance.updateProduct,
);

/**
 * @swagger
 * /api/product/deleteProduct/{productId}:
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
productRouter.delete(
  '/product/deleteProduct/:productId',
  isPasswordNotExpired,
  userAuthJWT,
  ProductControllerInstance.deleteProduct,
);

/**
 * @swagger
 * /api/product/search:
 *   get:
 *     summary: Search for products
 *     description: Endpoint to search for products using various query parameters.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the product to search for
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price of the product
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price of the product
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category of the product
 *     responses:
 *       '200':
 *         description: A list of products that match the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Bad request - Invalid search parameters
 *       '500':
 *         description: Internal server error
 */
productRouter.get(
  '/product/search',
  ProductControllerInstance.searchProduct,
);
