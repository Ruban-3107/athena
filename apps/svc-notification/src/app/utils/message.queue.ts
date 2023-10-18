import {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PUB_NOTIFICATION,
  REDIS_PUB_NOTIFICATION_1,
  REDIS_PASSWORD
} from '../config/index';
import MessageExchangeProcessing from '../config/messageExchange.processing';
import * as redis from 'redis';
let publisher;
let subscribers;
let subscriber;
const url = `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`

export class MessageQueue {
  constructor() {
    console.log(
      '<<<<<<<<<<<-------------MsgExchange Consumer Notification---------------->>>>>>>>>>>>>>'
    );
  }

  public subscriber() {
    try {
      subscribers = redis.createClient({url: url, });
      subscriber = subscribers.duplicate();
      subscriber.connect();
      subscriber.on('ready', () => {
        console.log('Subscriber Ready in Notification service');
        this.consumer();
      });
      
      subscriber.on('error', (error) => {
        console.log('Subscriber in Notification service error', error);
      });
    } catch (error) {
      console.log('Subscriber in Notification service error', error);
    }

  }

  public async consumer() {
    try {
      subscriber.subscribe(REDIS_PUB_NOTIFICATION, async (message) => {
        const data: any = JSON.parse(message);
        const messageExchangeProcessing = new MessageExchangeProcessing(data);
        await messageExchangeProcessing.processmsg();
      });
    } catch (error) {
      console.log('Consumerr in Notification service error', error);
    }
  }

  public async publisher() {
    try {
      publisher = redis.createClient({ url: url });
      publisher.connect();
      publisher.on('ready', () => {
        console.log('Publisher Ready in Notification service');
      });
      publisher.on('error', (error) => {
        console.log('Publisher in Notification service error', error);
      });
    } catch (error) {
      console.log('publisher in Notification service error', error);
    }
  }

  public async send(message) {
    try {
       publisher.publish(REDIS_PUB_NOTIFICATION_1, JSON.stringify(message),(err,reply)=>{
        if(err){
          console.log("error in notification publish",err)
        }else{
          console.log("send successfully in notification publish")
        }
      });
      // publisher.quit();
    } catch (error) {
      console.log('error in publish date in notifiction service', error);
    }
  }
}
