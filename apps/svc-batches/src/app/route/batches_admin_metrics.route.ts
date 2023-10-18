import { Router } from 'express';
import BatchAdminMetricsController from '../controller/batches_admin_metrics.controller';
import { Routes } from '../interface/routes.interface';
import authMiddleware from '../middleware/auth.middleware';

class BatchesAdminMetricsRoute implements Routes {
  public path = '/adminmetrics';
  public router = Router();
  public batchesAdminMetricsController = new BatchAdminMetricsController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log('real batches!!!');
    /**Total Batches count */
    this.router.get(
      `${this.path}/batchCount`,
      //authMiddleware,
      this.batchesAdminMetricsController.fetchTotalBatchesCount
    );
    /**Batches recent activities*/
    this.router.get(
      `${this.path}/batchesRecentActivities`,
      //authMiddleware,
      this.batchesAdminMetricsController.fetchBatchesRecentActivitiesData
    );
    /**Batches grouped data*/
    this.router.get(
      `${this.path}/pieChart`,
      //authMiddleware,
      this.batchesAdminMetricsController.fetchGroupedBatches
    );
  }
}
export default BatchesAdminMetricsRoute;
