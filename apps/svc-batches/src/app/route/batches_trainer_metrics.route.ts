import { Router } from 'express';

import { Routes } from '../interface/routes.interface';
import BatchesTrainerMetricsController from '../controller/batches_trainer_metrics.controller';
//import { authMiddleware } from '../middleware/auth.middleware';
class BatchesTrainerMetricsRoute implements Routes {
  public path = '/trainermetrics';
  public router = Router();
  public batchesTrainerMetricsController =
    new BatchesTrainerMetricsController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log('real batches!!!');
    /**Total Batches count*/
    this.router.get(
      `${this.path}/hoursTrained`,
      //authMiddleware,
      this.batchesTrainerMetricsController.fetchTotalHoursTrained
    );
    /**Total Batches count*/
    this.router.get(
      `${this.path}/learnersTrained`,
      //authMiddleware,
      this.batchesTrainerMetricsController.fetchLearnersTrained
    );
    /**Schedules this month*/
    this.router.get(
      `${this.path}/trainerSchedules`,
      //authMiddleware,
      this.batchesTrainerMetricsController.fetchSchedulesCountThisMonth
    );
  }
}
export default BatchesTrainerMetricsRoute;
