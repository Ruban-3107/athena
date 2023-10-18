import EmailController from '../server/email.controller';

class MessageProcessing {
  public message;

  constructor(message) {
    this.message = message;
  }

  public async processmsg() {
    console.log('message processing:',this.message.users.length);
      const emailController = new EmailController(this.message);
      await emailController.send();
    
  }
}

export default MessageProcessing;
