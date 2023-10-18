import { Request, Response } from 'express';
import {
  bodyCF,
  responseCF,
} from '../../../../../libs/commonResponse/commonResponse';
import BatchAdminMetricsService from '../service/batches_admin_metrics.service';

class BatchAdminMetricsController {
  protected batchAdminMetricsService = new BatchAdminMetricsService();
  /**Total batches count */
  public fetchTotalBatchesCount = async (req: Request, res: Response) => {
    let response: any;
    let message: string;
    try {
      const data = await this.batchAdminMetricsService.fetchTotalBatchesCount();

      (message = 'batches count data'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              batchesCount: data,
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

  /**batches recent activities data*/
  public fetchBatchesRecentActivitiesData = async (
    req: Request,
    res: Response
  ) => {
    let response: object;
    let message: string;
    const { limit } = req.query;
    try {
      const data =
        await this.batchAdminMetricsService.fetchBatchesRecentActivitiesData(
          Number(limit)
        );
      (message = 'batches recent activities data'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              batchesRecentActivities: data,
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

  /**batches grouped data*/
  public fetchGroupedBatches = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    const { dateRange } = req.query;
    try {
      const data = await this.batchAdminMetricsService.fetchGroupedBatches(
        String(dateRange)
      );
      (message = 'batches grouped data'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              batchesGroupedData: data,
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
export default BatchAdminMetricsController;
