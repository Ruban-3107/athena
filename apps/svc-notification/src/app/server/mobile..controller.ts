import axios from 'axios';
import { HttpException } from '@athena/shared/exceptions';

class MobileController {
  public details;

  constructor(details) {
    this.details = details;
  }

  public async send() {
    const url =
      process.env.provider +
      process.env.apiKey +
      process.env.type +
      this.details.contact +
      process.env.sendpath +
      process.env.templateName;
    console.log('came::::::::: send');
    try {
      const { data } = await axios({ url: url, method: 'GET' });
      console.log('data::::', data);

      return data;
    } catch (error) {
      throw new HttpException(409, error);
    }
  }

  public async verify() {
    const url =
      process.env.provider +
      process.env.apiKey +
      process.env.type +
      process.env.verifypath +
      this.details.contact +
      `/${this.details.otp}`;
    console.log(url);
    try {
      const { data } = await axios({ url: url, method: 'GET' });
      console.log('/////////', data);
      if (data.Status == 'Success') {
        return true;
      }
    } catch (error) {
      throw new HttpException(409, 'Something went wrong');
    }
  }
}

export default MobileController;
