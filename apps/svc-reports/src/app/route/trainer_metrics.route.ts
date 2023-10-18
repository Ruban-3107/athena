import { Router } from 'express';
import { Routes } from '../interface/routes.interface';
import TrainerMetricsController from '../controller/trainer_metrics.controller';
class TrainerMetricsRoute implements Routes {
  public path = '/trainermetrics';
  public router = Router();
  public trainerMetricsController = new TrainerMetricsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**trainer top tabs data*/
    this.router.get(
      `${this.path}/trainerTopTabsData`,
      this.trainerMetricsController.trainerTopTabsData
    );
    /**Content analytics data*/
    this.router.get(
      `${this.path}/contentAnalytics`,
      this.trainerMetricsController.fetchContentAnalytics
    );
  }
}

export default TrainerMetricsRoute;
