import { Request, Response } from 'express';
import CoursesAdminMetricsService from '../service/courses_admin_metrics.service';
import {
  bodyCF,
  responseCF,
} from '../../../../../libs/commonResponse/commonResponse';
class CoursesAdminMetricsController {
  protected courseAdminMetricsService = new CoursesAdminMetricsService();

  /**courses graph data*/
  public fetchCoursesGraph = async (req: Request, res: Response) => {
    let response: object;
    let message: string;

    try {
      const { view } = req.query;
      const data = await this.courseAdminMetricsService.fetchCoursesGraph(
        String(view)
      );
      (message = 'courses graph data'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              coursesGraphData: data,
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

  /**total courses count*/
  public fetchTotalCoursesCount = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    try {
      const data =
        await this.courseAdminMetricsService.fetchTotalCoursesCount();

      (message = 'courses count data'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              coursesCount: data,
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
  /**total pending approval courses*/
  public fetchTotalPendingApprovalCoursesCount = async (
    req: Request,
    res: Response
  ) => {
    let response: object;
    let message: string;
    try {
      const data =
        await this.courseAdminMetricsService.fetchTotalPendingApprovalCoursesCount();

      (message = 'pending approval courses count data'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              pendingApprovalCoursesCount: data,
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

  /**Courses need attention */
  public fetchNeedCoursesAttentionData = async (
    req: Request,
    res: Response
  ) => {
    let response: object;
    let message: string;
    const { limit } = req.query;
    try {
      const data =
        await this.courseAdminMetricsService.fetchNeedCoursesAttentionData(
          Number(limit)
        );

      (message = 'need attention for courses data'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              needAttentionCourses: data,
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

  /**grouped tracks*/
  public fetchGroupedTracks = async (req: Request, res: Response) => {
    let response: object;
    let message: string;

    const { dateRange } = req.query;
    try {
      const data = await this.courseAdminMetricsService.fetchGroupedTracks(
        String(dateRange)
      );

      (message = 'tracks grouped data'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              tracksGroupedData: data,
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
export default CoursesAdminMetricsController;
