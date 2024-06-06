import express from "express";
import { notificationControllerInstance } from "../controllers/notificationController/notificationController.js"


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

export const notificationRouter = express.Router();

notificationRouter.put('/notification/updatestatus/:id', notificationControllerInstance.updateReadStatus);