////Only for dashboard related data////////////////////////////////////////////////////////////////
import moment from 'moment';
import DB from '../database';
import { literal, fn } from 'sequelize';

class BatchTrainerMetricsService {
  public userTracks = DB.DBmodels.user_tracks;
  public schedules = DB.DBmodels.schedules;

  /**Trainer's total hours taught from schedules table*/
  public fetchTotalHoursTrained = async (trainerId: number) => {
    const where = { trainer_id: trainerId, status: 'completed' };
    const result = await this.schedules.findOne({
      attributes: [
        [
          fn(
            'coalesce',
            fn(
              'sum',
              literal('extract(epoch from ("end_at" - "start_at") / 3600)')
            ),
            0
          ),
          'hoursTrained',
        ],
      ],
      where: {
        ...where,
      },
    });

    console.log('LLL', result);

    return Number(result.getDataValue('hoursTrained')).toLocaleString('en-US');
  };

  /**learners trained under trainerId*/
  public fetchLearnersTrained = async (trainerId: number) => {
    const where = { trainer_id: trainerId, status: 'completed' };
    const result = await this.schedules.count({
      distinct: true,
      col: 'learner_id',
      where: {
        ...where,
      },
    });

    return Number(result).toLocaleString('en-US');
  };

  /**Schedules count for this month*/
  public fetchSchedulesCountThisMonth = async (trainerId: number) => {
    if (!trainerId) return;

    const currentDate = new Date();

    const schedulesThisMonth = await this.schedules.count({
      where: {
        // start_at: {
        //   [Op.eq]: [
        //     literal(`date_trunc('month', start_at)`),
        //     literal(`date_trunc('month', current_date)`),
        //   ],
        // },
        trainer_id: trainerId,
      },
    });
    return Number(schedulesThisMonth).toLocaleString('en-IN');
  };
}

export default BatchTrainerMetricsService;
