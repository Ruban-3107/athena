import { Request, Response } from 'express';
import TrainerMetricsService from '../service/trainer_metrics.service';
import { bodyCF, responseCF } from 'libs/commonResponse/commonResponse';

class TrainerMetricsController {
  protected trainerMetricsService = new TrainerMetricsService();

  /**Continue Learning Courses/Tracks*/
  public trainerTopTabsData = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    const { trainerId } = req.query;
    try {
      const data = await this.trainerMetricsService.trainerTopTabsData(
        Number(trainerId)
      );

      message = 'Trainer top tabs data';

      response = responseCF(
        bodyCF({
          code: 600,
          val: { trainerTopTabsData: data },
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

  /**Content Analytics*/
  public fetchContentAnalytics = async (req: Request, res: Response) => {
    let response: object;
    let message: string;
    const { createdBy, type } = req.query;
    try {
      const data = await this.trainerMetricsService.fetchContentAnalytics(
        Number(createdBy),
        String(type)
      );

      message = 'Content analytics data';

      response = responseCF(
        bodyCF({
          code: 600,
          val: { contentAnalyticsData: data },
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
}
export default TrainerMetricsController;
