import DB from '../database/index';
import { CreateScheduleDto } from '../dto/schedules.dto';
import { HttpException } from '@athena/shared/exceptions';
import { Schedules } from '../interface/schedules.interface';
import { sign, verify } from 'jsonwebtoken';
const dataStoredInToken = { token: 'notification-service' };
import {
  USERS_SERVICE_PORT,
  GET_USERS_ROUTE,
  USERS_SERVICE_URL,
  COURSES_SERVICE_URL,
  COURSES_SERVICE_PORT,
  GET_TOPICBYID,
  HOST_IP_FRONT,
  GET_TOKEN_BYID,
  SECRET_KEY,
} from '../config/index';
import moment from 'moment-timezone';
import { apiRequestHandler } from '@athena/shared/common-functions';
import { isEmpty } from '@athena/shared/common-functions';
import { MessageSchema } from '../util/messageSchema';
import { MessageQueue } from '../util/message.queue';

class ScheduleService {
  public schedules = DB.DBmodels.schedules;
  //   public topics = DB.DBmodels.topics;
  //   public courses = DB.DBmodels.courses;
  //   public chapters = DB.DBmodels.chapters;
  public batches = DB.DBmodels.batches;
  //   public users = DB.DBmodels.users;
  //   public tracks = DB.DBmodels.tracks;
  public userTracks = DB.DBmodels.user_tracks;

  public async findAllSchedule(
    token: any,
    user_id: any,
    role: any
  ): Promise<Schedules[]> {
    //getting all schedules for super admin for dashborad
    console.log('>>>>>>>>>>>>>>>>>>', user_id, role);
    let where = {};
    if (role === 'Trainer') {
      where = { trainer_id: user_id };
    } else if (role === 'Learner') {
      where = { learner_id: user_id };
    }
    const findSchedule: Schedules[] = await this.schedules.findAll({
      where: where,
    });

    console.log('findSchedule::::rt', findSchedule);

    if (!findSchedule) throw new HttpException(409, "Schedule doesn't exist");
    const uniqSchedule = []; // new array without duplicate
    const allScheduleIds = [];
    //filtering unique schedules based on trackid,chapterid,topicid,bathcid
    for (const item of findSchedule) {
      const isPresent = uniqSchedule.filter((elem) => {
        return (
          elem.track_id === item.track_id &&
          elem.chapter_id === item.chapter_id &&
          elem.topic_id === item.topic_id &&
          elem.batch_id === item.batch_id
        );
      });
      if (isPresent.length == 0) {
        //getting trainer details
        const trainerResponse = await apiRequestHandler(
          `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${GET_USERS_ROUTE}/getNeededUsers/byIds`,
          token,
          'POST',
          { users: [item.trainer_id] }
        );
        item['dataValues']['trainer'] = trainerResponse[0];
        // const usersResponse = await apiRequestHandler(
        //   `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${GET_USERS_ROUTE}/getNeededUsers/byIds`,
        //   token,
        //   'POST',
        //   { users: item.learner_id }
        // );
        // item['dataValues']['batch_learners'] = usersResponse;
        //finding user track for given batch_id and topic_id and from usertrack course summary data we will get course name and topic name
        const userTrackResponse = await this.userTracks.findOne({
          where: { track_id: item.track_id, batch_id: item.batch_id },
        });
        const course_summary_data = JSON.parse(
          userTrackResponse?.dataValues?.course_summary_data
        );

        let courseTitle, topicTitle;
        if (course_summary_data?.children?.length > 0) {
          const matchingCourse = course_summary_data?.children?.find(
            (course) => Number(course.id) === Number(item.track_id)
          );
          if (matchingCourse) {
            topicTitle = matchingCourse.slug;
            const matchingTopic = matchingCourse?.chapters
              ?.flatMap((chapter) => chapter.topics || [])
              .find((topic) => Number(topic.id) === Number(item.topic_id));
            if (matchingTopic) {
              topicTitle = matchingTopic.title;
            }
          }
        } else {
          const matchingTopic = course_summary_data['chapters']
            ?.flatMap((chapter) => {
              return chapter['topics'] || [];
            })
            .find((topic) => Number(topic.id) === Number(item.topic_id));
          if (matchingTopic) {
            topicTitle = matchingTopic.title;
          }
          courseTitle = course_summary_data?.slug;
        }
        item['dataValues']['courseTitle'] = courseTitle;
        item['dataValues']['topicTitle'] = topicTitle;
        uniqSchedule.push(item);
      }
    }
    return uniqSchedule;
  }

  public async findScheduleById(
    id: number,
    type: string,
    token: any
  ): Promise<Schedules[]> {
    try {
      console.log('jendaaaaaaaa');
      let where = {};
      if (type === 'batch') {
        where = { batch_id: id };
      } else if (type === 'trainer') {
        where = { trainer_id: id };
      } else if (type === 'learner') {
        where = { learner_id: id };
      } else {
        where = { unique_id: id };
      }
      if (isEmpty(id)) throw new HttpException(400, 'id is empty');

      // const findSchedule: Schedules[] = await this.schedules.findAll({
      //   where: where,
      //   include: 'schedule_batches',
      // });

      //finding schedule by learner_id or bathc_id or trainer_id
      const findSchedule: Schedules[] = await this.schedules.findAll({
        where: where,
        include: [
          {
            association: 'schedule_batches',
            attributes: ['id', 'name'],
            include: [
              {
                association: 'batchBatchLearners',
                attributes: ['user_id'],
              },
            ],
          },
        ],
      });

      if (!findSchedule) throw new HttpException(409, "Schedule doesn't exist");
      const uniqSchedule = []; // new array without duplicate
      const filteredSchedules = [];
      console.log('findSchedule:::', findSchedule);
      for (const item of findSchedule) {
        // loop through array which contain duplicate
        // if item is not found in uniqSchedule it will return empty array

        //filtering a unique schedule
        const isPresent = uniqSchedule.filter((elem) => {
          return (
            elem.track_id === item.track_id &&
            elem.chapter_id === item.chapter_id &&
            elem.topic_id === item.topic_id &&
            elem.batch_id === item.batch_id
          );
        });

        if (isPresent.length == 0) {
          //getting trainer details
          const trainerResponse = await apiRequestHandler(
            `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${GET_USERS_ROUTE}/getNeededUsers/byIds`,
            token,
            'POST',
            { users: [item.trainer_id] }
          );
          item['dataValues']['trainer'] = trainerResponse[0];
          //getting learnerids from associations of schedule and calling  get users service
          const leraner_id = item?.schedule_batches?.batchBatchLearners?.map(
            (x) => x?.user_id
          );
          const usersResponse = await apiRequestHandler(
            `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${GET_USERS_ROUTE}/getNeededUsers/byIds`,
            token,
            'POST',
            {
              users: leraner_id,
            }
          );
          console.log('usersResponse:', usersResponse);
          item['dataValues']['learner_id'] = leraner_id;
          item['dataValues']['batch_learners'] = usersResponse;
          console.log(
            'item.track_id, item.batch_id:',
            item.track_id,
            item.batch_id
          );
          //findout usertrack for course name and topic name
          const userTrackResponse = await this.userTracks.findOne({
            where: { track_id: item.track_id, batch_id: item.batch_id },
          });
          console.log('userTrackResponse:', userTrackResponse);
          const course_summary_data = JSON.parse(
            userTrackResponse?.dataValues?.course_summary_data
          );

          let courseTitle, topicTitle;
          if (course_summary_data?.children?.length > 0) {
            // course_summary_data?.children?.map((course) => {
            //   if (Number(course.id) === Number(item.track_id)) {
            //     course = course.title;
            //   }
            //   course?.chapters.map((chapter) => {
            //     chapter?.topics?.map((topic) => {
            //       if (Number(topic.id) === Number(item.topic_id)) {
            //         console.log(
            //           '#######################',
            //           topic,
            //           item,
            //           Number(topic.id),
            //           Number(item.topic_id)
            //         );
            //         topicTitle = topic.title;
            //       }
            //     });
            //   });
            // });
            const matchingCourse = course_summary_data?.children?.find(
              (course) => Number(course.id) === Number(item.track_id)
            );
            if (matchingCourse) {
              topicTitle = matchingCourse.slug;
              const matchingTopic = matchingCourse?.chapters
                ?.flatMap((chapter) => chapter.topics || [])
                .find((topic) => Number(topic.id) === Number(item.topic_id));
              if (matchingTopic) {
                topicTitle = matchingTopic.title;
              }
            }
          } else {
            const matchingTopic = course_summary_data['chapters']
              ?.flatMap((chapter) => {
                return chapter['topics'] || [];
              })
              .find((topic) => Number(topic.id) === Number(item.topic_id));
            if (matchingTopic) {
              topicTitle = matchingTopic.title;
            }
            courseTitle = course_summary_data?.slug;
          }
          item['dataValues']['courseTitle'] = courseTitle;
          item['dataValues']['topicTitle'] = topicTitle;

          uniqSchedule.push(item);
        }
      }
      return uniqSchedule;
    } catch (err) {
      console.log('eeeeeeeee', err);
    }
  }

  public async findScheduleByUnqId(
    id: string,
    token: any
  ): Promise<Schedules[]> {
    try {
      if (isEmpty(id)) throw new HttpException(400, 'id is empty');

      const findSchedule: Schedules[] = await this.schedules.findAll({
        where: { unique_id: id },
      });

      if (!findSchedule) throw new HttpException(409, "Schedule doesn't exist");

      return findSchedule;
    } catch (err) {
      console.log('eeeeeeeee', err);
    }
  }

  public async schedulerData(data: any) {
    console.log('data:', data);
  }

  public async createSchedule(
    scheduleData: CreateScheduleDto
  ): Promise<Schedules> {
    // Define the two dates with time
    console.log('entered');
    const start_time = new Date(scheduleData.start_at);
    const end_time = new Date(scheduleData.end_at);

    // Check the conditions

    if (start_time > end_time) {
      throw new HttpException(400, 'start time is greater than end time.');
    } else if (start_time.getDate() !== end_time.getDate()) {
      throw new HttpException(400, 'Both dates should be same.');
    }
    // else if (start_time.getDay() === 0 || start_time.getDay() === 6) {
    //   throw new HttpException(
    //     400,
    //     'Start day is a weekend (Saturday or Sunday).'
    //   );
    // } else if (start_time.getHours() < 9) {
    //   throw new HttpException(
    //     400,
    //     'Start time should be after 9 AM.'
    //   );
    // } else if (end_time.getHours() >= 19) {
    //   throw new HttpException(
    //     400,
    //     ' End time should be before 7 PM.'

    //   );
    // }
    else {
      //finding the schedule with given batch,track,topic
      const existingSchedule = await this.schedules.findOne({
        where: {
          batch_id: scheduleData.batch_id,
          topic_id: scheduleData.topic_id,
          track_id: scheduleData.track_id,
        },
      });
      //if any existing schedule with status cancelled is there, need to destroy the existing schedule and create new schedule with pending status
      if (existingSchedule?.dataValues?.status === 'cancelled') {
        await this.schedules.destroy({
          where: { unique_id: existingSchedule.dataValues.unique_id },
        });
      }

      // const createScheduleData: Schedules = await this.schedules.create({
      //   ...scheduleData,
      // });
      console.log('scheduleData:::123', scheduleData);

      // delete this before create in Db. this data need to send inapp notification
      delete scheduleData['topic_name'];
      delete scheduleData['trainer_name'];
      delete scheduleData['batch_name'];
      console.log('scheduleData:::after', scheduleData);

      const promises = scheduleData?.learner_id.map(async (learner_id) => {
        scheduleData['learner_id'] = Number(learner_id) as any;
        const createScheduleData: Schedules = await this.schedules.create({
          ...scheduleData,
        });
        return { id: learner_id, schedule: createScheduleData };
      });
      const createdSchedules = await Promise.all(promises);

      //gettig user tracks to update the course summary data with scheduled topic status,trainer id and scheduled_at
      const user_tracks = await this.userTracks.findAll({
        where: {
          track_id: scheduleData.track_id,
          batch_id: scheduleData.batch_id,
        },
      });

      for (const user_track of user_tracks) {
        const courseSummaryData = JSON.parse(
          user_track?.dataValues?.course_summary_data
        );
        if (courseSummaryData.children.length > 0) {
          for (const child of courseSummaryData.children) {
            const courseId = child.id;
            const chapters = child.chapters;

            for (const chapter of chapters) {
              const chapterId = chapter.id;
              const topics = chapter.topics;

              for (const topic of topics) {
                const topicId = topic.id;

                // Update the desired properties within the matched topic
                if (
                  Number(courseId) === Number(scheduleData.track_id) &&
                  Number(chapterId) === Number(scheduleData.chapter_id) &&
                  Number(topicId) === Number(scheduleData.topic_id)
                ) {
                  topic['trainer_id'] = scheduleData.trainer_id;
                  topic['scheduled_at'] = scheduleData.start_at;
                  topic['status'] = scheduleData.status;
                }
              }
            }
          }
        } else {
          for (const chapter of courseSummaryData.chapters) {
            const chapterId = chapter.id;
            const topics = chapter.topics;

            for (const topic of topics) {
              const topicId = topic.id;

              // Update the desired properties within the matched topic

              if (
                Number(chapterId) === Number(scheduleData.chapter_id) &&
                Number(topicId) === Number(scheduleData.topic_id)
              ) {
                topic['trainer_id'] = scheduleData.trainer_id;
                topic['scheduled_at'] = scheduleData.start_at;
                topic['status'] = scheduleData.status;
              }
            }
          }
        }

        // Convert the modified object back to JSON
        const updatedCourseSummaryData = JSON.stringify(courseSummaryData);
        // Update the course_summary_data field in the database
        await user_track.update({
          course_summary_data: updatedCourseSummaryData,
        });
      }

      return createdSchedules as any;
    }
  }

  // public async createSchedule(
  //   scheduleData: CreateScheduleDto
  // ): Promise<Schedule> {
  //   if (isEmpty(scheduleData))
  //     throw new HttpException(400, 'scheduleData is empty');
  //   let start_at = scheduleData.start_at;
  //   let end_at = scheduleData.end_at;
  //   let start_time = moment.utc(start_at).format('HH:mm:ss');
  //   console.log(start_time, '***start_time***');
  //   let end_time = moment.utc(end_at).format('HH:mm:ss');
  //   console.log(end_time, '***end_time***');
  //   let epochStartTime = Math.floor(new Date(start_at).getTime() / 1000);
  //   let epochEndTime = Math.floor(new Date(end_at).getTime() / 1000);
  //   console.log(new Date(), '--Current Time--');
  //   let epochCurrentTime = Math.floor(new Date().getTime() / 1000);
  //   if (epochStartTime < epochCurrentTime)
  //     throw new HttpException(
  //       400,
  //       'Schedule start time cannot be lesser than the current date & time'
  //     );
  //   if (epochEndTime < epochCurrentTime)
  //     throw new HttpException(
  //       400,
  //       'Schedule end time cannot be lesser than the current date & time'
  //     );
  //   if (epochEndTime < epochStartTime)
  //     throw new HttpException(
  //       400,
  //       'Schedule end time cannot be lesser than the start time'
  //     );
  //   if (Number(start_time) < 6 || Number(end_time) > 22)
  //     throw new HttpException(400, 'Schedule cannot be added in this time');
  //   scheduleData.start_at = new Date(start_at.toString().slice(0, -1));
  //   scheduleData.end_at = new Date(end_at.toString().slice(0, -1));
  //   const createScheduleData: Schedule = await this.schedules.create({
  //     ...scheduleData,
  //   });
  //   return createScheduleData;
  // }
  public async updateSchedule(
    unique_id: string,
    scheduleData: CreateScheduleDto
  ): Promise<Schedules> {
    if (isEmpty(scheduleData))
      throw new HttpException(400, 'scheduleData is empty');
    console.log('unique_id::', unique_id);

    const findSchedule: Schedules[] = await this.schedules.findAll({
      where: { unique_id: unique_id },
    });
    console.log('findSchedul:::', findSchedule);
    if (!findSchedule) throw new HttpException(409, "Schedule doesn't exist");
    const updateScheduleData: any = await this.schedules.update(
      { ...scheduleData },
      {
        individualHooks: true,
        where: { unique_id: unique_id },
        returning: true,
      }
    );

    const user_tracks = await this.userTracks.findAll({
      where: {
        track_id: scheduleData.track_id,
        batch_id: scheduleData.batch_id,
      },
    });

    // const course_summary_data = JSON.parse(
    //   user_tracks[0].dataValues.course_summary_data
    // );
    for (const user_track of user_tracks) {
      const courseSummaryData = JSON.parse(
        user_track?.dataValues?.course_summary_data
      );
      if (courseSummaryData.children.length > 0) {
        for (const child of courseSummaryData.children) {
          const courseId = child.id;
          const chapters = child.chapters;

          for (const chapter of chapters) {
            const chapterId = chapter.id;
            const topics = chapter.topics;

            for (const topic of topics) {
              const topicId = topic.id;

              // Update the desired properties within the matched topic
              if (
                Number(courseId) === Number(scheduleData.track_id) &&
                Number(chapterId) === Number(scheduleData.chapter_id) &&
                Number(topicId) === Number(scheduleData.topic_id)
              ) {
                topic['trainer_id'] = scheduleData.trainer_id;
                topic['scheduled_at'] = scheduleData.start_at;
                topic['status'] = scheduleData.status;
              }
            }
          }
        }
      } else {
        for (const chapter of courseSummaryData.chapters) {
          const chapterId = chapter.id;
          const topics = chapter.topics;

          for (const topic of topics) {
            const topicId = topic.id;

            // Update the desired properties within the matched topic

            if (
              Number(chapterId) === Number(scheduleData.chapter_id) &&
              Number(topicId) === Number(scheduleData.topic_id)
            ) {
              topic['trainer_id'] = scheduleData.trainer_id;
              topic['scheduled_at'] = scheduleData.start_at;
              topic['status'] = scheduleData.status;
            }
          }
        }
      }

      // Convert the modified object back to JSON
      const updatedCourseSummaryData = JSON.stringify(courseSummaryData);
      // Update the course_summary_data field in the database
      await user_track.update({
        course_summary_data: updatedCourseSummaryData,
      });
    }

    return updateScheduleData;
  }

  public async triggerNotification(
    learnerIds: any,
    req: any,
    storeScheduleData: any,
    storeDetails: any
  ): Promise<any> {
    const trainer_id = req.body.trainer_id;
    const token = req.token;
    const status: string = req.body.status;

    const ids = [...learnerIds, trainer_id]; //learner and trainer id

    try {
      // get the user details
      const userData = await apiRequestHandler(
        `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${GET_USERS_ROUTE}/getNeededUsers/byIds`,
        token,
        'POST',
        { users: ids }
      );
      // get the topic details
      const topicName = await apiRequestHandler(
        `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}${GET_TOPICBYID}/${req.body.topic_id}`,
        token,
        'GET',
        ''
      );
      //mapping learners and trainer
      const mappingUsers = await this.mappingLearnerAndTrainer(
        userData,
        storeScheduleData,
        topicName,
        trainer_id,
        storeDetails.batch_name,
        storeDetails.trainer_name
      );

      //create object send to message schema to convert template
      const details = {
        token,
        templateName: this.getTemplateName(status),
        data: mappingUsers,
      };
      if (mappingUsers && details) {
        const message = new MessageSchema(details);
        const listOfUserData = await message.getSchema();
        console.log('listOfUserData::123', listOfUserData);

        //Send message to Redis
        if (listOfUserData) {
          const messageQueue = new MessageQueue();
          messageQueue.send(listOfUserData);
          return mappingUsers;
        }
      }
    } catch (error) {
      console.log('error in update Schedule', error);
      throw new HttpException(401, error);
    }
  }
  //this function return template name
  public getTemplateName(status) {
    let name: string;
    switch (status) {
      case 'scheduled':
        name = 'schedule_created';
        break;
      case 'rescheduled':
        name = 'session_rescheduled';
        break;

      case 'cancelled':
        name = 'schedule_cancel';
        break;

      case 'declined':
        name = 'schedule_declined';
        break;
      case 'reminder':
        name = 'schedule_reminder';
        break;
      default:
        break;
    }

    return name;
  }

  //create token for notification
  public async createToken() {
    const secretKey: string = SECRET_KEY;
    const access_expiresIn = 1800000;
    // const refresh_expiresIn = 1800000;
    console.log('access_expiresIn:::::,', access_expiresIn);
    return {
      access_token: sign(dataStoredInToken, secretKey, {
        expiresIn: access_expiresIn,
      }),
      // refresh_token: sign(dataStoredInToken, secretKey, {
      //   expiresIn: refresh_expiresIn,
      // }),
    };
  }

  public async reminderNotification(data: any) {
    // const data =[]
    console.log('data:::::::', data);
    // data.push(obj)
    const status = 'reminder';
    try {
      const promise = data.map(async (data) => {
        try {
          // get the user details
          const userData = await apiRequestHandler(
            `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${GET_TOKEN_BYID}`,
            '',
            'POST',
            { id: Number(data.id) }
          );
          console.log('userData::::::::::', userData.value.tokenData);
          // token=userData.value.token.access_token

          // get the topic details
          const topicName = await apiRequestHandler(
            `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}${GET_TOPICBYID}/${data.topic_id}`,
            userData.value.token.access_token,
            'GET',
            ''
          );
          const {
            formattedStartDateTime,
            formattedDate,
            formattedEndDateTime,
          } = this.getDateValue(data.start_at, data.end_at);

          return {
            topic_name: topicName.value.userData.title,
            name: userData.value.user.name,
            email: userData.value.user.email,
            start_time: formattedStartDateTime,
            end_time: formattedEndDateTime,
            date: formattedDate,
            host_url: `${HOST_IP_FRONT}/auth/signin`,
            token: userData.value.token.access_token,
            unique_id: data['unique_id'],
            id: data.id,
          };
        } catch (error) {
          console.log('error in reminder notification', error);
        }
      });

      const result = await Promise.all(promise);

      console.log('result::', result);
      // // create object send to message schema to convert template
      const details = {
        templateName: this.getTemplateName(status),
        data: result,
        token: result[0].token,
      };

      const message = new MessageSchema(details);
      const listOfUserData = await message.getSchema();
      console.log('list:::', listOfUserData);
      if (listOfUserData) {
        const messageQueue = new MessageQueue();
        messageQueue.send(listOfUserData);
        // // Extract an array of unique_id values
        const Ids = result.map((item) => item.id);

        const desiredProperties = {
          start_at: data[0].start_at,
          end_at: data[0].end_at,
          topic_name: result[0].topic_name,
          ref_id: result[0].unique_id,
          status: 'reminder_schedule',
          ids: Ids,
        };
        console.log('deso:', desiredProperties);
        await apiRequestHandler(
          `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${GET_USERS_ROUTE}/notifications/createNotifications`,
          result[0].token,
          'POST',
          desiredProperties
        );
        return details;
      }
    } catch (error) {
      console.log('error in reminder notification in batch service', error);
    }
  }

  //this function return the trainer and learner mapped data
  public mappingLearnerAndTrainer(
    userData,
    storeScheduleData,
    topicName,
    trainer_id,
    batch_name,
    trainer_name
  ) {
    // Create an object that maps learner IDs to their respective names
    const learnerData = userData.reduce((acc, learner) => {
      acc[learner.id] = learner;
      return acc;
    }, {});
    let extractedLearnerData = []; //store Learner Data

    if (Array.isArray(storeScheduleData[1])) {
      extractedLearnerData = storeScheduleData[1].map((schedule) => {
        const scheduleData = schedule.dataValues;
        const learnerId = scheduleData.learner_id;
        const learner = learnerData[learnerId];
        const { formattedStartDateTime, formattedDate, formattedEndDateTime } =
          this.getDateValue(scheduleData.start_at, scheduleData.end_at);

        return {
          start_time: formattedStartDateTime,
          end_time: formattedEndDateTime,
          date: formattedDate,
          name: learner ? learner.name : null,
          email: learner ? learner.email : null,
          topic_name: topicName.value.userData.title,
          user: 'learner',
          preferences: learner ? learner.userProfiles?.preferences : null,
          host_url: `${HOST_IP_FRONT}/auth/signin`,
          batch_name: batch_name,
          trainer_name: trainer_name,
          ms_start_date: scheduleData.start_at,
          ms_end_date: scheduleData.end_at,
        };
      });
    }
    let extractedTrainerData = []; //store Trainer Data
    const getSingleObject = []; //get single object out of extractedLearnerData
    const obj = extractedLearnerData[0]; //take single object
    getSingleObject.push(obj);

    extractedTrainerData = getSingleObject.map((schedule) => {
      const trainerId = trainer_id;
      const trainer = learnerData[trainerId];
      return {
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        date: schedule.date,
        name: trainer ? trainer.name : null,
        email: trainer ? trainer.email : null,
        topic_name: topicName.value.userData.title,
        user: 'trainer',
        preferences: trainer ? trainer.userProfiles.preferences : null,
        host_url: `${HOST_IP_FRONT}/auth/signin`,
        batch_name: batch_name,
        trainer_name: trainer_name,
        ms_start_date: schedule.ms_start_date,
        ms_end_date: schedule.ms_end_date,
      };
    });
    return [...extractedLearnerData, ...extractedTrainerData];
  }

  //this function return the date format
  public getDateValue(startTimestamp, endTimestamp) {
    // Use the 'Asia/Kolkata' timezone (India Standard Time)
    const timezone = 'Asia/Kolkata';

    // Convert UTC timestamps to moment objects in the desired timezone
    const startDateTime = moment(startTimestamp).tz(timezone);
    const endDateTime = moment(endTimestamp).tz(timezone);

    // Format start and end datetimes in desired formats
    const formattedStartDateTime = startDateTime.format('h:mm A');
    const formattedDate = startDateTime.format('YYYY-MM-DD');
    const formattedEndDateTime = endDateTime.format('h:mm A'); // Changed to 'hA' format

    return { formattedStartDateTime, formattedDate, formattedEndDateTime };
  }
  public async deleteSchedule(scheduleId: number): Promise<Schedules> {
    if (isEmpty(scheduleId))
      throw new HttpException(400, "Schedule doesn't existId");
    const findSchedule: Schedules = await this.schedules.findByPk(scheduleId);
    if (!findSchedule) throw new HttpException(409, "Schedule doesn't exist");
    await this.schedules.destroy({ where: { id: scheduleId } });
    return findSchedule;
  }
}
export default ScheduleService;
