import axios from 'axios';
import { HttpException } from '@athena/shared/exceptions';
import DB from '../database/index';
import AuthService from '../service/auth.service';
import { MessageSchema } from '../util/messageSchema';
import { MessageQueue } from '../util/message.queue';

class MobileService {
  public users = DB.DBmodels.users;
  public AuthService = new AuthService();

  public async sendOtp(phoneNumber) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const findUser: any = await this.users.findOne({
      where: { phone_number: phoneNumber },
      include: 'userRoles',
    });
    if (!findUser)
      throw new HttpException(
        409,
        `This mobile number ${phoneNumber} not yet registered`
      );

    if (findUser.dataValues.is_password_changed === false) {
      throw new HttpException(
        409,
        `Please check your email and change the password first`
      );
    } else {
      // if(app==true || app==false){
      if (findUser) {
        const url =
          process.env.provider +
          process.env.apiKey +
          process.env.type +
          phoneNumber +
          '/AUTOGEN3' +
          process.env.templateName;
        try {
          const { data } = await axios({ url: url, method: 'GET' });
          return data;
        } catch (error) {
          throw new HttpException(409, error);
        }
      } else {
        throw new HttpException(
          400,
          'You are not authorized to access this site.'
        );
      }
    }
  }
  public async verifyOtp(phoneNumber, otp) {
    const findUser: any = await this.users.findOne({
      where: { phone_number: phoneNumber },
      include: 'userRoles',
    });
    if (!findUser)
      throw new HttpException(
        409,
        `This phone number ${phoneNumber} doesn't exist`
      );



    const url =
      process.env.provider +
      process.env.apiKey +
      process.env.type +
      process.env.verifypath +
      phoneNumber +
      `/${otp}`;
    console.log(url);
    try {
      const { data } = await axios({ url: url, method: 'GET' });
      let tokenData;
      console.log('/////////', data);
      if (data.Status == 'Success') {
        const tokenData = this.AuthService.createToken(findUser);
        const cookie = this.AuthService.createCookie(tokenData);
      }
      return tokenData;
    } catch (error) {
      throw new HttpException(409, 'Something went wrong');
    }
  }
}

export default MobileService;
