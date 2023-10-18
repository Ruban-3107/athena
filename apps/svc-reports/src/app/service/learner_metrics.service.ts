import axios from 'axios';
import {
  BATCHES_SERVICE_PORT, COURSES_SERVICE_PORT, HOST_IP, USERS_SERVICE_PORT, COURSES_SERVICE_URL, USERS_SERVICE_URL,
  BATCHES_SERVICE_URL, } from '../config';

class LearnerMetricsService {
  ////////////////////////////////////Continue Learning/////////////////////////////////////
  /**Fetch learner's courses/tracks to be continued*/
  public fetchContinueLearning = async (userId: number, limit = 5) => {
    try {
      // Fetch course summary data for the user
      const courseSummaryData = await this.fetchCourseSummaryData(userId);

      // Extract track ids from the course summary data
      const trackIds = this.getTrackIdsFromSummaryData(courseSummaryData);

      // Fetch learner continue tracks based on the extracted track ids
      const learnerContinueTracks = await this.fetchLearnerContinueTracks(
        trackIds,
        limit
      );

      // Combine the course summary data and learner continue tracks into the final array
      const finalArray = this.percentageCompletionData(
        courseSummaryData,
        learnerContinueTracks
      );

      console.log('\n******))()\n', finalArray);
      return finalArray;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
      } else {
        console.error('An error occurred:', error.message);
      }
      return {
        error:
          error.code === 'ECONNREFUSED'
            ? 'Connection refused, server not running. Using fallback values'
            : error.message,
      };
    }
  };

  /**Fetch from user_tracks table as course_summary_data*/
  private fetchCourseSummaryData = async (userId: number, limit = 5) => {
    // Make an HTTP request to fetch course summary data for the user
    const response = await axios.get(
      `${BATCHES_SERVICE_URL}:${BATCHES_SERVICE_PORT}/api/batches/learnermetrics/userTracks`,
      { params: { userId, limit } }
    );
    return response.data.body.value.courseSummaryData;
  };

  /**Fetch all the Ids from courseSummaryData JSON*/
  private getTrackIdsFromSummaryData = (courseSummaryData: any[]) => {
    // Extract the track ids from the course summary data
    return courseSummaryData.map((track) => track.track_id);
  };

  /**Fetch the learner's tracks to be continued*/
  private fetchLearnerContinueTracks = async (
    trackIds: number[],
    limit: number
  ) => {
    // Make an HTTP request to fetch learner continue tracks based on the track ids
    const response = await axios.get(
      `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}/api/courses/learnermetrics/learnerContinueLearning`,
      { params: { trackIds: trackIds.join(','), limit } }
    );
    return response.data.body.value.learnerContinueTracks;
  };

  /**Combine tracks nested json with user_tracks and calculate learning progress % of the specific learner*/
  private percentageCompletionData = (
    courseSummaryData: any[],
    learnerContinueTracks: any[]
  ) => {
    // Combine the course summary data and learner continue tracks into the final array
    return courseSummaryData.map((summary) => {
      const matchingTrack = learnerContinueTracks.find(
        (track) => track.id === summary.track_id
      );

      return {
        track_id: summary.track_id,
        title: matchingTrack?.title || null,
        image_url: matchingTrack?.image_url || null,
        category: summary.category,
        totalChapters: summary.totalChapters,
        totalTopics: summary.totalTopics,
        completedPercentage: summary.completedPercentage,
      };
    });
  };

  ////////////////////////////////////Continue Learning/////////////////////////////////////
  ////////////////////////////////////UpcomingSessions///////////////////////////////////////
  /**Upcoming sessions for the learner*/
  public fetchUpcomingSessions = async (userId: number, limit = 5) => {
    try {
      const upcomingSessionsSchedules =
        await this.fetchUpcomingSessionsSchedules(userId, limit);

      /**Ids of tracks*/
      const trackIds = this.getIdsFromSchedules(
        upcomingSessionsSchedules,
        'trackId'
      );
      /**Ids of chapters*/
      const chapterIds = this.getIdsFromSchedules(
        upcomingSessionsSchedules,
        'chapterId'
      );
      /**Ids of topics*/
      const topicIds = this.getIdsFromSchedules(
        upcomingSessionsSchedules,
        'topicId'
      );

      console.log('trackIds', trackIds);
      console.log('chapterIds', chapterIds);
      console.log('topicIds', topicIds);

      /**Ids of trainers*/
      const trainerIds = this.getIdsFromSchedules(
        upcomingSessionsSchedules,
        'trainerId'
      );

      console.log('trainerIds', trainerIds);

      const upcomingSessionsCourses = await this.fetchUpcomingSessionsCourses(
        trackIds,
        chapterIds,
        topicIds,
        limit
      );

      const upcomingSessionTrainer = await this.fetchUpcomingSessionTrainer(
        trainerIds
      );

      /**Final array that combines the data from all the different endpoints*/
      const finalArray = upcomingSessionsSchedules.map((schedule) => {
        const matchingChapter = upcomingSessionsCourses.find(
          (chapter) => chapter.chapterId === schedule.chapterId
        );
        const matchingTopic = upcomingSessionsCourses.find(
          (topic) => topic.topicId === schedule.topicId
        );
        const matchingTrainer = upcomingSessionTrainer.find(
          (trainer) => trainer.id === schedule.trainerId
        );

        return {
          startTime: schedule?.startTime,
          endTime: schedule?.endTime,
          time: `From ${schedule?.startTime} to ${schedule?.endTime}`,
          startDate: schedule?.startDate,
          title: matchingChapter?.chapterName || null,
          subtitle: matchingTopic?.topicName || null,
          trainerName: matchingTrainer?.trainerName || null,
          imageUrl: matchingTrainer?.imageUrl || null,
        };
      });

      return finalArray;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error(
          'Connection refused. The server is not running or not accessible.'
        );
      } else {
        console.error('An error occurred:', error.message);
      }
      return {
        error:
          error.code === 'ECONNREFUSED'
            ? 'Connection refused, server not running. Using fallback values'
            : error.message,
      };
    }
  };

  /** Fetches upcoming sessions schedules */
  private fetchUpcomingSessionsSchedules = async (
    userId: number,
    limit = 5
  ): Promise<any> => {
    const response = await axios.get(
      `${BATCHES_SERVICE_URL}:${BATCHES_SERVICE_PORT}/api/batches/learnermetrics/upcomingSessions`,
      { params: { userId, limit } }
    );

    return response.data.body.value.upcomingSessionsSchedules;
  };

  /** Extracts specific IDs from the schedules array */
  private getIdsFromSchedules = (schedules: any[], key: string) => {
    return schedules.map((schedule) => schedule[key]);
  };

  /** Fetches upcoming sessions courses */
  private fetchUpcomingSessionsCourses = async (
    trackIds: number[],
    chapterIds: number[],
    topicIds: number[],
    limit: number
  ) => {
    const response = await axios.get(
      `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}/api/courses/learnermetrics/upcomingSessions`,
      {
        params: {
          trackIds: trackIds.join(','),
          chapterIds: chapterIds.join(','),
          topicIds: topicIds.join(','),
          limit,
        },
      }
    );

    return response.data.body.value.upcomingSessionsCourses;
  };

  /** Fetches upcoming session trainers */
  private fetchUpcomingSessionTrainer = async (trainerIds: number[]) => {
    const response = await axios.get(
      `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}/api/users/learnermetrics/upcomingSessions`,
      {
        params: {
          userIds: trainerIds.join(','),
        },
      }
    );

    return response.data.body.value.upcomingSessionTrainer;
  };
  ////////////////////////////////////UpcomingSessions///////////////////////////////////////

  ////////////////////////////////////CompletedCourses///////////////////////////////////////
  public fetchCompletedCourses = async (userId: number, limit = 5) => {
    const {
      data: {
        body: {
          value: { completedCoursesfromUserTracks },
        },
      },
    } = await axios.get(
      `${BATCHES_SERVICE_URL}:${BATCHES_SERVICE_PORT}/api/batches/learnermetrics/completedCourses`,
      { params: { userId, limit } }
    );
    return completedCoursesfromUserTracks;
  };
  ////////////////////////////////////CompletedCourses///////////////////////////////////////
}
export default LearnerMetricsService;