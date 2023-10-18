import { Request, Response } from 'express';
import UserAdminMetricsService from '../service/users_admin_metrics.service';
import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';

class UsersAdminMetricsController {
  protected userAdminMetricsService = new UserAdminMetricsService();

  /**users graph data*/
  public fetchUsersGraph = async (req: Request, res: Response) => {
    let response: object;
    let message: string;

    try {
      const { view } = req.query;
      const data = await this.userAdminMetricsService.fetchUsersGraph(
        String(view)
      );
      (message = 'users graph data'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              usersGraphData: data,
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

  /**total users count*/
  public fetchTotalUsersCount = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    try {
      const data = await this.userAdminMetricsService.fetchTotalUsersCount();

      (message = 'users count data'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              usersCount: data,
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
  /**users need attention data*/
  public fetchNeedUsersAttentionData = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    const { limit } = req.query;
    try {
      const data =
        await this.userAdminMetricsService.fetchNeedUsersAttentionData(
          Number(limit)
        );

      (message = 'need attention for users data'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              needAttentionUsers: data,
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

  /**users recent activities data*/
  public fetchUsersRecentActivitiesData = async (
    req: Request,
    res: Response
  ) => {
    let response: object;
    let message: string;
    const { limit } = req.query;
    try {
      const data =
        await this.userAdminMetricsService.fetchUsersRecentActivitiesData(
          Number(limit)
        );
      (message = 'users recent activities data'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              usersRecentActivities: data,
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

export default UsersAdminMetricsController;
