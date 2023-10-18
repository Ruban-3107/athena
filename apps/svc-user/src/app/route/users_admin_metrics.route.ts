import { Router } from 'express';
import UsersAdminMetricsController from '../controller/users_admin_metrics.controller';
import { Routes } from '../interface/routes.interface';
import { authMiddleware } from '../middleware/auth.middleware';

class UsersAdminMetricsRoute implements Routes {
  public path = '/adminMetrics';
  public router = Router();
  public usersAdminMetricsController = new UsersAdminMetricsController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log('real userss!!!');

    this.router.get(
      `${this.path}/userGraph`,
      //authMiddleware,
      this.usersAdminMetricsController.fetchUsersGraph
    );
    this.router.get(
      `${this.path}/userCount`,
      //authMiddleware,
      this.usersAdminMetricsController.fetchTotalUsersCount
    );
    this.router.get(
      `${this.path}/needAttentionUsers`,
      //authMiddleware,
      this.usersAdminMetricsController.fetchNeedUsersAttentionData
    );
    this.router.get(
      `${this.path}/usersRecentActivities`,
      //authMiddleware,
      this.usersAdminMetricsController.fetchUsersRecentActivitiesData
    );
  }
}

export default UsersAdminMetricsRoute;
