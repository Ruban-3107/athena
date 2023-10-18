import { Request, Response } from 'express';
import UserLearnerMetricsService from '../service/users_learner_metrics.service';
import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';

class UsersLearnerMetricsController {
  protected userLearnerMetricsService = new UserLearnerMetricsService();

  /**users graph data*/
  public fetchUpcomingSessionTrainer = async (req: Request, res: Response) => {
    let response: object;
    let message: string;

    try {
      const { userIds } = req.query;

      const userIdsArray: number[] = (userIds as string)
        .split(',')
        .map((id) => Number(id.trim()));

      console.log('before', userIds);
      console.log(
        'after',
        (userIds as string).split(',').map((id) => Number(id.trim()))
      );

      const data =
        await this.userLearnerMetricsService.fetchUpcomingSessionTrainer(
          userIdsArray
        );
      (message = 'upcoming session trainer data'),
        (response = responseCF(
          bodyCF({
            code: 600,
            val: {
              upcomingSessionTrainer: data,
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

export default UsersLearnerMetricsController;
