import { REDIS_PUB_NOTIFICATION,REDIS_HOST,REDIS_PORT,REDIS_PASSWORD} from '../config';
import * as redis from 'redis';
let publisher;
const url = `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`


export class MessageQueue {
  constructor() {
    console.log('<<<messagequeue User service publisher>>>');
  }

  public connect() {
    try {
      publisher = redis.createClient({ url: url});
      publisher.connect();
      publisher.on('ready', () => {
        console.log('Publisher Ready in User service');
      });
      publisher.on('error', (error) => {
        console.log('Publisher in User service error', error);
      });
    } catch (error) {
      console.log('publisher in User service error', error);
    }
    
  }

  public async send(message){

    try {
      console.log("REDIS_PUB_NOTIFICATION",REDIS_PUB_NOTIFICATION,(message))
     await  publisher.publish(REDIS_PUB_NOTIFICATION, JSON.stringify(message),(err,reply)=>{
        if(err){
          console.error('Error publishing message:', err);
        }else{
          console.log("user service successfully published to notification service:",REDIS_PUB_NOTIFICATION)
        }
      });
      // publisher.quit();
    } catch (error) {
      console.log('error in publish date in User service', error);
    }

  }
}
