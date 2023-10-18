import { Request, Response } from 'express';
import CoursesTrainerMetricsService from '../service/courses_trainer_metrics.service';
import {
  bodyCF,
  responseCF,
} from '../../../../../libs/commonResponse/commonResponse';
class CoursesTrainerMetricsController {
  protected coursesTrainerMetricsService = new CoursesTrainerMetricsService();
  /**Continue Learning Courses/Tracks*/
  public fetchTopicsCreated = async (req: Request, res: Response) => {
    let response: object;
    let message: string;

    try {
      const { trainerId } = req.query;

      const data = await this.coursesTrainerMetricsService.fetchTopicsCreated(
        Number(trainerId)
      );

      message = `topics created by trainer`;
      response = responseCF(
        bodyCF({
          code: 600,
          val: {
            topicsCreated: data,
          },
          status: 'success',
          message,
        })
      );
    } catch (error) {
      response = responseCF(
        bodyCF({
          message: error.message,
          code: 611,
          status: 'fail',
        })
      );
    }
    return res.json(response);
  };
  /**Continue Learning Courses/Tracks*/
  public fetchContentAnalytics = async (req: Request, res: Response) => {
    let response: object;
    let message: string;

    try {
      const { createdBy, type } = req.query;

      const data =
        await this.coursesTrainerMetricsService.fetchContentAnalytics(
          Number(createdBy),
          String(type)
        );

      message = `trainer content analytics.`;
      response = responseCF(
        bodyCF({
          code: 600,
          val: {
            contentAnalyticsData: data,
          },
          status: 'success',
          message,
        })
      );
    } catch (error) {
      response = responseCF(
        bodyCF({
          message: error.message,
          code: 611,
          status: 'fail',
        })
      );
    }
    return res.json(response);
  };
}
export default CoursesTrainerMetricsController;
