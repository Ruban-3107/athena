import { Router } from 'express';
import { Routes } from '../interface/routes.interface';
import { authMiddleware } from '../middleware/auth.middleware';
import NotificationController from '../controller/notifications.controller';

class NotificationRoute implements Routes {
  public path = '/notifications';
  public router = Router();
  public notificationController = new NotificationController();

  constructor() {
    this.initializeRoutes();
  }

  /**
   * API to get all notifications
   */
  private initializeRoutes() {
    this.router.post(
      `${this.path}/get`,
      authMiddleware,
      this.notificationController.notifications
    );

    this.router.post(
      `${this.path}/viewed`,
      authMiddleware,
      this.notificationController.notificationsViewed
    )

    this.router.post(
      `${this.path}/createNotifications`,
      authMiddleware,
      this.notificationController.createNotification
    )

    this.router.post(
      `${this.path}/acceptAndDeclineNotification`,
      authMiddleware,
      this.notificationController.acceptAndDeclineNotification
    )
  }
}

export default NotificationRoute;
