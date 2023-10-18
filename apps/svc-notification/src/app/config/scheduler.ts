import scheduler from 'node-schedule';
import { Pool } from 'pg';
import moment from 'moment';

import {
  DB_BATCH_DATABASE,
  DB_BATCH_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_BATCH_USER,
} from './index';
import { MessageQueue } from '../utils/message.queue';
// Create a PostgreSQL connection pool
const pool = new Pool({
  user: DB_BATCH_USER,
  host: DB_HOST,
  database: DB_BATCH_DATABASE,
  password: DB_BATCH_PASSWORD,
  port: DB_PORT, // Default PostgreSQL port
});

export class SchedulerJob {
  public alert() {
    // Schedule a job to run every day at 7:30 AM

    // 0: Represents the minute field. It's set to 0, so the job will run at the start of the hour.
    // 7: Represents the hour field. It's set to 7, so the job will run at 7 AM.
    // *: Represents any day of the month, so the job will run on any day.
    // *: Represents any month, so the job will run every month.
    // *: Represents any day of the week, so the job will run every day of the week.

    // the cron pattern '0 7 * * *' schedules the job to run every day at 7 AM.

    const currentTime = moment();
    const rule = new scheduler.RecurrenceRule();
    rule.hour = 7;
    rule.minute = 30;
    rule.dayOfWeek = new scheduler.Range(0, 6);
    console.log('rule:here::', rule);
    const job = scheduler.scheduleJob(rule, function () {
      console.log(
        'this will run everyday at 7:30 AM-->>>>>>>>>>>',
        currentTime.format('YYYY-MM-DD HH:mm:ss')
      );
      const schedule = new SchedulerJob();
      schedule.sendNotifications();
    });
  }

  // Function to fetch and send notifications
  public async sendNotifications() {
    try {
      const todayStart = moment().startOf('day'); // Get the start of today (midnight)
      const todayEnd = moment().endOf('day'); // Get the end of today (11:59:59 PM)
      console.log(
        'todayStart:todayEnd ',
        todayStart.toISOString(),
        todayEnd.toISOString()
      );
      const query = {
        text: 'SELECT * FROM schedules WHERE status IN ($1, $2) AND start_at >= $3 AND start_at <= $4',
        values: [
          'scheduled',
          'rescheduled',
          todayStart.toISOString(),
          todayEnd.toISOString(),
        ],
      };

      const { rows } = await pool.query(query);

      console.log('rows::::::', rows);
      // Schedule notifications for trainers and learners

      if (rows.length === 0) {
        console.log('No schedules for today.');
      } else {
        await this.scheduleNotify(rows);
      }
    } catch (error) {
      console.error('Error: IN NOtification cron', error);
    }
  }

  public async scheduleNotify(rows) {
    // Group the data by trainer
    const groupedData = await this.groupDataByTrainer(rows);
    // Function to schedule notifications for all groups

    console.log('groupDataByTrainer::', groupedData);

    for (const group of groupedData) {
      console.log('group:::::::', group);
      await this.scheduleNotificationsForGroup(group);
    }
  }

  // Function to schedule notifications for a group based on its schedule
  public async scheduleNotificationsForGroup(group) {
    try {
      console.log('group.learners[0]::', group.learners[0].start_at);
      const rule = await this.scheduleEachTopic(group.learners[0].start_at);
      console.log('rule:::p', rule, group.trainer_id);
      // Create an array to store learner notifications
      const learnerNotifications = [];
      let notificationCounter = 0;
      // Function to check if all notifications have been processed
      const checkNotificationsProcessed = () => {
        notificationCounter++;
        console.log(
          'notificationCounter::',
          notificationCounter,
          learnerNotifications
        );
        if (notificationCounter === group.learners.length + 1) {
          //+1 include trainer
          console.log('learnerNotifications:', learnerNotifications);
          // +1 for the trainer notification
          this.triggerMessageQueue(group, learnerNotifications);
        }
      };

      // Schedule notifications for the trainer
      scheduler.scheduleJob(String(group.trainer_id), rule, async function () {
        console.log('inside schedule:::::::::', group.learners[0].topic_id);

        const trainerObj = {
          id: group.trainer_id,
          topic_id: group.learners[0].topic_id, // Modify this based on your data
          start_at: group.learners[0].start_at,
          end_at: group.learners[0].end_at, // Modify this based on your data
          unique_id: group.learners[0].unique_id, // Modify this based on your data
        };
        console.log('Trainer Notification:', trainerObj);
        // Push trainer notification to the learnerNotifications array
        learnerNotifications.push(trainerObj);
        // If all learner notifications have been processed, trigger the MessageQueue
        checkNotificationsProcessed();
      });
      console.log('between:::::::::::::::::');
      // Schedule notifications for learners within the group
      group.learners.forEach(async (learner) => {
        console.log('learner.start_at:::group', learner.start_at, learner.id);
        const rule = await this.scheduleEachTopic(learner.start_at);
        console.log('rule:::::::scheduleEachTopic', rule);
        scheduler.scheduleJob(String(learner.id), rule, async function () {
          console.log('Learner Notification:', learner);
          learnerNotifications.push(learner);
          console.log('learnerNotifications:::', learnerNotifications);
          // If all learner notifications have been processed, trigger the MessageQueue
          checkNotificationsProcessed();
        });
      });
    } catch (error) {
      console.log('error::::', error);
    }
  }

  public async timeFormat(date) {
    console.log('d.start_at:::', date);
    const dateTime = moment(date);
    // Get only the time portion (hours, minutes, and seconds)
    const timeString = dateTime.format('HH:mm:ss');
    const splitTheTime = timeString.split(':');
    const hr = splitTheTime[0];
    const min = splitTheTime[1];
    const sec = splitTheTime[2];
    console.log({ hr, min, sec });
    return { hr, min, sec };
  }

  // Function to trigger the MessageQueue
  public async triggerMessageQueue(group, learnerNotifications) {
    // You can send the combined notifications for the entire group here
    console.log('Group:', group);
    console.log('Combined Notifications:', learnerNotifications);
    const messageQueue = new MessageQueue();
    messageQueue.send(learnerNotifications);
  }

  // 0 remove from min/hr

  public formatValue(value) {
    const intValue = parseInt(value, 10); // Convert to integer
    return intValue < 10 ? String(intValue) : value; // Remove leading zero if less than 10
  }

  public async scheduleEachTopic(row) {
    console.log('row.start_at::', row);
    try {
      // Parse the input date using Moment.js

      const dateTime = moment(row);

      // Subtract 15 minutes
      const modifiedDateTime = dateTime.subtract(15, 'minutes');

      // Format the result back to 'YYYY-MM-DDTHH:mm:ss.SSSZ' format
      const result = modifiedDateTime.toISOString();
      const { hr, min, sec } = await this.timeFormat(result);

      console.log('jnsjsnjsns:', hr, min, sec);
      const rule = new scheduler.RecurrenceRule();

      rule.hour = this.formatValue(hr);
      rule.minute = this.formatValue(min);
      rule.second = this.formatValue(sec);
      rule.tz = 'Asia/Kolkata';
      console.log('ruess:', rule);
      return rule;
    } catch (error) {
      console.log('error', error);
    }
  }

  // Function to group data by trainer
  public async groupDataByTrainer(data) {
    const groupedData = new Map();

    data.forEach((row) => {
      const trainerId = row.trainer_id;

      // Create an object for the learner
      const learnerObj = {
        id: row.learner_id,
        topic_id: row.topic_id,
        start_at: row.start_at,
        end_at: row.end_at,
        unique_id: row.unique_id,
      };

      // Initialize or add to the group for the trainer
      if (!groupedData.has(trainerId)) {
        groupedData.set(trainerId, {
          trainer_id: trainerId,
          learners: [],
        });
      }

      // Add the learner object to the trainer's group
      groupedData.get(trainerId).learners.push(learnerObj);
    });

    return Array.from(groupedData.values());
  }
}
