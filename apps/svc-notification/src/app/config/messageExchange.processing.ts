import MessageProcessing from './message.processing';
import RegisterProcessing from './register.processing';
import { SchedulerJob } from './scheduler';

class MessageExchangeProcessing {
  public message;
  public exchange;

  constructor(message) {
    this.message = message;
    this.exchange = this.message['messageExchange'];
  }
  public async processmsg() {
    console.log('this is in processmsg');
    if (this.exchange === 'Register') {
      console.log('this is in Register');
      const message = new RegisterProcessing(this.message);
      message.processmsg();
    } else if (this.exchange === 'Schedule') {
      const message = new MessageProcessing(this.message);
      message.processmsg();
    } else if (this.exchange == 'reminder') {
      const scheduler = new SchedulerJob();
      scheduler.scheduleNotify(this.message.user);
    }
  }
}

export default MessageExchangeProcessing;
