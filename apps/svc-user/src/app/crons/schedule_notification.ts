import DB from '../database/index';
import { generateMailContent } from '../helpers';
import { sendMail } from '../service/email.service';
import sequelize, { Op } from 'sequelize';
// import { messaging } from '../services/firebase.service';
// import MobileService fro

import schedule from 'node-schedule';
import { log } from 'console';
import { CreateNotificationsDto } from '../dto/notifications.dto';
import MobileService from '../service/mobile.service';

class NotificationScheduler {
  // console.log('llleed');

  public scheduleJobForBooking = async (
    notificationType,
    hookData,
    users = []
  ) => {
    try {
      const todayDate = new Date();
      const dateFormat = this.bookingDateFormat(todayDate);
      console.log(dateFormat);

      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      /**
       * To send notification to the user to update his profile.
       */
      if (notificationType === 'update profile') {
        await this.scheduleEachBooking(hookData, notificationType); // gets the data from the hook and pass it to the function to perform logics.
      }
      /**
       * To send notification to who created(Client Rep) the batch if its approved by the admin.
       */
      if (notificationType === 'user approved') {
        await this.scheduleEachBooking(hookData, notificationType, users); // gets the data from the hook and pass it to the function to perform logics.
      }
    } catch (error) {
      console.error(error);
    }
  };

  private bookingDateFormat(todayDate): string {
    let date = todayDate.getDate();
    let month = todayDate.getMonth() + 1;
    const year = todayDate.getFullYear();

    if (date < 10) {
      date = '0' + date;
    }

    if (month < 10) {
      month = '0' + month;
    }

    return `${date}-${month}-${year}`;
  }

  private async scheduleEachBooking(booking: any, notificationType, user = []) {
    /**
     * To send notification to the user to update his profile.
     */
    if (notificationType === 'update profile') {
      console.log(booking, '---booking-----');
      console.log(booking.email, '---booking-----');
      const emailNotifications = []; // to store emails only if email is chosen by the user and super admin.
      let emailNotificationObjects: any; // to create the contents for the each emails to be sent.
      const userPhoneNumber = booking.phone_number; // phone number to send sms.
      const notificationPreferences =
        await DB.DBmodels.notifications_preferences.findAll({
          where: { status: true },
          attributes: ['notification_type'],
        }); // to get the notifications selected by the super admin.
      const notificationPreferenceType = notificationPreferences.map(
        (notificationPreference) => notificationPreference.notification_type
      );
      console.log(booking.user_id, '---user---');
      const userDetails: any = await DB.DBmodels.user_profiles.findOne({
        where: { user_id: booking.id },
      }); // to get what notifications users chose.

      console.log(userDetails, '----details----');
      const commonValues = userDetails.preferences.filter((preference) =>
        notificationPreferenceType.includes(preference)
      ); // this comment is a eg->to check if 'email' is present both master and users_profiles
      // if (booking.status === 'scheduled') {
      if (commonValues.includes('Email')) {
        emailNotifications.push(booking.email);
      }
      let smsSent = false; // to check if sms is sent or not.
      if (commonValues.includes('SMS')) {
        console.log('Sms is there');
        const mobileService = new MobileService();
        const sendSms = mobileService.sendOtp(userPhoneNumber);
        if (sendSms) {
          smsSent = true;
        }
        console.log(sendSms, '-----sendSMS-----sdsd');
      }

      console.log(booking.email, '-----booking.emailooo---');
      // if (commonValues.includes('SMS')) {
      //   console.log('Sms is there');
      //   const mobileService = new MobileService();
      //   const sendSms = mobileService.sendOtp(userPhoneNumber);
      //   console.log(sendSms, '-----sendSMS-----sdsd');

      //   // emailNotifications.push(booking.email);
      // }

      /** Assigning values to the email template */
      const createBatchMailContent = generateMailContent(
        'profile_updation.js',
        {
          first_name: booking.first_name,
          last_name: booking.last_name,
          // batch_name:,
          // date:,
          // start_date:,
          // end_date: ,
        }
      );
      console.log(emailNotifications, '----notifudysks-----');
      console.log(`Generating email for ${emailNotifications.join(', ')}`);

      // eslint-disable-next-line prefer-const
      emailNotificationObjects = emailNotifications.map((email) => ({
        email: email,
        // subject: `${booking.topics.title} Scheduled`,
        subject: `Please update your profile`,
        mailContent: createBatchMailContent,
      }));
      if (!emailNotifications.length) {
        console.log('No email notifications found');
        // return;
      }
      let emailSent = false; // to check if email is sent or not.
      if (emailNotificationObjects) {
        const sendEmail = await sendMail(emailNotificationObjects); // calling the function to send email
        emailSent = true;
        console.log('Create Batch email sent successfully');
      } else {
        emailSent = false;
      }

      /**
       * This object is created and store in a separate table based on the email or whatsapp or sms data sent and 
          what all the logics and data obtained during the process.
       * The object will be used for in-app notifications.
       */
      const notifications: CreateNotificationsDto = {
        user_id: booking.id,
        email: emailSent,
        sms: smsSent,
        whats_app: false,
        notifications_for: {
          value: {
            title: 'User Profile Update',
            // topic: booking.topics.title,
            topic: null,
            start_time: null,
            end_time: null,
            batch_name: null,
          },
        },
      };
      console.log(notifications, '---notify onjie83');

      try {
        const notification = await DB.DBmodels.notifications.create({
          ...notifications,
        });
        console.log(notification, '---notiggg');
      } catch (e) {
        console.log(e, 'error in creating notification');
      }
    }
    /**
     * To send notification to who created(Client Rep) the batch if its approved by the admin.
     */
    if (notificationType === 'user approved') {
      const emailNotifications = []; // to store emails only if email is chosen by the user and super admin.
      let emailNotificationObjects: any; // to create the contents for the each emails to be sent.
      console.log(booking, '---booking-----');
      // Object to store the count for each created_by value
      const createdByCount = {}; // to get the count of how many users has been approved.
      console.log(user, '---apoved usrs----');
      const findApprovedUser = await DB.DBmodels.users.findOne({
        where: { id: user },
      });
      console.log(findApprovedUser, '-----findedapprovedusers=----');

      // Iterate over the array of data
      for (const data of booking) {
        // Extract the created_by value
        const created_by = data.dataValues.created_by;

        // Increment the count for the corresponding created_by value
        if (Object.prototype.hasOwnProperty.call(createdByCount, created_by)) {
          createdByCount[created_by]++;
        } else {
          createdByCount[created_by] = 1;
        }
      }

      // Send notifications or emails to each created_by value based on the count
      for (const created_by in createdByCount) {
        if (Object.prototype.hasOwnProperty.call(createdByCount, created_by)) {
          const count = createdByCount[created_by];
          // Send notification email to the created_by value with the count
          const notificationPreferences =
            await DB.DBmodels.notifications_preferences.findAll({
              where: { status: true },
              attributes: ['notification_type'],
            }); // to get the notifications selected by the super admin.
          const notificationPreferenceType = notificationPreferences.map(
            (notificationPreference) => notificationPreference.notification_type
          );
          const findCreatedBy = await DB.DBmodels.users.findOne({
            where: { id: created_by },
          });
          console.log(findCreatedBy, '----createduuuyybbyyy----');

          const userDetails: any = await DB.DBmodels.user_profiles.findOne({
            where: { user_id: findCreatedBy.id },
          }); // to get what notifications users chose.
          console.log(userDetails, '----details----');
          const commonValues = userDetails.preferences.filter((preference) =>
            notificationPreferenceType.includes(preference)
          ); // this comment is a eg->to check if 'email' is present both master and users_profiles
          // if (booking.status === 'scheduled') {
          if (commonValues.includes('Email')) {
            emailNotifications.push(findCreatedBy.email);
          }
          /** Assigning values to the email template */
          const createBatchMailContent = generateMailContent(
            'approved_template.js',
            {
              first_name: findCreatedBy.first_name,
              last_name: findCreatedBy.last_name,
              count: count,
              approver_first_name: findApprovedUser.first_name,
              approver_last_name: findApprovedUser.last_name,
            }
          );
          console.log(emailNotifications, '----notifudysks-----');
          console.log(`Generating email for ${emailNotifications.join(', ')}`);
          emailNotificationObjects = emailNotifications.map((email) => ({
            email: email,
            // subject: `${booking.topics.title} Scheduled`,
            subject: `Users Approved`,
            mailContent: createBatchMailContent,
          }));
          if (!emailNotifications.length) {
            console.log('No email notifications found');
            // return;
          }
          let emailSent = false; // to check if email is sent or not.
          if (emailNotificationObjects) {
            const sendEmail = await sendMail(emailNotificationObjects); // calling the function to send email
            console.log(
              `Sending email to created_by ${created_by} with count ${count}`
            );
            emailSent = true;
            console.log('Create Batch email sent successfully');
          } else {
            emailSent = false;
          }

          /**
           * This object is created and store in a separate table based on the email or whatsapp or sms data sent and 
              what all the logics and data obtained during the process.
           * The object will be used for in-app notifications.
           */
          const notifications: CreateNotificationsDto = {
            user_id: booking.id,
            email: emailSent,
            sms: false,
            whats_app: false,
            notifications_for: {
              value: {
                title: 'Uses approved',
                // topic: booking.topics.title,
                topic: null,
                start_time: null,
                end_time: null,
                batch_name: null,
              },
            },
          };
          console.log(notifications, '---notify onjie83');

          try {
            const notification = await DB.DBmodels.notifications.create({
              ...notifications,
            });
            console.log(notification, '---notiggg');
          } catch (e) {
            console.log(e, 'error in creating notification');
          }
        }
      }
      // for (let i = 0; i < booking.length; i++) {
      //   const findCR = await DB.DBmodels.users.findOne({
      //     where: { id: booking[i].created_by },
      //   });
      //   console.log(findCR.id, '---> CRRRRR');

      //   if (!clientRepresentatives[findCR.id]) {
      //     clientRepresentatives[findCR.id] = []; // Create an empty array if the key doesn't exist
      //   }
      //   clientRepresentatives[findCR.id].push(booking[i]); // Add the booking to the corresponding array
      //   createdByCount[findCR.id] = (createdByCount[findCR.id] || 0) + 1;
      // }
      // console.log(clientRepresentatives, '------ClientRepresentative');
      // console.log(createdByCount, '------CreatedByCount');

      // console.log(clientRepresentatives, '------ClientRepresentative');

      // const userDetails: any = await DB.DBmodels.user_profiles.findOne({
      //   where: { user_id: booking.id },
      // });

      // You can access each array of bookings by using the created_by value as the key in the clientRepresentatives object.
      // For example:
      // const bookingsForCR1 = clientRepresentatives[cr1Id]; // Array of bookings for client representative 1
      // const bookingsForCR2 = clientRepresentatives[cr2Id]; // Array of bookings for client representative 2
      // ...

      // Now you can perform operations on each group of bookings separately
    }
  }

  public dailyScheduler() {
    const rule = new schedule.RecurrenceRule();
    rule.hour = 7;
    rule.minute = 12;
    rule.tz = 'Asia/Kolkata';
    rule.dayOfWeek = new schedule.Range(0, 6);
    const j = schedule.scheduleJob(rule, function () {
      schedule.cancelJob();
      console.log('this will run everyday at 7:12 AM-->>>>>>>>>>>', new Date());
      const temp = new NotificationScheduler();
      const notificationType = 'all';
      temp.scheduleJobForBooking(notificationType, rule);
      const jobs = schedule.scheduledJobs;
    });
  }

  public cancelScheduleJob(id: string) {
    console.log('cancel called', id);
    const my_job = schedule.scheduledJobs[id];
    if (my_job) {
      my_job.cancel();
    }
  }
}

const called = new NotificationScheduler();
called.dailyScheduler();

export default NotificationScheduler;
