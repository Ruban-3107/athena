import { NextFunction, Request, Response } from 'express';
import { CreateScheduleDto } from '../dto/schedules.dto';
import { Schedules } from '../interface/schedules.interface';
import scheduleService from '../service/schedules.service';
import moment from 'moment-timezone';
import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';
import { RequestWithUser } from '../interface/routes.interface';
import { apiRequestHandler } from '@athena/shared/common-functions';
import {
  USERS_SERVICE_PORT,
  USERS_SERVICE_URL,
  GET_USERS_ROUTE,
  MS_TEAMS_URL,
  MS_TEAMS_SERVICE_PORT,
  MS_TEAM_ROUTE,
} from '../config/index';
import { MessageQueue } from '../util/message.queue';
import DB from '../database';
import { HttpException } from '@athena/shared/exceptions';

class SchedulesController {
  public scheduleService = new scheduleService();
  public batchModel = DB.DBmodels.batches;

  public getSchedules = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log('@@@@@@@@@@@@@@@@@@@', req.user);
      const token: any = req.token;
      const s: any = req['user'];
      const role: any = s.userRoles[0].name;
      const findOneSchedules: Schedules[] =
        await this.scheduleService.findAllSchedule(token, req.user.id, role);
      const response = responseCF(
        bodyCF({
          val: { scheduleData: findOneSchedules },
          code: '600',
          status: 'success',
          message: 'Schedule retrived successfully',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '610',
          status: 'error',
          message: `${error}`,
        })
      );
      return res.json(response);
    }
  };

  // To get schedules by UserID
  public getScheduleByUnqId = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.unique_id;
      const token: any = req.token;
      const findOneSchedulebyUserData: Schedules[] =
        await this.scheduleService.findScheduleByUnqId(id, token);
      const response = responseCF(
        bodyCF({
          val: { scheduleData: findOneSchedulebyUserData },
          code: '600',
          status: 'success',
          message: 'Schedule retrived successfully',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '610',
          status: 'error',
          message: `${error}`,
        })
      );
      return res.json(response);
    }
  };

  public createSchedule = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const scheduleData: CreateScheduleDto = req.body;
      const token = req.token;
      // const learnerIds = req.body.learner_id;
      // delete scheduleData['learner_id'];
      const unq_id = `Sch_${scheduleData.batch_id}${scheduleData.track_id}${scheduleData.chapter_id}${scheduleData.topic_id}`;
      scheduleData['unique_id'] = unq_id;
      console.log('eq.user:::::::::::', req.user);
      scheduleData['created_by'] = req.user.id;

      // const promises = learnerIds.map(async (learner_id) => {
      //   scheduleData['learner_id'] = Number(learner_id) as any;
      //   const createdSchedule = await this.scheduleService.createSchedule(
      //     scheduleData
      //   );
      //   return { id: learner_id, schedule: createdSchedule };
      // });
      // const promises = [];
      const storeDetails = { ...scheduleData }; //need for in app notification

      // const createdSchedules = await Promise.all(promises);
      const createdSchedules = await this.scheduleService.createSchedule(
        scheduleData
      );
      // //this object send to inapp notification
      if (createdSchedules) {
        const desiredProperties = {
          ids: [storeDetails.trainer_id],
          start_at: storeDetails.start_at,
          end_at: storeDetails.end_at,
          trainer_name: storeDetails.trainer_name,
          batch_name: storeDetails.batch_name,
          topic_name: storeDetails.topic_name,
          ref_id: storeDetails['unique_id'],
          status: 'schedule_creation_pending',
        };

        console.log('desiredProperties:::', desiredProperties);

        await apiRequestHandler(
          `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${GET_USERS_ROUTE}/notifications/createNotifications`,
          token,
          'POST',
          desiredProperties
        ); //create notification
      }

      const response = responseCF(
        bodyCF({
          val: { scheduleData: createdSchedules },
          code: '600',
          status: 'success',
          message: 'Schedule created successfully',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '610',
          status: 'error',
          message: `${error}`,
        })
      );
      return res.json(response);
    }
  };

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

    // Generate the final time range string
    const timeRangeString = `${formattedDate} on start ${formattedStartDateTime} from ${formattedEndDateTime}`;

    return { formattedStartDateTime, formattedDate, formattedEndDateTime };
  }

  public updateSchedule = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const unique_id = req.params.unq_id;
      console.log('unique_id::::', unique_id);
      let storeScheduleData;
      const token = req.token;

      console.log('req.token:::', req.token, req.user);

      const scheduleData: CreateScheduleDto = req.body;
      scheduleData['status'] == 'declined'
        ? ((scheduleData['declined_by'] = req.user.id),
          (scheduleData['declined_at'] = Date.now()))
        : scheduleData['status'] == 'scheduled'
        ? ((scheduleData['accepted_by'] = req.user.id),
          (scheduleData['accepted_by'] = Date.now()))
        : scheduleData['status'] == 'rescheduled'
        ? ((scheduleData['rescheduled_by'] = req.user.id),
          (scheduleData['rescheduled_at'] = Date.now()))
        : scheduleData['status'] == 'cancelled'
        ? ((scheduleData['cancelled_by'] = req.user.id),
          (scheduleData['cancelled_at'] = Date.now()))
        : scheduleData['status'] == 'pending'
        ? ((scheduleData['created_by'] = req.user.id),
          (scheduleData['created_at'] = Date.now()))
        : '';

      const storeDetails = { ...scheduleData }; //need for in app notification
      //const updateScheduleData: Schedule = await this.scheduleService.updateSchedule(unique_id, scheduleData);
      const learnerIds = req.body.learner_id;
      delete scheduleData['learner_id'];

      // // delete this before create in Db. this data need to send inapp notification
      delete scheduleData['topic_name'];
      delete scheduleData['trainer_name'];
      delete scheduleData['batch_name'];

      console.log(' req.body.learner_id:::::', learnerIds, storeDetails);
      console.log(' scheduleData:::::', scheduleData);
      const promises = learnerIds.map(async (learner_id) => {
        //scheduleData['learner_id'] = learner_id;
        scheduleData['status'] = scheduleData?.status ?? 'pending';
        console.log('scheduleData::??', scheduleData);
        const updateScheduleData = await this.scheduleService.updateSchedule(
          unique_id,
          scheduleData
        );
        storeScheduleData = updateScheduleData;
        return { id: learner_id, schedule: updateScheduleData };
      });
      // Waits for all promises to resolve
      // console.log('before:::::::::updateSchedules', storeScheduleData[1][0]['dataValues'].created_by);
      const updateSchedules = await Promise.all(promises);
      if (
        scheduleData['status'] == 'declined' ||
        scheduleData['status'] == 'pending' ||
        scheduleData['status'] == null ||
        scheduleData['status'] == undefined ||
        scheduleData['status'] == 'under rescheduling'
      ) {
        if (scheduleData['status'] == 'declined') {
          const desiredProperties = {
            batch_name: storeDetails.batch_name ? storeDetails.batch_name : '',
            start_at: storeDetails.start_at,
            end_at: storeDetails.end_at,
            trainer_name: storeDetails.trainer_name,
            topic_name: storeDetails.topic_name,
            ref_id: unique_id,
            status: scheduleData['status'],
            ids:
              scheduleData['status'] == 'declined'
                ? [storeScheduleData[1][0]['dataValues'].created_by]
                : [storeDetails.trainer_id],
            reason: storeDetails.reason_for_cancellation
              ? storeDetails.reason_for_cancellation
              : '',
          };

          console.log('desiredProperties:::', desiredProperties);

          const notification = await this.scheduleService.triggerNotification(
            learnerIds,
            req,
            storeScheduleData,
            storeDetails
          );
          if (notification) {
            await apiRequestHandler(
              `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${GET_USERS_ROUTE}/notifications/createNotifications`,
              token,
              'POST',
              desiredProperties
            );
            //Returns the deleted topics in the response
            const response = responseCF(
              bodyCF({
                val: { scheduleData: updateSchedules },
                code: '600',
                status: 'success',
                message: 'Schedule created successfully',
              })
            );
            return res.json(response);
          }
        } else {
          //Returns the deleted topics in the response
          const response = responseCF(
            bodyCF({
              val: { scheduleData: updateSchedules },
              code: '600',
              status: 'success',
              message: 'Schedule created successfully',
            })
          );
          return res.json(response);
        }
      } else {
        console.log(
          'else:::::::::::::::7:::',
          learnerIds,
          scheduleData['status']
        );
        const notification = await this.scheduleService.triggerNotification(
          learnerIds,
          req,
          storeScheduleData,
          storeDetails
        );
        if (notification) {
          const desiredProperties = {
            start_at: storeDetails.start_at,
            end_at: storeDetails.end_at,
            trainer_name: storeDetails.trainer_name,
            topic_name: storeDetails.topic_name,
            ref_id: unique_id,
            status: scheduleData['status'],
            batch_name: storeDetails['batch_name']
              ? storeDetails.batch_name
              : '',
            ids: [
              ...learnerIds,
              req.body.trainer_id,
              storeScheduleData[1][0]['dataValues'].created_by,
            ],
          };

          console.log('desiredProperties:::', desiredProperties);

          await apiRequestHandler(
            `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${GET_USERS_ROUTE}/notifications/createNotifications`,
            token,
            'POST',
            desiredProperties
          );

          // //Reminder Notification
          if (
            storeDetails.status == 'scheduled' ||
            storeDetails.status == 'rescheduled'
          ) {
            // Create an array of objects based on learner_id
            const resultArray = learnerIds.map((learnerId) => ({
              learner_id: learnerId,
              topic_id: storeDetails.topic_id,
              start_at: storeDetails.start_at,
              end_at: storeDetails.end_at,
              trainer_id: storeDetails.trainer_id,
              unique_id: unique_id,
            }));
            console.log('resultArray:::', resultArray);

            //ms team create schedule
            const data = {
              subject: storeDetails.status,
              attendees: notification,
            };
            console.log('data:64666', data);

            try {
              //Ms Team Function..
              if (storeDetails.status == 'scheduled') {
                const joinLink = await apiRequestHandler(
                  `${MS_TEAMS_URL}:${MS_TEAMS_SERVICE_PORT}${MS_TEAM_ROUTE}/getMeetingLink`,
                  token,
                  'POST',
                  data
                );
                console.log('joinLinkjoinLinkjoinLinkjoinLink', joinLink);
                if (joinLink.status == 'success') {
                  console.log('joinLink::', joinLink.value.eventId);
                  console.log('joinLink::', joinLink.value.meetingLink);
                  await this.batchModel.update(
                    {
                      meeting_link: joinLink.value.meetingLink,
                      event_id: joinLink.value.eventId,
                    },
                    { where: { id: scheduleData['batch_id'] } }
                  );
                }
              } else if (storeDetails.status == 'rescheduled') {
                const batchDetails = await this.batchModel.findOne({
                  where: { id: scheduleData['batch_id'] },
                });
                if (batchDetails) {
                  const data = {
                    eventId: batchDetails['dataValues'].event_id,
                    newStartDate: scheduleData['start_at'],
                    newEndDate: scheduleData['end_at'],
                  };
                  const reschedule = await apiRequestHandler(
                    `${MS_TEAMS_URL}:${MS_TEAMS_SERVICE_PORT}${MS_TEAM_ROUTE}/reschedule`,
                    token,
                    'POST',
                    data
                  );
                  if (reschedule.status == 'success') {
                    await this.batchModel.update(
                      {
                        meeting_link: reschedule.value.meetingLink,
                        event_id: reschedule.value.eventId,
                      },
                      { where: { id: scheduleData['batch_id'] } }
                    );
                  } else {
                    throw new HttpException(401, reschedule.message);
                  }
                } else {
                  throw new HttpException(401, 'no eventId Found');
                }
              } else if (storeDetails.status == 'cancelled') {
                const batchDetails = await this.batchModel.findOne({
                  where: { id: scheduleData['batch_id'] },
                });
                if (batchDetails) {
                  const data = {
                    eventId: batchDetails['dataValues'].event_id,
                  };
                  const reschedule = await apiRequestHandler(
                    `${MS_TEAMS_URL}:${MS_TEAMS_SERVICE_PORT}${MS_TEAM_ROUTE}/cancel`,
                    token,
                    'POST',
                    data
                  );
                  if (reschedule.status == 'success') {
                    console.log('ms team cancelled res:', reschedule.message);
                  } else {
                    throw new HttpException(401, reschedule.message);
                  }
                } else {
                  throw new HttpException(401, 'no eventId Found');
                }
              }
            } catch (error) {
              console.log('error in ms team', error);
            }

            //some delay because the email notification need to send
            setTimeout(() => {
              console.log('resultArray:', {
                messageExchange: 'reminder',
                user: resultArray,
              });
              const messageQueue = new MessageQueue();
              const mess = { messageExchange: 'reminder', user: resultArray };
              messageQueue.send(mess);
            }, 30000);
          }

          const response = responseCF(
            bodyCF({
              val: { scheduleData: updateSchedules },
              code: '600',
              status: 'success',
              message: 'Schedule created successfully',
            })
          );
          return res.json(response);
        }
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '610',
          status: 'error',
          message: `${error}`,
        })
      );
      return res.json(response);
    }
  };

  public deleteSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const scheduleId = Number(req.params.id);
      const deleteScheduleData: Schedules =
        await this.scheduleService.deleteSchedule(scheduleId);

      res.status(200).json({ data: deleteScheduleData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getScheduleByBatchId = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const token: any = req.token;
      const type = req.params.type;
      console.log('lolololo***************************************', id, type);
      const findOneSchedulebyUserData: Schedules[] =
        await this.scheduleService.findScheduleById(id, type, token);
      const response = responseCF(
        bodyCF({
          val: { scheduleData: findOneSchedulebyUserData },
          code: '600',
          status: 'success',
          message: 'Schedule retrived successfully',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '610',
          status: 'error',
          message: `${error}`,
        })
      );
      return res.json(response);
    }
  };
}

export default SchedulesController;
