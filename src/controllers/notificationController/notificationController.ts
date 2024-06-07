import { Request, Response } from 'express';
import Notification from '../../models/notificationModels.js'

class notificationController {

    async updateReadStatus(req: Request, res: Response): Promise<void> {

        try {

            const id = req.params.id;
        
            const notification = await Notification.findByPk(Number(id));

            if (!notification) {
                res.status(404).json({ message: 'Notification not found' });
                return;
            }

            const currentReadStatus = notification.getDataValue('readstatus');
            const updatedNotification = await notification.update({ readstatus: !currentReadStatus });

            res.status(200).json({ message: "Notification status changed successfully", notification: updatedNotification });

        } catch (error: any) {
        res.status(500).json({ message: error.message });
        console.log(error);
        }
    }
}

export const notificationControllerInstance = new notificationController();