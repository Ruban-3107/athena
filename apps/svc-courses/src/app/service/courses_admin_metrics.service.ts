import { Op, QueryTypes, Sequelize, col, fn, literal, where } from 'sequelize';
import DB from '../database';
import {
  CourseChart,
  NeedAttention,
  RecentActivities,
} from '../interface/courses_admin_metrics.interface';
import moment from 'moment';
import {
  getDateArray,
  getDateRange,
  getInterval,
  mapModelDatatoGraphData,
  nFormatter,
} from '@athena/shared/common-functions';
import { mapCoursesToGraphData } from '../util/util';

class CourseAdminMetricsService {
  public tracks = DB.DBmodels.tracks;
  public chapters = DB.DBmodels.chapters;
  public topics = DB.DBmodels.topics;

  ////////////////////////////////////////////////////////TopTabs////////////////////////////////////////////////////////////////////
  /**the courses tabs data will be shown here */
  public topTabsData = async () => {
    const tabs: any[] = [];
    tabs.push(await this.fetchTotalCoursesCount());
    tabs.push(await this.fetchTotalPendingApprovalCoursesCount());
    return tabs.flat();
  };
  /**To fetch total tracks count */
  public fetchTotalCoursesCount = async () => {
    const tracksCount = await this.tracks.count({
      where: { deleted_at: null },
    });

    return {
      type: 'Courses',
      count: tracksCount.toString(),
    };
  };

  /**To fetch total pending approval count*/
  public fetchTotalPendingApprovalCoursesCount = async () => {
    const tracksCount: number = await this.tracks.count({
      where: {
        deleted_at: null,
        status: 'Pending Approval',
      },
    });
    const chaptersCount: number = await this.chapters.count({
      where: {
        deleted_at: null,
        status: 'Pending Approval',
      },
    });
    const topicsCount: number = await this.topics.count({
      where: {
        deleted_at: null,
        status: 'Pending Approval',
      },
    });

    const totalPendingCount = tracksCount + chaptersCount + topicsCount;
    return {
      type: 'Pending Approval Courses',
      count: totalPendingCount.toString(),
    };
  };

  ////////////////////////////////////////////////////////TopTabs////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////Performace Chart////////////////////////////////////////////////////////////
  /**Performance chart courses data*/
  public fetchCoursesGraph = async (dateRange = 'week') => {
    const userPerformanceChartData: Array<CourseChart> = [];

    userPerformanceChartData.push(await this.fetchGraphCourses(dateRange));

    return userPerformanceChartData.flat();
  };

  /**Courses graph data query*/
  private async fetchGraphCourses(dateRange = 'week'): Promise<any> {
    const currentDate = new Date();

    const { fromDate, today } = getDateRange(dateRange, currentDate);

    const dateArray = getDateArray(fromDate, today);

    const courses = await this.getCoursesQuery(
      {
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
            Sequelize.fn(
              `DATE_TRUNC`,
              getInterval(dateRange),
              Sequelize.col(`created_at`)
            ),
            `truncLevel`,
          ],
          [Sequelize.fn(`COUNT`, `*`), `total_count`],
        ],
        group: `truncLevel`,
      }
    );

    const finalCourses = mapModelDatatoGraphData(dateArray, courses, today);

    console.log(
      'KAAAAAA',
      mapCoursesToGraphData(finalCourses, dateRange, today) as CourseChart
    );
    return mapCoursesToGraphData(
      finalCourses,
      dateRange,
      today
    ).flat() as CourseChart;
  }

  ////////////////////////////////////////////////////////Performace Chart/////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////Need Attention////////////////////////////////////////////////////////////
  /**Need attention courses data*/
  public fetchNeedCoursesAttentionData = async (limit = 5) => {
    const adminNeedAttention: Array<NeedAttention> = [];

    adminNeedAttention.push(await this.fetchPendingApprovalTracks(limit));
    adminNeedAttention.push(await this.fetchPendingApprovalChapters(limit));
    adminNeedAttention.push(await this.fetchPendingApprovalTopics(limit));

    //all need attention data will be in ascending order of timestamps
    return adminNeedAttention.flat().sort((a, b) => a.createdAt - b.createdAt);
  };

  /**Fetch topics that were not approved since 3 days*/
  private async fetchPendingApprovalTopics(limit: number): Promise<any> {
    const where: object = {
      created_at: {
        [Op.lt]: moment().subtract(3, 'days').toDate(),
      },
      deleted_at: null,
      status: 'Pending Approval',
    };
    const order: string[][] = [['created_at', 'ASC']];

    const attributes: unknown = [
      'title',
      'created_at',
      [
        Sequelize.literal(
          `EXTRACT(EPOCH FROM AGE(CURRENT_DATE, created_at)) / 86400`
        ),
        'duration_days',
      ],
    ];

    const options: object = {
      where,
      order,
      attributes,
      limit,
    };

    const topics = await this.topics.findAll(options);
    // return tracks;
    const finalTopics = topics.map((x) => {
      const durationDays = nFormatter(Math.floor(x.dataValues.duration_days));
      return {
        title: x.dataValues.title,
        createdAt: x.dataValues.created_at,
        needAttentionSubtitle: `Topic ${x.title} is pending for approval for the past ${durationDays} days`,
      };
    });

    return finalTopics;
  }

  /**Fetch chapters that were not approved since 3 days*/
  private async fetchPendingApprovalChapters(limit: number): Promise<any> {
    const where: object = {
      created_at: {
        [Op.lt]: moment().subtract(3, 'days').toDate(),
      },
      deleted_at: null,
      status: 'Pending Approval',
    };
    const order: string[][] = [['created_at', 'ASC']];

    const attributes: unknown = [
      'title',
      'created_at',
      [
        Sequelize.literal(
          `EXTRACT(EPOCH FROM AGE(CURRENT_DATE, created_at)) / 86400`
        ),
        'duration_days',
      ],
    ];

    const options: object = {
      where,
      order,
      attributes,
      limit,
    };

    const chapters = await this.chapters.findAll(options);
    // return tracks;
    const finalChapters = chapters?.map((x) => {
      const durationDays = nFormatter(Math.floor(x.dataValues.duration_days));
      return {
        title: x.dataValues.title,
        createdAt: x.dataValues.created_at,
        needAttentionSubtitle: `Chapter ${x.title} is pending for approval for the past ${durationDays} days`,
      };
    });

    return finalChapters;
  }

  /**Fetch tracks that were not approved since 3 days*/
  private async fetchPendingApprovalTracks(limit: number): Promise<any> {
    const where: object = {
      created_at: {
        [Op.lt]: moment().subtract(3, 'days').toDate(),
      },
      deleted_at: null,
      status: 'Pending Approval',
    };
    const order: string[][] = [['created_at', 'ASC']];

    const attributes = [
      'title',
      'created_at',
      [
        Sequelize.literal(
          `EXTRACT(EPOCH FROM AGE(CURRENT_DATE, created_at)) / 86400`
        ),
        'duration_days',
      ],
    ];

    const options: object = {
      where,
      order,
      attributes,
      limit,
    };

    const tracks = await this.tracks.findAll(options);
    // return tracks;
    const finalTracks = tracks.map((x) => {
      const durationDays = nFormatter(Math.floor(x.dataValues.duration_days));
      return {
        title: x.dataValues.title,
        createdAt: x.dataValues.created_at,
        needAttentionSubtitle: `Course ${x.title} is pending for approval for the past ${durationDays} days`,
      };
    });

    return finalTracks;
  }
  /////////////////////////////Need Attention///////////////////////////////////////
  /////////////////////////////Recent Activites///////////////////////////////////////
  /////////////////////////////Recent Activites///////////////////////////////////////
  /////////////////////////////Tracks pie chart///////////////////////////////////////
  public fetchGroupedTracks = async (dateRange = 'week') => {
    const { sequelize } = this.tracks;

    const where = {
      deleted_at: null,
    };

    const trackStatusValues: (
      | 'Published'
      | 'Pending Approval'
      | 'In Draft'
      | 'Review In Progress'
      | 'Approved'
      | 'Rejected'
    )[] = [
      'Published',
      'Pending Approval',
      'In Draft',
      'Review In Progress',
      'Approved',
      'Rejected',
    ];

    const query = `
      SELECT COUNT(*) AS count, status
      FROM tracks
      WHERE date_trunc(:dateRange, updated_at) = date_trunc(:dateRange, current_date)
      GROUP BY status;
    `;

    const result: any[] = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { dateRange },
    });

    const resultMap: { [status: string]: number } = {};

    // Initialize the resultMap with all status values set to 0
    trackStatusValues.forEach((status) => {
      resultMap[status] = 0;
    });

    // Update the resultMap with the count values from the result
    result.forEach(({ status, count }) => {
      resultMap[status] = parseInt(count, 10);
    });

    // Convert the resultMap to an array of objects
    const finalResult: any[] = Object.entries(resultMap).map(
      ([status, count]) => ({ status, count, pieChartType: 'Course' })
    );

    return finalResult;
  };
  /////////////////////////////Tracks pie chart///////////////////////////////////////

  /////////////////////////////Model query functions/////////////////////////////
  private async getCoursesQuery(
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
    return await this.tracks.findAll(mergedOptions);
  }
  /////////////////////////////Model query functions/////////////////////////////
}
export default CourseAdminMetricsService;
