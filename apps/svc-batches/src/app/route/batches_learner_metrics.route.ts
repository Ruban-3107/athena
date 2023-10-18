import { Router } from 'express';

import { Routes } from '../interface/routes.interface';
import BatchesLearnerMetricsController from '../controller/batches_learner_metrics.controller';
import authMiddleware from '../middleware/auth.middleware';
class BatchesLearnerMetricsRoute implements Routes {
  public path = '/learnermetrics';
  public router = Router();
  public batchesLearnerMetricsController =
    new BatchesLearnerMetricsController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log('real batches!!!');
    /**Total Batches count*/
    this.router.get(
      `${this.path}/userTracks`,
      // authMiddleware,
      this.batchesLearnerMetricsController.fetchLearnerCourseSummaryData
    );
    /**Upcoming sessions from schedules tabl */
    this.router.get(
      `${this.path}/upcomingSessions`,
      // authMiddleware,
      this.batchesLearnerMetricsController.fetchUpcomingSessionsfromSchedules
    );

    /**Completed courses from user_tracks*/
    this.router.get(
      `${this.path}/completedCourses`,
      // authMiddleware,
      this.batchesLearnerMetricsController.fetchCompletedCourses
    );
  }
}
export default BatchesLearnerMetricsRoute;
