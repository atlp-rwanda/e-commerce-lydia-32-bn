import express from 'express';
import { NotificationController } from '../controllers/notificationController/notificationController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

export const notificationRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: APIs for managing notifications
 */

/**
 * @swagger
 * /api/notification/updatestatus/{id}:
 *   put:
 *     summary: Update notification read status
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the notification to update
 *     responses:
 *       '200':
 *         description: Successfully updated notification read status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification status changed successfully
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 *       '404':
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification not found
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating read status
 */

notificationRouter.put('/notification/updatestatus/:id', NotificationController.updateReadStatus);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for a user
 *     tags: [Notifications]
 *     responses:
 *       '200':
 *         description: Successfully retrieved notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       '400':
 *         description: Invalid User ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid User ID
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error fetching notifications
 */
notificationRouter.get('/notifications', isLoggedIn, NotificationController.viewNotifications);

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get a single notification by ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the notification to retrieve
 *     responses:
 *       '200':
 *         description: Successfully retrieved the notification
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       '400':
 *         description: Invalid User ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid User ID
 *       '404':
 *         description: Notification not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification not found
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving notification
 */

notificationRouter.get('/notifications/:id', isLoggedIn, NotificationController.getNotificationById);
