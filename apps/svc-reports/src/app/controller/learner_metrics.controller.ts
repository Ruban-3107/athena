import { Request, Response } from 'express';
import LearnerMetricsService from '../service/learner_metrics.service';
import { bodyCF, responseCF } from 'libs/commonResponse/commonResponse';

class LearnerMetricsController {
  protected learnerMetricsService = new LearnerMetricsService();

  /**Continue Learning Courses/Tracks*/
  public fetchContinueLearningData = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    const { userId, limit } = req.query;
    try {
      const data = await this.learnerMetricsService.fetchContinueLearning(
        Number(userId),
        Number(limit)
      );

      message = 'Users continue learning data';

      response = responseCF(
        bodyCF({
          code: 600,
          val: { userContinueLearning: data },
          status: 'success',
          message,
        })
      );
    } catch (error) {
      response = responseCF(
        bodyCF({
          code: 611,
          message: error.message,
          status: 'fail',
        })
      );
    }
    return res.json(response);
  };

  /**Upcoming sessions for the learner bro*/
  public fetchUpcomingSessions = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    try {
      const { userId, limit } = req.query;
      const data = await this.learnerMetricsService.fetchUpcomingSessions(
        Number(userId),
        Number(limit)
      );
      message = `learner's upcoming sessions`;
      response = responseCF(
        bodyCF({
          code: 600,
          val: { userUpcomingSessions: data },
          message,
          status: 'success',
        })
      );
    } catch (error) {
      response = responseCF(
        bodyCF({
          code: 611,
          message: error.message,
          status: 'fail',
        })
      );
    }
    return res.json(response);
  };

  /**Completed courses for learner*/
  public fetchCompletedCourses = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    try {
      const { userId, limit } = req.query;
      const data = await this.learnerMetricsService.fetchCompletedCourses(
        Number(userId),
        Number(limit)
      );
      message = `learner's completed tracks/courses`;
      response = responseCF(
        bodyCF({
          code: 600,
          val: { userCompletedCourses: data },
          message,
          status: 'success',
        })
      );
    } catch (error) {
      response = responseCF(
        bodyCF({
          code: 611,
          message: error.message,
          status: 'fail',
        })
      );
    }
    return res.json(response);
  };
}
export default LearnerMetricsController;