import { Router } from 'express';
import { Routes } from '../interface/routes.interface';
import AdminMetricsController from '../controller/admin_metrics.controller';
import authMiddleware from '../middleware/auth.middleware';
class AdminMetricsRoute implements Routes {
  public path = '/adminmetrics';
  public router = Router();
  public adminMetricsController = new AdminMetricsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**admin top tabs data*/
    this.router.get(
      `${this.path}/adminTopTabsData`,
      //authMiddleware,
      this.adminMetricsController.adminTopTabsData
    );
    /**admin performance chart data */
    this.router.get(
      `${this.path}/adminPerformanceChart`,
      //authMiddleware,
      this.adminMetricsController.fetchPerformanceChartData
    );
    /**admin need attention data */
    this.router.get(
      `${this.path}/adminNeedAttention`,
      //authMiddleware,
      this.adminMetricsController.fetchNeedAttentionData
    );
    /**Recent Activities */
    this.router.get(
      `${this.path}/adminRecentActivities`,
      //authMiddleware,
      this.adminMetricsController.fetchRecentActivitiesData
    );
    /**Pie chart data*/
    this.router.get(
      `${this.path}/adminPieChartData`,
      //authMiddleware,
      this.adminMetricsController.fetchAdminPieChartData
    );
  }
}

export default AdminMetricsRoute;
