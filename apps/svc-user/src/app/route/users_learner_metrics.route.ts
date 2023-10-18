import { Router } from 'express';
import UsersLearnerMetricsController from '../controller/users_learner_metrics.controller';
import { Routes } from '../interface/routes.interface';
import { authMiddleware } from '../middleware/auth.middleware';

class UsersLearnerMetricsRoute implements Routes {
  public path = '/learnerMetrics';
  public router = Router();
  public usersLearnerMetricsController = new UsersLearnerMetricsController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log('learner userss!!!');

    this.router.get(
      `${this.path}/upcomingSessions`,
      //authMiddleware,
      this.usersLearnerMetricsController.fetchUpcomingSessionTrainer
    );
  }
}

export default UsersLearnerMetricsRoute;
