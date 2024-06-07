import { Request, Response } from 'express';
import { notificationService } from '../../services/notification.service.js';
import { AuthenticatedRequest } from '../../middleware/authMiddleware.js';
import Notification from '../../models/notificationModels.js';

class notificationController {
  viewNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user || !req.user.id) {
      res.status(400).json({ error: 'Invalid User ID' });
      return;
    }

    const userId = req.user.id;

    try {
      const notifications = await notificationService.getNotificationsForUser(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  updateReadStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      const notification = await Notification.findByPk(Number(id));

      if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }

      const currentReadStatus = notification.getDataValue('readstatus');
      const updatedNotification = await notification.update({ readstatus: !currentReadStatus });

      res.status(200).json({ message: 'Notification status changed successfully', notification: updatedNotification });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  };
}

export const NotificationController = new notificationController();
