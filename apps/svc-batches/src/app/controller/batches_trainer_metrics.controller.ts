import { Request, Response } from 'express';
import {
  bodyCF,
  responseCF,
} from '../../../../../libs/commonResponse/commonResponse';
import BatchTrainerMetricsService from '../service/batches_trainer_metrics.service';

class BatchesTrainerMetricsController {
  protected batchesTrainerMetricsService = new BatchTrainerMetricsService();
  /**Total hours trained by trainer*/
  public fetchTotalHoursTrained = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    const { trainerId, limit } = req.query;
    try {
      const data =
        await this.batchesTrainerMetricsService.fetchTotalHoursTrained(
          Number(trainerId)
        );

      (message = 'total hours trained by trainer'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              hoursTrained: data,
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

  /**Number of learners trained by trainer*/
  public fetchLearnersTrained = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    const { trainerId, limit } = req.query;
    try {
      const data = await this.batchesTrainerMetricsService.fetchLearnersTrained(
        Number(trainerId)
      );

      (message = 'total hours trained by trainer'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              learnersTrained: data,
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

  /**Schedules count this month */
  public fetchSchedulesCountThisMonth = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    const { trainerId } = req.query;
    try {
      const data =
        await this.batchesTrainerMetricsService.fetchSchedulesCountThisMonth(
          Number(trainerId)
        );

      (message = 'schedules this month for trainer'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              trainerSchedules: data,
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
export default BatchesTrainerMetricsController;
