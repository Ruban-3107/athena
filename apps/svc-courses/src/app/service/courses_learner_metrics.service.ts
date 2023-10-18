import { Op, Sequelize } from 'sequelize';
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

class CourseLearnerMetricsService {
  public tracks = DB.DBmodels.tracks;
  public chapters = DB.DBmodels.chapters;
  public topics = DB.DBmodels.topics;
  ////////////Learner's Courses with progress %////////////////////////////////////////////////////////////////////
  public fetchContinueLearningTracks = async (
    trackIds: number[],
    limit = 5
  ) => {
    //where clause//
    const where = {
      id: {
        [Op.in]: trackIds,
      },
    };
    const continueLearningTracks = await this.tracks.findAll({
      attributes: ['id', 'title', 'image_url'],
      include: [
        {
          model: this.tracks,
          as: 'children',
          attributes: ['title'],
        },
      ],
      where: {
        ...where,
      },
      limit,
    });

    return continueLearningTracks.map((x) => {
      const { id, title, image_url } = x.dataValues;

      return { id, title, image_url, ...x.dataValues };
    });
  };

  ////////////Learner's Courses with progress %////////////////////////////////////////////////////////////////////
  ////////////upcoming sessions////////////////////////////////////////////////////////////////////
  public fetchUpcomingSessionsTracks = async (
    trackIds: number[],
    chapterIds: number[],
    topicIds: number[],
    limit = 5
  ) => {
    //where clause trackId array//
    const trackIdArray = {
      id: {
        [Op.in]: trackIds,
      },
    };
    //where clause chapterId array//
    const chapterIdArray = {
      id: {
        [Op.in]: chapterIds,
      },
    };

    //where clause topicId array//
    const topicIdArray = {
      id: {
        [Op.in]: topicIds,
      },
    };

    const upcomingSessionsTracks = await this.tracks.findAll({
      where: { ...trackIdArray },
      attributes: ['id', 'title', 'image_url'],
      include: [
        {
          model: this.chapters,
          as: 'track_chapters',
          attributes: ['id', 'title'],
          where: { ...chapterIdArray },
          include: [
            {
              model: this.topics,
              as: 'chapter_topics',
              attributes: ['id', 'title'],
              where: { ...topicIdArray },
            },
          ],
        },
        {
          model: this.tracks,
          as: 'children',
          attributes: ['title'],
          include: [
            {
              model: this.chapters,
              as: 'track_chapters',
              attributes: ['id', 'title'],
              //where: { ...chapterIdArray },
              include: [
                {
                  model: this.topics,
                  as: 'chapter_topics',
                  attributes: ['id', 'title'],
                  // where: { ...topicIdArray },
                },
              ],
            },
          ],
        },
      ],
      limit,
    });

    return upcomingSessionsTracks.map((x) => {
      const chapterName = x.dataValues.track_chapters[0].title;
      const chapterId = x.dataValues.track_chapters[0].id;
      const topicName = x.dataValues.track_chapters[0].chapter_topics[0].title;
      const topicId = x.dataValues.track_chapters[0].chapter_topics[0].id;

      return {
        //...x.dataValues,
        chapterId,
        chapterName,
        topicId,
        topicName,
      };
    });
  };
  ////////////upcoming sessions////////////////////////////////////////////////////////////////////

  /////////////////////Fetch matching tracks with array of Ids///////////////////////////////////////////////////////////

  public fetchCompletedCoursesOrTracksfromTracks = async (
    courseOrtrackIds: number[],
    limit = 5
  ) => {
    const where = {
      id: {
        [Op.in]: courseOrtrackIds,
      },
    };

    const completed = await this.tracks.findAll({
      where: { ...where },
      attributes: ['title'],
      limit,
    });

    return completed;
  };
  /////////////////////Fetch matching tracks with array of Ids///////////////////////////////////////////////////////////
}
export default CourseLearnerMetricsService;
