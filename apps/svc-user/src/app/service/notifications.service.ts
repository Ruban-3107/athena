import DB from '../database/index';
import { HttpException } from '@athena/shared/exceptions';
import { isEmpty } from '../util/util';
import moment from 'moment-timezone';
import {Op} from 'sequelize'

class NotificationService {
  public users = DB.DBmodels.users;
  public user_notifications = DB.DBmodels.userNotifications;

  /**
   * Retrieves notifications for a specific user.
   * @param userId - The ID of the user.
   * @param limit - The maximum number of notifications to retrieve per page.
   * @param page - The page number to retrieve (default is 1).
   * @returns A Promise resolving to an array of notifications.
   * @throws HttpException if userId is empty, user profile doesn't exist, or notification preferences don't exist.
   */
  public async get(userId: any, limit: number, page = 1): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    // // Check if the user profile exists
    // const userDetails: any = await DB.DBmodels.user_profiles.findOne({
    //   where: { user_id: userId },
    // });
    // if (!userDetails)
    //   throw new HttpException(409, "User Profile doesn't exist");

    // // Retrieve active notification preferences
    // const notificationPreferences =
    //   await DB.DBmodels.notifications_preferences.findAll({
    //     where: { status: true },
    //     attributes: ['notification_type'],
    //   });
    // if (!notificationPreferences)
    //   throw new HttpException(409, "Notification Preferences doesn't exist");

    // // Extract notification types from preferences
    // const notificationPreferenceType = notificationPreferences.map(
    //   (notificationPreference) => notificationPreference.notification_type
    // );

    // // Filter user's preferences based on active notification types
    // const commonValues = userDetails?.preferences?.filter((preference) =>
    //   notificationPreferenceType.includes(preference)
    // );
    // console.log(commonValues, ' ---valuo9');

    const offset = (page - 1) * limit; // Calculate the offset based on the page and limit parameters


    console.log("userId::::::::",userId)

    // Retrieve in-app notification data for the user
    const getInAppNotificationData: any = await this.user_notifications.findAll({
      where: { user_id: Number(userId)},
      attributes: ['notifications_for'],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });
    // Retrive count of not Viewed notification
    const NotViewedNotificationCount: number = await this.user_notifications.count({
      where: {
        user_id: Number(userId),
        viewed: false,
      },
    });

    return { getInAppNotificationData,NotViewedNotificationCount };
  }

  public async view(userId: any): Promise<any[]> {
    try {
      const viewStatusChanged = await await this.user_notifications.update(
        { viewed: true },
        { where: { user_id: userId } }
      );

      return viewStatusChanged;
    } catch (error) {
      console.log('error in view notification', error);
      throw new HttpException(400, error);
    }
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

  public async createTemplate(data) {

    console.log("123")
    let temp;

    if (data.status == 'schedule_creation_pending'|| data.status == 'pending') {
      const { formattedStartDateTime, formattedDate, formattedEndDateTime } =
        await this.getDateValue(data.start_at, data.end_at);
      temp = `Scheduling for batch ${data.batch_name} on topic ${data.topic_name} on ${formattedDate} from ${formattedStartDateTime} to ${formattedEndDateTime} to you. Either Accept or Reject!`;
    } else if (data.status == 'declined') {
      const { formattedStartDateTime, formattedDate, formattedEndDateTime } =
        await this.getDateValue(data.start_at, data.end_at);
      // temp = `Scheduling for batch ${data.batch_name} on topic ${data.topic_name} on ${formattedDate} from ${formattedStartDateTime} to ${formattedEndDateTime} was done. Either Accept or Reject`;
      temp = `Trainer ${data.trainer_name} Declined the Schedule on topic ${data.topic_name} on ${formattedDate} from ${formattedStartDateTime} to ${formattedEndDateTime} for the batch ${data.batch_name}. Reason:${data.reason}`;
    }else if( data.status == 'scheduled' ){
      const { formattedStartDateTime, formattedDate, formattedEndDateTime } =
      await this.getDateValue(data.start_at, data.end_at);
      temp = `The topic ${data.topic_name} on ${formattedDate} from ${formattedStartDateTime} to ${formattedEndDateTime} for the batch ${data.batch_name} has been Scheduled!.`
      
    }else if(data.status == 'cancelled'){
      const { formattedStartDateTime, formattedDate, formattedEndDateTime } =
      await this.getDateValue(data.start_at, data.end_at);
      temp = `Scheduled for batch ${data.batch_name} on topic ${data.topic_name} on ${formattedDate} from ${formattedStartDateTime} to ${formattedEndDateTime} for the batch ${data.batch_name} has been Cancelled!.`
      
    }else if(data.status == 'rescheduled'){
      const { formattedStartDateTime, formattedDate, formattedEndDateTime } =
      await this.getDateValue(data.start_at, data.end_at);
      temp = `The topic ${data.topic_name} on ${formattedDate} from ${formattedStartDateTime} to ${formattedEndDateTime} for the batch ${data.batch_name} has been ReScheduled!.`
      

    }else if(data.status == 'under rescheduling'){
      const { formattedStartDateTime, formattedDate, formattedEndDateTime } =
        await this.getDateValue(data.start_at, data.end_at);
      temp = `ReScheduling for batch ${data.batch_name} on topic ${data.topic_name} on ${formattedDate} from ${formattedStartDateTime} to ${formattedEndDateTime} to you . Either Accept or Reject!`;

    }else if(data.status == 'reminder_schedule'){
      const { formattedStartDateTime, formattedDate, formattedEndDateTime } =
        await this.getDateValue(data.start_at, data.end_at);
        temp=`The Training session on ${data.topic_name} on ${formattedDate} from ${formattedStartDateTime} to ${formattedEndDateTime} is starting in 15min`

    }


    return temp;
  }

  public async create(data: any): Promise<any> {
    console.log('hhhhhhhhh', data);
    let storeInDb ;
    try {
      const promises=data.user_ids.map(async(id)=>{
        const template = await this.createTemplate(data);
        const obj = {
          notifications_for: template,
          ref_id: data.ref_id,
          user_id: Number(id),
          created_by: data.created_by,
        };
        console.log("obj:",obj)
        storeInDb = await this.user_notifications.create({ ...obj });

      })

      const createNotify = Promise.all(promises)
   

      return createNotify;
    } catch (err) {
      console.log('err', err);
      throw new HttpException(401, err);
    }
  }

  

  public async declineSevice(body: any, token: any): Promise<any> {
    try {
      const getUser = await this.user_notifications.findOne({
        where: { ref_id: body.ref_id },
      });
      console.log("getyuu",getUser)
      body['user_id'] = [...getUser['dataValues']['created_by']];
      body['created_by'] = token;
      const storeData = await this.create(body);
      if (storeData) return storeData;
    } catch (err) {
      console.log('err:', err);

      throw new HttpException(401, err);
    }

    // const template = await this.createTemplate(body);
    // const data = {
    //   user_id: [...getUser['created_by']],
    //   created_by: token,
    //   notifications_for: template,
    //   schedule_unique_id: body.schedule_unique_id,
    // };
  }
}

export default NotificationService;
