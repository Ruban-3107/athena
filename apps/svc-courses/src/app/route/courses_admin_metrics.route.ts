import { Routes } from '../interface/routes.interface';
//import { authMiddleware } from '../middleware/auth.middleware';
import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware';
import CoursesAdminMetricsController from '../controller/courses_admin_metrics.controller';

class CoursesAdminMetricsRoute implements Routes {
  public path = '/adminMetrics';
  public router = Router();
  public coursesController = new CoursesAdminMetricsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log('real courses!!!');

    this.router.get(
      `${this.path}/courseGraph`,
      //authMiddleware,
      this.coursesController.fetchCoursesGraph
    );
    this.router.get(
      `${this.path}/courseCount`,
      //authMiddleware,
      this.coursesController.fetchTotalCoursesCount
    );
    this.router.get(
      `${this.path}/pendingApprovalCoursesCount`,
      //authMiddleware,
      this.coursesController.fetchTotalPendingApprovalCoursesCount
    );
    this.router.get(
      `${this.path}/needAttentionCourses`,
      //authMiddleware,
      this.coursesController.fetchNeedCoursesAttentionData
    );
    this.router.get(
      `${this.path}/pieChart`,
      //authMiddleware,
      this.coursesController.fetchGroupedTracks
    );
  }
}
export default CoursesAdminMetricsRoute;
