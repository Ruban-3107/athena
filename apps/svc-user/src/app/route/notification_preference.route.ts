import { Router } from 'express';
import NotificationPreferenceController from '../controller/notification_preference.controller';
import { Routes } from '../interface/routes.interface';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { authMiddleware } from '../middleware/auth.middleware';

class NotificationPreferenceRoute implements Routes {
  public path = '/notificationPreference';
  public router = Router();
  public notificationPreferenceController =
    new NotificationPreferenceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * API: http://localhost:3000/api/users/notificationPreference/get
     * Method: GET
     * Description: Retrieve the notification preferences.
     * Middleware: Authentication required.
     */
    this.router.get(
      `${this.path}/get`,
      authMiddleware,
      this.notificationPreferenceController.getNotificationPreference
    );
    /**
     * API: http://localhost:3000/api/users/notificationPreference/update
     * Method: PUT
     * ReqBody: {
                    "disableIds":[1,2,3,4]
                } (or)
                {
                    "enableIds":[1,2,3,4]
                }
     * Description: Update the notification preferences.
     * Middleware: Authentication required.
     */
    this.router.put(
      `${this.path}/update`,
      authMiddleware,
      this.notificationPreferenceController.updateNotificationPreference
    );
  }
}

export default NotificationPreferenceRoute;
