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
}

export const notificationService = new NotificationService();
