import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
  pool: true,
  maxConnections: 1,
  maxMessages: 5,
});

class EmailController {
  public message;

  constructor(message) {
    this.message = message;
  }

  public async send() {
   
    this.sendMail(this.message);
  }

  public async sendMail(data: any) {
    try {
      let mailSent: any = { success: false };
      if (this.message['messageExchange'] == 'Schedule') {
        mailSent = await this.sendThroughSMTPSchedule(data);
      } else if (this.message['messageExchange'] == 'Register') {
        mailSent = await this.sendThroughSMTP(data);
      }

      return mailSent;
    } catch (error) {
      console.log('////', error);
    }
  }

  public async sendThroughSMTP(data) {
    try {
      console.log('asdfgdsasdfedf', data);

      return new Promise(function (resolve, reject) {
        const messages = [];

        messages.push({
          from: process.env.ATHENA_MAIL_SENDER,
          to: data['contact'],
          subject: data['subject'],
          html: data['template'],
        });

        while (transporter.isIdle() && messages.length) {
          transporter.sendMail(messages.shift(), (err, info) => {
            if (err) {
              console.log('mail error', err);
            } else {
              console.log('Email sent:', info);
            }
          });
        }
      });
    } catch (error) {
      console.log('notification server error', error);
    }
  }

  public async sendThroughSMTPSchedule(data) {
    try {
      console.log('Number of users:', data.users.length);

      const sendPromises = data.users.map(async (user) => {
        const info = await transporter.sendMail({
          from: process.env.ATHENA_MAIL_SENDER,
          to: user.contact,
          subject: user.subject,
          html: user.template,
        });
        console.log('Email sent:', info);
      });

      await Promise.all(sendPromises);
      console.log('All emails sent successfully.');
    } catch (error) {
      console.log('Error sending emails:', error);
    }
  }
}

export default EmailController;
