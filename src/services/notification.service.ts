import Notification from '../models/notificationModels.js';

class NotificationService {
  async getNotificationsForUser(userId: number) {
    try {
      const notifications = await Notification.findAll({
        where: { userId },
      });
      return notifications;
    } catch (error) {
      throw new Error(`Error fetching notifications: ${(error as Error).message}`);
    }
  }

  async getNotificationByIdAndUserId(id: number, userId: number) {
    try {
      const notification = await Notification.findOne({
        where: {
          id,
          userId,
        },
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      return notification;
    } catch (error) {
      throw new Error(`Error fetching notification: ${(error as Error).message}`);
    }
  }
}

export const notificationService = new NotificationService();
