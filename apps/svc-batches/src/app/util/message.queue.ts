import {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PUB_NOTIFICATION,
  REDIS_PUB_NOTIFICATION_1,
  REDIS_PASSWORD
} from '../config/index';
import ScheduleService from '../service/schedules.service';

import * as redis from 'redis';
let publisher;
// let producer;
let subscribers;
let subscriber;
const url = `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;

export class MessageQueue {
  constructor() {
    console.log(
      '<<<<<<<<<<<-------------MsgExchange Batch Service---------------->>>>>>>>>>>>>>'
    );
  }

  public async subscriber() {
    try {
      subscribers = redis.createClient({
        url: url,
      });
      subscriber = subscribers.duplicate();
      subscriber.connect();
      subscriber.on('ready', () => {
        console.log('Subscriber Ready in Batch service');
        this.consumer();
      });

      subscriber.on('error', (error) => {
        console.log('Subscriber in Batch service error', error);
      });
    } catch (error) {
      console.log('Subscriber in Batch service error', error);
    }
  }

  public async consumer() {
    try {
      subscriber.subscribe(REDIS_PUB_NOTIFICATION_1, async (message) => {
        console.log('message:::::::::message in notification');
        const data: any = JSON.parse(message);
        const scheduleService = new ScheduleService();
        scheduleService.reminderNotification(data);
      });
    } catch (error) {
      console.log('Consumer in Batch service error', error);
    }
  }

  public async publisher() {
    try {
      publisher = redis.createClient({
        url: url,
      });
      publisher.connect();
      publisher.on('ready', () => {
        console.log('Publisher Ready in Batch service');
      });
      publisher.on('error', (error) => {
        console.log('Publisher in Batch service error', error);
      });
    } catch (error) {
      console.log('publisher in Batch service error', error);
    }
  }

  public async send(message) {
    try {
      await publisher.publish(
        REDIS_PUB_NOTIFICATION,
        JSON.stringify(message),
        (err, data) => {
          if (err) {
            console.log('error in publishing data in batch service', err);
          } else {
            console.log('successfully send to batch-service');
          }
        }
      );
      // publisher.quit();
    } catch (error) {
      console.log('error in publish date in Batch service', error);
    }
  }
}
