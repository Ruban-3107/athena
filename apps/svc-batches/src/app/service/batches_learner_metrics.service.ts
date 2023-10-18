////Only for dashboard related data////////////////////////////////////////////////////////////////
import moment from 'moment';
import DB from '../database';
import { calculateLearningProgress } from '@athena/shared/common-functions';

class BatchLearnerMetricsService {
  public userTracks = DB.DBmodels.user_tracks;
  public schedules = DB.DBmodels.schedules;

  /**user tracks, courseSummaryData query continue learning*/
  public fetchLearnerCourseSummaryData = async (userId: number, limit = 5) => {
    const where = { user_id: userId };

    const userTracks = await this.userTracks.findAll({
      attributes: ['user_id', 'track_id', 'course_summary_data'],
      where,
      limit,
    });


    return userTracks.map((x) => {
      const { id, user_id, track_id, course_summary_data } = x.dataValues;
      const courseSummaryData = JSON.parse(course_summary_data);
      const { children, chapters } = courseSummaryData;
      console.log('children', children);
      console.log('\n****************\nchapters', chapters);

      if (children && children.length > 0) {
        return {
          //id,
          //user_id,
          track_id,

          ...calculateLearningProgress(children, 'Track'),
        };
      } else if (chapters && chapters.length > 0) {
        return {
          //id,
          //user_id,
          track_id,
          ...calculateLearningProgress(chapters, 'Course'),
        };
      }

      // return {
      //   id,
      //   user_id,
      //   track_id,
      //   course_summary: JSON.parse(course_summary_data),
      // };
    });
  };

  /**Upcoming sessions for the learner*/
  public fetchUpcomingSessionsfromSchedules = async (
    userId: number,
    limit = 5
  ) => {
    const where = { learner_id: userId };

    const userSchedules = await this.schedules.findAll({
      where: { ...where },
      attributes: [
        'start_at',
        'end_at',
        'trainer_id',
        'track_id',
        'chapter_id',
        'topic_id',
      ],
      limit,
    });

    return userSchedules.map((x) => {
      /**Convert date to dd/yy/yyyy*/
      const startDate = x.dataValues.start_at.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      //converting time to hh:mm AM/PM//
      const startTime =
        moment(x.dataValues.start_at).format('hh:mm A') || new Date();
      const endTime =
        moment(x.dataValues.end_at).format('hh:mm A') || new Date();

      //trainer id//
      const trainerId = x.dataValues.trainer_id;

      return {
        trainerId,
        startTime,
        endTime,
        startDate,
        trackId: x.dataValues.track_id,
        chapterId: x.dataValues.chapter_id,
        topicId: x.dataValues.topic_id,
      };
    });
  };

  /**Completed Courses */
  public fetchCompletedCourses = async (userId: number, limit = 5) => {
    const where = {
      user_id: userId,
    };

    const completedCourses = await this.userTracks.findAll({
      attributes: ['course_summary_data'],
      where: { ...where },
      limit,
    });

    const filteredCourses = completedCourses.filter((course) => {
      const courseSummaryData = course.getDataValue('course_summary_data');
      const parsedData = JSON.parse(courseSummaryData);
      //to be changed//
      return parsedData.status === 'pending';
    });

    const formattedCourses = filteredCourses.map((course) => {
      return {
        courseOrtrackId: JSON.parse(course.dataValues.course_summary_data).id,
        title: JSON.parse(course.dataValues.course_summary_data).slug,
      };
    });

    return formattedCourses;
  };
}
export default BatchLearnerMetricsService;
