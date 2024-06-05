import express from 'express';
import { sellerControllerInstance } from '../controllers/seller controller/sellerController.js';
import { validateSellerProductRequest } from '../middleware/validateSearch.js';
import { authSellerRole } from '../middleware/checkSellerRole.js';

export const sellerRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sellers
 *   description: Seller-related operations
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 *         productName:
 *           type: string
 *           example: Product Name
 *         description:
 *           type: string
 *           example: Product Description
 *         productCategory:
 *           type: string
 *           example: Category
 *         price:
 *           type: number
 *           example: 99.99
 *         quantity:
 *           type: integer
 *           example: 10
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ['image1.jpg', 'image2.jpg']
 *         dimensions:
 *           type: string
 *           example: 10x10x10
 *         isAvailable:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2023-05-21T12:34:56.789Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2023-05-21T12:34:56.789Z'
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: Invalid request parameters
 */

/**
 * @swagger
 * /api/seller/products:
 *   get:
 *     summary: Get all products for specific seller
 *     description: Retrieves a list of all products associated with the authenticated seller
 *     tags:
 *       - Sellers
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Products fetched successfully
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
sellerRouter.get('/seller/products', sellerControllerInstance.getAllProductsBySeller);

/**
 * @swagger
 * /api/seller/products/{productId}/availability:
 *   put:
 *     summary: Update product availability
 *     description: Updates the availability status of a product for the authenticated seller
 *     tags:
 *       - Sellers
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product is now available for buyers
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
sellerRouter.put('/seller/products/:productId/availability', sellerControllerInstance.updateProductAvailability);
/**
 * @swagger
 * /api/products/available:
 *   get:
 *     summary: Get available products in the store
 *     description: Retrieves a list of all available products
 *     tags:
 *       - Sellers
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Available products fetched successfully
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

sellerRouter.get('/products/available', sellerControllerInstance.getAvailableProducts);

/**
 * @swagger
 * /api/seller/products/{productId}:
 *   get:
 *     summary: Get a specific product for a seller
 *     description: Retrieves details of a specific product belonging to the authenticated seller
 *     tags:
 *       - Sellers
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product found in your products
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *               example:
 *                 message: Oops!!! There is no match of the product in your products
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

sellerRouter.get(
  '/seller/products/:productId',
  validateSellerProductRequest,
  authSellerRole,
  sellerControllerInstance.getSellerProduct,
);
