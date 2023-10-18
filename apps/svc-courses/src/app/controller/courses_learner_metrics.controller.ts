import { Request, Response } from 'express';
import CoursesLearnerMetricsService from '../service/courses_learner_metrics.service';
import {
  bodyCF,
  responseCF,
} from '../../../../../libs/commonResponse/commonResponse';
class CoursesLearnerMetricsController {
  protected courseLearnerMetricsService = new CoursesLearnerMetricsService();
  /**Continue Learning Courses/Tracks*/
  public fetchContinueLearningTracks = async (req: Request, res: Response) => {
    let response: object;
    let message: string;

    try {
      const { limit, trackIds } = req.query;
      const trackIdsArray: number[] = (trackIds as string)
        .split(',')
        .map((id) => Number(id.trim()));
      console.log('before', trackIds);
      console.log(
        'after',
        (trackIds as string).split(',').map((id) => Number(id.trim()))
      );

      const data =
        await this.courseLearnerMetricsService.fetchContinueLearningTracks(
          trackIdsArray,
          Number(limit)
        );

      message = `learner's continue learning data`;
      response = responseCF(
        bodyCF({
          code: 600,
          val: {
            learnerContinueTracks: data,
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

  /**Upcoming sessions Courses/Tracks*/
  public fetchUpcomingSessionsTracks = async (req: Request, res: Response) => {
    let response: object;
    let message: string;

    try {
      const { limit, trackIds, chapterIds, topicIds } = req.query;
      const trackIdsArray: number[] = (trackIds as string)
        .split(',')
        .map((id) => Number(id.trim()));
      console.log('before', trackIds);
      console.log(
        'after',
        (trackIds as string).split(',').map((id) => Number(id.trim()))
      );

      const chapterIdsArray: number[] = (chapterIds as string)
        .split(',')
        .map((id) => Number(id.trim()));

      const topicIdsArray: number[] = (topicIds as string)
        .split(',')
        .map((id) => Number(id.trim()));

      const data =
        await this.courseLearnerMetricsService.fetchUpcomingSessionsTracks(
          trackIdsArray,
          chapterIdsArray,
          topicIdsArray,
          Number(limit)
        );

      message = `learner's upcoming topics chapters data`;
      response = responseCF(
        bodyCF({
          code: 600,
          val: {
            upcomingSessionsCourses: data,
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

  /**Completed Courses/Tracks*/
  public fetchCompletedCoursesOrTracksfromTracks = async (
    req: Request,
    res: Response
  ) => {
    let response: object;
    let message: string;

    try {
      const { courseOrtrackIds, limit } = req.query;
      const courseOrIdsArray: number[] = (courseOrtrackIds as string)
        .split(',')
        .map((id) => Number(id.trim()));
      console.log('before', courseOrtrackIds);
      console.log(
        'after',
        (courseOrtrackIds as string).split(',').map((id) => Number(id.trim()))
      );

      const data =
        await this.courseLearnerMetricsService.fetchCompletedCoursesOrTracksfromTracks(
          courseOrIdsArray,
          Number(limit)
        );

      message = `tracks matching array of ids for completed courses`;
      response = responseCF(
        bodyCF({
          code: 600,
          val: {
            completedCoursesfromTracks: data,
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
export default CoursesLearnerMetricsController;