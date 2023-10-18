import { Routes } from '../interface/routes.interface';
import { Router } from 'express';
import CoursesTrainerMetricsController from '../controller/courses_trainer_metrics.controller';
import authMiddleware from '../middleware/auth.middleware';

class CoursesTrainerMetricsRoute implements Routes {
  public path = '/trainermetrics';
  public router = Router();
  public coursesTrainerMetricsController =
    new CoursesTrainerMetricsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log('real trainers courses!!!');

    /**topics created by trainer*/
    this.router.get(
      `${this.path}/topicsCreated`,
      //authMiddleware,
      this.coursesTrainerMetricsController.fetchTopicsCreated
    );
    /**content analytics seen by trainer*/
    this.router.get(
      `${this.path}/contentAnalytics`,
      //authMiddleware,
      this.coursesTrainerMetricsController.fetchContentAnalytics
    );
  }
}
export default CoursesTrainerMetricsRoute;
