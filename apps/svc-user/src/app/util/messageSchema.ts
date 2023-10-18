import { HttpException } from '@athena/shared/exceptions';
import DB from '../database';

const eventEnum = Object.freeze({
  otp: 'Otp',
  register: 'New_registration',
});

export class MessageSchema {
  public event;
  public contact;
  public contactType;
  public templateName;
  public messageObj = {};
  public users = DB.DBmodels.users;
  public template = DB.DBmodels.template;
  public details;

  constructor(details) {
    this.event = details.event;
    this.contact = details.contact;
    this.contactType = details.contactType ? details.contactType :"email";
    this.messageObj['messageExchange'] = 'Register';
    this.templateName = details.templateName;
    this.messageObj['contactType'] = details.contactType ? details.contactType :'email';
    this.messageObj['contact'] = details.contact;
    this.messageObj['event']=details.event;
    this.details = details;
   if(details.otp)  this.messageObj['otp'] =details.otp;
  }

  public async getSchema() {
    try {
      // this.messageEvent();
      await this.getUserDetails();
      await this.getTemplate();
      console.log('this.message::::', this.messageObj);
      return this.messageObj;
    } catch (error) {
      throw new HttpException(401, error);
    }
  }

  public async getTemplate() {
    try {
      if (this.templateName) {
        const get = await this.template.findOne({
          where: { template_name: this.templateName },
        });
        const mapTemplate = await this.mapWordsInTempalte(
          get['dataValues'].template,
          this.details
        );
        // const mapTemplate = get['dataValues'].template
        console.log("get['dataValues'].subject:", get['dataValues']);
        this.messageObj['subject'] = get['dataValues'].subject;
        return (this.messageObj['template'] = mapTemplate);
      }
    } catch (err) {
      throw new HttpException(400, err);
    }
  }

  public mapWordsInTempalte = (template, details) => {
    console.log('mapWordsInTempalte obj sent --->>>>');
    const mapObj = {
      '{{first_name}}': details.first_name,
      '{{last_name}}': details.last_name,
      '{{password}}': details.password,
      '{{host_url}}': details.host_url,
      '{{email}}': details.contact,
      '{{otp}}': details.otp,
      '{{employee_name}}':details.employee_name,
      '{{token}}':details.token,
      '{{expiry}}':details.expiry,
      '{{user_name}}':details.user_name
    };
    const templateMsg = template.replace(
      /{{first_name}}|{{last_name}}|{{password}}|{{host_url}}|{{email}}|{{otp}}|{{user_name}}|{{token}}|{{expiry}}|{{employee_name}}/gi,
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

  public async getUserDetails() {
    if (this.event === 'otp_send' || this.event === 'otp_verify') {
      const key = this.contactType == 'email' ? 'email' : 'phone_number';
      const where = {
        [key]: this.contact,
      };
      const findUser: any = await this.users.findOne({
        where,
        include: 'userRoles',
      });
      if (!findUser) {
        throw new HttpException(
          409,
          `This email ${this.contactType} not yet registered`
        );
      }
      if (findUser.dataValues.is_password_changed === false) {
        throw new HttpException(
          409,
          `Please check your email and change the password first`
        );
      } else {
        if (findUser) {
          return this.messageObj['user_details']= findUser;
        } else {
          throw new HttpException(
            400,
            'You are not authorized to access this site.'
          );
        }
        // }
      }
    } 
    return;
  }
}
