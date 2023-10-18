import EmailController from '../server/email.controller';
import MobileController from '../server/mobile..controller';

class RegisterProcessing {
  public contactType;
  public contact;
  public message;
  public event;

  constructor(message) {
    console.log('message: in Register', message);
    this.contactType = message['contactType'];
    this.contact = message['contact'];
    this.message = message;
    this.event = message['event'];
  }

  public async processmsg() {
    switch (this.contactType) {
      case 'email':
        if (this.contact) {
          const emailController = new EmailController(this.message);
          await emailController.send();
        }
        break;
      case 'mobile':
        if (this.contact) {
          const mobileController = new MobileController(this.message);
          console.log('this.event:::', this.event);

          if (this.event == 'otp_send') {
            await mobileController.send();
          } else if (this.event == 'otp_verify') {
            await mobileController.verify();
          }
        }
        break;
    }
  }
}

export default RegisterProcessing;
