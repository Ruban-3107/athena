import { Router } from 'express';
import { Routes } from '../interface/routes.interface';
import LearnerMetricsController from '../controller/learner_metrics.controller';
class LearnerMetricsRoute implements Routes {
  public path = '/learnermetrics';
  public router = Router();
  public adminMetricsController = new LearnerMetricsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**continue learning courses/tracks*/
    this.router.get(
      `${this.path}/continueLearning`,
      this.adminMetricsController.fetchContinueLearningData
    );
    /**learner's upcoming sessions data */
    this.router.get(
      `${this.path}/upcomingSessions`,
      this.adminMetricsController.fetchUpcomingSessions
    );
    /**learner's completed tracks/courses data */
    this.router.get(
      `${this.path}/completedCourses`,
      this.adminMetricsController.fetchCompletedCourses
    );
  }
}

export default LearnerMetricsRoute;
