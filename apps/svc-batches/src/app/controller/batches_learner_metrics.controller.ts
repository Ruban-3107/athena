import { Request, Response } from 'express';
import {
  bodyCF,
  responseCF,
} from '../../../../../libs/commonResponse/commonResponse';
import BatchLearnerMetricsService from '../service/batches_learner_metrics.service';

class BatchesLearnerMetricsController {
  protected batchLearnerMetricsService = new BatchLearnerMetricsService();
  /**Course Summary Data*/
  public fetchLearnerCourseSummaryData = async (
    req: Request,
    res: Response
  ) => {
    let response: object;
    let message: string;
    const { userId, limit } = req.query;
    try {
      const data =
        await this.batchLearnerMetricsService.fetchLearnerCourseSummaryData(
          Number(userId),
          Number(limit)
        );

      (message = 'course summary data of user'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              courseSummaryData: data,
            },
            status: 'success',
            message,
          })
        ));
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

  /**Upcoming sessions from schedules table*/
  public fetchUpcomingSessionsfromSchedules = async (
    req: Request,
    res: Response
  ) => {
    let response: object;
    let message: string;
    const { userId, limit } = req.query;
    try {
      const data =
        await this.batchLearnerMetricsService.fetchUpcomingSessionsfromSchedules(
          Number(userId),
          Number(limit)
        );

      (message = `learner's upcoming sessions`),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              upcomingSessionsSchedules: data,
            },
            status: 'success',
            message,
          })
        ));
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

  /**Completed courses from user_tracks table*/
  public fetchCompletedCourses = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    const { userId, limit } = req.query;
    try {
      const data = await this.batchLearnerMetricsService.fetchCompletedCourses(
        Number(userId),
        Number(limit)
      );

      (message = `learner's completed courses/tracks`),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              completedCoursesfromUserTracks: data,
            },
            status: 'success',
            message,
          })
        ));
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
export default BatchesLearnerMetricsController;
