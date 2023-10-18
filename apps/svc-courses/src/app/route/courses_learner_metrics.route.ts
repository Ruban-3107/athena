import { Routes } from '../interface/routes.interface';
import { Router } from 'express';
import CoursesLearnerMetricsController from '../controller/courses_learner_metrics.controller';
import authMiddleware from '../middleware/auth.middleware';

class CoursesLearnerMetricsRoute implements Routes {
  public path = '/learnermetrics';
  public router = Router();
  public coursesLearnerMetricsController =
    new CoursesLearnerMetricsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log('real courses!!!');

    /**learner continued courses */
    this.router.get(
      `${this.path}/learnerContinueLearning`,
      // authMiddleware,
      this.coursesLearnerMetricsController.fetchContinueLearningTracks
    );
    /**learner upcoming sessions */
    this.router.get(
      `${this.path}/upcomingSessions`,
      authMiddleware,
      this.coursesLearnerMetricsController.fetchUpcomingSessionsTracks
    );

    /**learners completed courses*/
    this.router.get(
      `${this.path}/completedCourses`,
      authMiddleware,
      this.coursesLearnerMetricsController
        .fetchCompletedCoursesOrTracksfromTracks
    );
  }
}
export default CoursesLearnerMetricsRoute;
