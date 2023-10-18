import { NextFunction, Request, Response } from 'express';
import AdminMetricsService from '../service/admin_metrics.service';
import {
  responseCF,
  bodyCF,
  codeValue,
} from '../../../../../libs/commonResponse/commonResponse';

class AdminMetricsController {
  protected adminmetricsService = new AdminMetricsService();

  public adminTopTabsData = async (req: Request, res: Response) => {
    let response: any;
    let message: string;
    try {
      const data = await this.adminmetricsService.adminTopTabsData();
      message = 'Admin top tabs data';
      response = responseCF(
        bodyCF({
          code: 600,
          val: { adminTopTabsData: data },
          message,
          status: 'success',
        })
      );
    } catch (error) {
      console.log(error);
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

  public fetchPerformanceChartData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let response: object;
    try {
      const { view } = req.query;
      const data = await this.adminmetricsService.fetchPerformanceChartData(
        String(view)
      );
      response = responseCF(
        bodyCF({
          val: {
            adminPerformanceChartData: data,
          },
          code: 600,
          status: 'success',
          message: 'Fetched admin performance chart data',
        })
      );
    } catch (error) {
      response = responseCF(
        bodyCF({
          code: 611,
          status: 'error',
          message: error.message,
        })
      );
      console.log(error);
    }
    return res.json(response);
  };

  /**Need attention data*/
  public fetchNeedAttentionData = async (req: Request, res: Response) => {
    let response: object;
    try {
      const { limit } = req.query;
      const data = await this.adminmetricsService.fetchNeedAttentionData(
        Number(limit)
      );
      response = responseCF(
        bodyCF({
          val: {
            adminNeedAttentionData: data,
          },
          code: 600,
          status: 'success',
          message: 'Fetched admin need attention data',
        })
      );
    } catch (error) {
      response = responseCF(
        bodyCF({
          code: 611,
          status: 'error',
          message: error.message,
        })
      );
      console.log(error);
    }
    return res.json(response);
  };

  /**Recent activities data*/
  public fetchRecentActivitiesData = async (req: Request, res: Response) => {
    let response: object;
    try {
      const { limit } = req.query;
      const data = await this.adminmetricsService.fetchRecentActivitiesData(
        Number(limit)
      );
      response = responseCF(
        bodyCF({
          val: {
            adminRecentActivitiesData: data,
          },
          code: 600,
          status: 'success',
          message: 'Fetched admin recent activities data',
        })
      );
    } catch (error) {
      response = responseCF(
        bodyCF({
          code: 611,
          status: 'error',
          message: error.message,
        })
      );
      console.log(error);
    }
    return res.json(response);
  };

  public fetchAdminPieChartData = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    const { dateRange } = req.query;
    try {
      const data = await this.adminmetricsService.fetchAdminPieChartData(
        String(dateRange)
      );

      message = 'admin pie chart data';
      response = responseCF(
        bodyCF({
          val: {
            adminPieChartData: data,
          },
          code: 600,
          status: 'success',
          message,
        })
      );
    } catch (error) {
      response = responseCF(
        bodyCF({
          code: 611,
          status: 'error',
          message: error.message,
        })
      );
      console.log(error);
    }
    return res.json(response);
  };
}
export default AdminMetricsController;
