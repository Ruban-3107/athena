import { Op, Sequelize, fn } from 'sequelize';
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

class CoursesTrainerMetricsService {
  public tracks = DB.DBmodels.tracks;
  public chapters = DB.DBmodels.chapters;
  public topics = DB.DBmodels.topics;
  /**Trainer topics created*/
  public fetchTopicsCreated = async (trainerId: number) => {
    if (!trainerId) return;
    const where = { created_by: trainerId };
    const topicsCreated = await this.topics.count({
      distinct: true,
      col: 'id',
      where: { ...where },
    });

    return Number(topicsCreated).toLocaleString('en-IN');
  };

  ///////////////////////Content Analytics////////////////////////////////////////
  public fetchContentAnalytics = async (createdBy: number, type: string) => {
    const contentAnalytics: Array<
      | {
          status: string;
          count: number;
        }
      | { error?: string }
    > = [];

    if (type !== 'Tracks' && type !== 'Chapters' && type !== 'Topics') {
      contentAnalytics.push({ error: 'Invalid/No type provided' });
    }

    if (type == 'Tracks') {
      contentAnalytics.push(await this.fetchGroupedTracks(createdBy));
    }
    if (type == 'Chapters') {
      contentAnalytics.push(await this.fetchGroupedChapters(createdBy));
    }
    if (type == 'Topics') {
      contentAnalytics.push(await this.fetchGroupedTopics(createdBy));
    }

    return contentAnalytics.flat();
  };

  /**Grouped Tracks*/
  private async fetchGroupedTracks(createdBy: number): Promise<any> {
    const where = {
      created_by: createdBy,
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

    const result: any[] = await this.tracks.findAll({
      attributes: ['status', [fn('COUNT', 'status'), 'count']],
      where: { ...where },
      group: ['status'],
      raw: true,
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
      ([status, count]) => ({ status, count })
    );

    return finalResult;
  }

  /**Grouped Chapters*/
  private async fetchGroupedChapters(createdBy: number): Promise<any> {
    const where = {
      created_by: createdBy,
    };

    const chapterStatusValues: (
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

    const result: any[] = await this.chapters.findAll({
      attributes: ['status', [fn('COUNT', 'status'), 'count']],
      where: { ...where },
      group: ['status'],
      raw: true,
    });

    const resultMap: { [status: string]: number } = {};

    // Initialize the resultMap with all status values set to 0
    chapterStatusValues.forEach((status) => {
      resultMap[status] = 0;
    });

    // Update the resultMap with the count values from the result
    result.forEach(({ status, count }) => {
      resultMap[status] = parseInt(count, 10);
    });

    // Convert the resultMap to an array of objects
    const finalResult: any[] = Object.entries(resultMap).map(
      ([status, count]) => ({ status, count })
    );

    return finalResult;
  }

  /**Grouped Topics*/
  private async fetchGroupedTopics(createdBy: number): Promise<any> {
    const where = {
      created_by: createdBy,
    };

    const topicStatusValues: (
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

    const result: any[] = await this.topics.findAll({
      attributes: ['status', [fn('COUNT', 'status'), 'count']],
      where: { ...where },
      group: ['status'],
      raw: true,
    });

    const resultMap: { [status: string]: number } = {};

    // Initialize the resultMap with all status values set to 0
    topicStatusValues.forEach((status) => {
      resultMap[status] = 0;
    });

    // Update the resultMap with the count values from the result
    result.forEach(({ status, count }) => {
      resultMap[status] = parseInt(count, 10);
    });

    // Convert the resultMap to an array of objects
    const finalResult: any[] = Object.entries(resultMap).map(
      ([status, count]) => ({ status, count })
    );

    return finalResult;
  }
  ///////////////////////Content Analytics////////////////////////////////////////

  //////////////////////Trainer Courses Card////////////////
  public async e() {
    return;
  }
  //////////////////////Trainer Courses Card////////////////
}
export default CoursesTrainerMetricsService;
