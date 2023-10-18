import { HttpException } from '@athena/shared/exceptions';
import DB from '../database';
import {
  USERS_SERVICE_PORT,
  USERS_SERVICE_URL,
  
  GET_TEMPLATE,
} from '../config/index';
import { apiRequestHandler } from '@athena/shared/common-functions';

const eventEnum = Object.freeze({
  otp: 'Otp',
  register: 'New_registration',
});

export class MessageSchema {
  public event;
  public contact;
  public contactType;
  public templateName;
  public token;
  public messageObj = {};
  public users = [];

  public details;

  constructor(details) {
    console.log('details32332:', details.data);
    this.token = details.token;
    this.templateName = details.templateName;
    this.details = details.data;
    this.messageObj['messageExchange'] = 'Schedule';
  }

  public async getSchema() {
    try {
      await this.getTemplate();
      return this.messageObj;
    } catch (error) {
      throw new HttpException(401, error);
    }
  }

  public async getTemplate() {
    try {
    
      const getTemplate = await apiRequestHandler(
        `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${GET_TEMPLATE}`,
        this.token,
        'POST',
        { template_name: this.templateName }
      );
      if (getTemplate.value.template) {
        this.users = [];

        for (let i = 0; i < this.details.length; i++) {
          let obj = {};
          const mapTemplate = await this.mapWordsInTempalte(
            getTemplate.value.template,
            this.details[i]
          );

          obj = {
            template: mapTemplate,
            contact: this.details[i].email,
            subject: getTemplate.value.subject,
          };

          this.users.push(obj);
        }

        this.messageObj['users'] = this.users;

        return this.messageObj;
      }
    } catch (err) {
      throw new HttpException(400, err);
    }
  }

  public mapWordsInTempalte = (template, details) => {

    const mapObj = {
      '{{first_name}}': details.first_name,
      '{{last_name}}': details.last_name ? details.last_name : '',
      '{{password}}': details.password,
      '{{host_url}}': details.host_url,
      '{{email}}': details.contact,
      '{{otp}}': details.otp,
      '{{employee_name}}': details.employee_name,
      '{{token}}': details.token,
      '{{expiry}}': details.expiry,
      '{{user_name}}': details.user_name,
      '{{date}}': details.date,
      '{{start_time}}': details.start_time,
      '{{end_time}}': details.end_time,
      '{{link}}': details.host_url,
      '{{batch_name}}':details.batch_name,
      '{{topic_name}}': details.topic_name,
      '{{name}}': details.name ? details.name : 'user',
      '{{trainer_name}}' : details.trainer_name ? details.trainer_name : 'trainer',

    };
    const templateMsg = template.replace(
      /{{first_name}}|{{last_name}}|{{password}}|{{host_url}}|{{email}}|{{otp}}|{{user_name}}|{{token}}|{{expiry}}|{{employee_name}}|{{date}}|{{start_time}}|{{end_time}}|{{link}}|{{topic_name}}|{{name}}|{{batch_name}}|{{trainer_name}}/gi,
      function (matched) {
        return mapObj[matched];
      }
    );
    return templateMsg;
  };

  public messageEvent() {
    switch (this.event) {
      case 'otp':
        this.messageObj['event'] = eventEnum.otp;
        break;
      case 'register':
        this.messageObj['event'] = eventEnum.register;
        break;
    }
  }
}
