import DB from '../database';

import { literal, fn, col, Op } from 'sequelize';

import {
  UserChart,
  RecentActivities,
  NeedAttention,
} from '../interface/users_admin_metrics.interface';
import {
  getDateArray,
  getDateRange,
  getDaysObject,
  getInterval,
  mapModelDatatoGraphData,
  nFormatter,
} from '@athena/shared/common-functions';
import { mapUsersToGraphData } from '../util/util';
import moment from 'moment';

class UserAdminMetricsService {
  public users = DB.DBmodels.users;
  ////////////////////////////////////////////////////////TopTabs////////////////////////////////////////////////////////////////////
  /**To fetch total users count */
  public fetchTotalUsersCount = async (): Promise<object> => {
    const usersCount = await this.users.count({
      where: {
        deleted_at: null,
      },
    });
    return { type: 'Total Users', count: usersCount.toString() };
  };
  ////////////////////////////////////////////////////////TopTabs////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////Performace Chart////////////////////////////////////////////////////////////
  /**Performance chart users data*/
  public fetchUsersGraph = async (dateRange = 'week') => {
    const currentDate = new Date();
    const { fromDate, today } = getDateRange(dateRange, currentDate);
    const dateArray = getDateArray(fromDate, today);

    const users = await this.getUsersQuery(
      {
        is_active: 'active',
        deleted_at: null,
        created_at: {
          [Op.between]: [fromDate, today],
        },
      },
      null,
      [],
      [],
      null,
      {
        attributes: [
          [
            fn(`DATE_TRUNC`, getInterval(dateRange), col(`created_at`)),
            `truncLevel`,
          ],
          [fn(`COUNT`, `*`), `total_count`],
        ],
        group: `truncLevel`,
      }
    );

    const activeUsers = mapModelDatatoGraphData(dateArray, users, today);
    return mapUsersToGraphData(
      activeUsers,
      dateRange,
      today
    ).flat() as UserChart;
  };
  ////////////////////////////////////////////////////////Performace Chart////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////Need Attention////////////////////////////////////////////////////////////
  /**Users need attention data*/
  public fetchNeedUsersAttentionData = async (limit = 5) => {
    const adminNeedAttention: Array<NeedAttention> = [];

    adminNeedAttention.push(await this.fetchPendingApprovalUsers(limit));

    //all need attention data will be in ascending order of timestamps
    return adminNeedAttention.flat().sort((a, b) => a.createdAt - b.createdAt);
  };

  /**Pending approval users*/
  private async fetchPendingApprovalUsers(limit = 5): Promise<any> {
    const where: object = {
      created_at: {
        [Op.lt]: moment().subtract(3, 'days').toDate(),
      },
      deleted_at: null,
      is_active: 'pending approval',
    };
    const order: string[][] = [['created_at', 'ASC']];

    const attributes: unknown = [
      'first_name',
      'created_at',
      [
        literal(`EXTRACT(EPOCH FROM AGE(CURRENT_DATE, created_at)) / 86400`),
        'duration_days',
      ],
    ];

    const options: object = {
      where,
      order,
      attributes,
      limit,
    };

    const users = await this.users.findAll(options);
    // return users;
    const finalUsers = users?.map((x) => {
      const durationDays = nFormatter(Math.floor(x.dataValues.duration_days));
      return {
        name: x.dataValues.first_name,
        createdAt: x.dataValues.created_at,
        needAttentionSubtitle: `User ${x.first_name} is pending for approval for the past ${durationDays} days`,
      };
    });

    return finalUsers;
  }
  ///////////////////////////////////////////////////////Need Attention////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////Recent Activities////////////////////////////////////////////////////////////
  public fetchUsersRecentActivitiesData = async (limit = 5) => {
    const userRecentActivities: Array<RecentActivities> = [];
    userRecentActivities.push(await this.fetchNewlyRegisteredUsers(limit));

    //all recent activities data will be in desccending order of timestamps
    return userRecentActivities

      .flat()
      .sort((a, b) => b.createdAt - a.createdAt);
  };
  /**Fetch recently registered users*/
  private async fetchNewlyRegisteredUsers(limit = 5): Promise<any> {
    /**fetching stuff that happened 3 days ago*/
    const { fromDate } = getDaysObject(3);
    const where = {
      [Op.and]: [
        {
          createdAt: {
            [Op.gt]: fromDate,
          },
        },
        {
          deleted_at: {
            [Op.eq]: null,
          },
        },
      ],
    };

    // const attributes = ['users_type', 'email', 'created_by'];
    const users = await this.users.findAll({
      where: { ...where },
      limit,
      attributes: ['users_type', 'email', 'created_by', 'created_at'],
    });

    const newlyAddedUsers = users.map(
      ({ dataValues: { created_at, email, users_type } }) => {
        return {
          title: 'New User registered',
          createdAt: created_at,
          recentActivitySubtitle: `New ${users_type.toLowerCase()} user registered under email '${email}' at ${moment(
            created_at
          ).format('DD MMM YYYY')}`,
        };
      }
    );

    console.log('SDSDSD', users);
    return newlyAddedUsers;
  }

  ///////////////////////////////////////////////////////Recent Activities////////////////////////////////////////////////////////////
  /////////////////////////////Model query functions/////////////////////////////
  private async getUsersQuery(
    where: object,
    limit: number = null,
    orderBy: string[] = [],
    groupBy: string[] = [],
    userAttributes: string[] = null,
    options: any = {}
  ): Promise<any> {
    const queryOptions: any = { where };
    if (orderBy.length) {
      queryOptions.order = orderBy;
    }
    if (groupBy.length) {
      queryOptions.group = groupBy;
    }
    if (userAttributes) {
      queryOptions.attributes = userAttributes;
    }
    if (limit) {
      queryOptions.limit = limit;
    }
    const mergedOptions = Object.assign(queryOptions, options);
    return await this.users.findAll(mergedOptions);
  }
  /////////////////////////////Model query functions/////////////////////////////
}

export default UserAdminMetricsService;
