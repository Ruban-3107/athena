////Only for dashboard related data////////////////////////////////////////////////////////////////
import moment from 'moment';
import DB from '../database';
import { getDaysObject } from '@athena/shared/common-functions';
import { Op, QueryTypes, col, fn, literal, where } from 'sequelize';

class BatchAdminMetricsService {
  public batches = DB.DBmodels.batches;

  ////////////////////////////////////////////////////////TopTabs////////////////////////////////////////////////////////////////////
  /**total batches count query*/
  public fetchTotalBatchesCount = async () => {
    const batchesCount = await this.batches.count({
      where: {[Op.and] :[
        { status :'Ongoing'},
        { deleted_at: null }

      ]} ,
    });

    return {
      type: 'Batches',
      count: batchesCount.toString(),
    };
  };
  ////////////////////////////////////////////////////////TopTabs////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////Need Attention////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////Need Attention////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////Recent Activities////////////////////////////////////////////////////////////////////
  public fetchBatchesRecentActivitiesData = async (limit = 5) => {
    const batchRecentActivities: Array<any> = [];
    batchRecentActivities.push(await this.fetchNewlyCreatedBatches(limit));
    batchRecentActivities.push(await this.fetchNewlyStartedBatches(limit));

    //all recent activities data will be in desccending order of timestamps
    return batchRecentActivities
      .flat()
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  /**newly created batches*/
  private async fetchNewlyCreatedBatches(limit = 5): Promise<any> {
    const { fromDate } = getDaysObject(3);
    const where = {
      [Op.and]: [
        {
          deleted_at: {
            [Op.eq]: null,
          },
        },
        {
          created_at: {
            [Op.gt]: fromDate,
          },
        },
      ],
    };

    const batches = await this.batches.findAll({
      where: { ...where },
      limit,
      attributes: ['name', 'created_at'],
    });

    const newlyAddedBatches = batches.map((batch: any) => {
      return {
        title: `New Batch created`,
        batchName: batch.dataValues.name,
        createdAt: batch.dataValues.created_at,
        recentActivitySubtitle: `New '${
          batch.dataValues.name
        }' batch created at ${moment(batch.dataValues.created_at).format(
          'DD MMM YYYY'
        )}`,
      };
    });

    return newlyAddedBatches;
  }

  /**newly started batches*/
  private async fetchNewlyStartedBatches(limit = 5): Promise<any> {
    return [
      {
        title: 'Batch 1 commenced',
        batchName: 'Batch 1',
        createdAt: new Date('2023-03-22T08:45:08.927Z'),
        recentActivitySubtitle: `Batch 1 commenced at ${moment(
          new Date('2023-03-22T08:45:08.927Z')
        ).format('hh:mm A')}`,
      },
      {
        title: 'Batch 2 commenced',
        batchName: 'Batch 2',
        createdAt: new Date('2023-05-04T11:38:08.927Z'),
        recentActivitySubtitle: `Batch 2 commenced at ${moment(
          new Date('2023-05-04T11:38:08.927Z')
        ).format('hh:mm A')}`,
      },
      {
        title: 'Batch 3 commenced',
        batchName: 'Batch 3',
        createdAt: new Date('2021-03-04T14:30:08.927Z'),
        recentActivitySubtitle: `Batch 3 commenced at ${moment(
          new Date('2021-03-04T14:30:08.927Z')
        ).format('hh:mm A')}`,
      },
    ];
  }
  //////////////////////////////////////////////////Recent Activities////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////Pie Chart//////////////////////////////////////////////////////
  public fetchGroupedBatches = async (dateRange = 'week') => {
    const { sequelize } = this.batches;

    const batchesStatusValues: (
      | 'Upcoming'
      | 'Ongoing'
      | 'On Hold'
      | 'Completed'
    )[] = ['Upcoming', 'Ongoing', 'On Hold', 'Completed'];

    const query = `
      SELECT COUNT(*) AS count, status
      FROM batches
      WHERE date_trunc(:dateRange, updated_at) = date_trunc(:dateRange, current_date)
      GROUP BY status;
    `;

    const result: any[] = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { dateRange },
    });

    const resultMap: { [status: string]: number } = {};

    //Initialize the resultMap with all status values set to 0
    batchesStatusValues.forEach((status) => {
      resultMap[status] = 0;
    });

    //Update the resultMap with the count values from the result
    result.forEach(({ status, count }) => {
      resultMap[status] = parseInt(count, 10);
    });

    //Convert the resultMap to an array of objects
    const finalResult: any[] = Object.entries(resultMap).map(
      ([status, count]) => ({ status, count, pieChartType: 'Batch' })
    );

    return finalResult;
  };
  /////////////////////////////////////////////Pie Chart//////////////////////////////////////////////////////
}
export default BatchAdminMetricsService;
