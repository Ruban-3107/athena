import { NextFunction, Request, Response } from 'express';
import { SignInDto } from '../dto/auth.dto';
import { User } from '../interface/users.interface';
import AuthService from '../service/auth.service';
import { RequestWithUser } from '../interface/auth.interface';
import { SignUpDto, setPasswordDto, forgetPasswordDto } from '../dto/auth.dto';
import { customSplit, generateString } from '../util/util';
import {
  responseCF,
  bodyCF,
  codeValue,
} from '../../../../../libs/commonResponse/commonResponse';
import MobileService from '../service/mobile.service';
import { MessageSchema } from '../util/messageSchema';
import { MessageQueue } from '../util/message.queue';
import crypto from 'crypto';
import moment from 'moment';
import { createClient } from 'redis';
import { REDIS_PASSWORD,REDIS_HOST, REDIS_PORT} from '../config/index'
const url = `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
const client = createClient({
  // url: 'redis://:redis123@localhost:6379/2'
  url: url ,
});

class AuthController {
  public authService = new AuthService();
  public mobileService = new MobileService();
  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = req.query.role ?? 'Learner'; //depends on how they are sending from front end
      const userData: SignUpDto = req.body;
      const mailHandle: any = customSplit(userData.email, '@', 0);
      const handle: any = `${mailHandle}_${generateString(4)}`;
      userData.handle = handle;
      const createdUserData = await this.authService.signup(userData, role);
      console.log(createdUserData, '=> Created User Data');
      const response = responseCF(
        bodyCF({
          code: '600',
          status: 'success',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      console.log(response, ' => Error in catch of AuthController');
      return res.json(response);
    }
  };

  public createTokenById = async (req:Request,res:Response,next:NextFunction)=>{
    try{
      const {tokenData,findUser} = await this.authService.createTokenBasedOnId(req.body.id)
      const response = responseCF(
        bodyCF({
          code: '600',
          status: 'success',
          val:{token:tokenData,user:findUser}
        })
      );
      return res.json(response);

    }catch(error){
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      console.log(response, ' => Error in catch of AuthController');
      return res.json(response);

    }
  }

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: SignInDto = req.body;
      const { cookie, tokenData } = await this.authService.signIn(userData);
      const refreshToken = tokenData.refresh_token;
      const accessToken = tokenData.access_token;
      const response = responseCF(
        bodyCF({
          val: { access_token: accessToken, refresh_token: refreshToken },
          code: '600',
          status: 'success',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      return res.json(response);
    }
  };

  public signOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const logOutUserData: User = await this.authService.signOut(req, res);
      const response = responseCF(
        bodyCF({
          val: logOutUserData,
          code: '600',
          status: 'success',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      return res.json(response);
    }
  };
  public getOTP = () =>
    new Promise(
      (
        res // crypto.randomBytes(size[, callback])
      ) =>
        crypto.randomBytes(4, (err, buffer) => {
          res(parseInt(buffer.toString('hex'), 16).toString().substr(0, 4));
        })
    );

  public async redisOtpStore(email, token) {
    const expirationTime = moment().unix() + 60 * 10;
    try {
      await client.connect(); // redis connect and store in redis db to set expiration time
      client.setEx(email, 60 * 1000, `${expirationTime}:${token}`);
      client.quit();
      return token;
    } catch (error) {
      return error;
    }
  }

  public sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const emailRegex = /\S+@\S+\.\S+/;
      const input = req.body.input;
      const app = req.body.is_admin_app;
      let result: any;
      if (!input) {
        const response = responseCF(
          bodyCF({
            message: 'Missing input',
            code: '611',
            status: 'error',
          })
        );
        return res.json(response);
      }
      const details = {
        contactType: emailRegex.test(input) ? 'email' : 'mobile',
        contact: input,
        event: 'otp_send',
        templateName: emailRegex.test(input) ? 'login_with_otp' : '',
        otp: emailRegex.test(input) ? await this.getOTP() : '',

      };
      if (emailRegex.test(input)) {
        // result = await this.authService.sendOtp(input,"email"); // to send otp to email
        await this.redisOtpStore(details.contact, details.otp);
      }
      const messageSchema = await new MessageSchema(details);
      const message = await messageSchema.getSchema();
      console.log('kkkkkk:', message);
      const messageQueue = await new MessageQueue();
      await messageQueue.send(message);
      // else {
        // result = await this.mobileService.sendOtp(input); // to send otp to phone.no
      // }

      const response = responseCF(
        bodyCF({
          val: result,
          code: '600',
          status: 'success',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      console.log('Error response in sendOtp controller==>', error);
      return res.json(response);
    }
  };

  public verifyOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const input = req.body.input;
      const verifyOtp = req.body.otp;
      const emailRegex = /\S+@\S+\.\S+/;
      let verify: any;
      if (!input) {
        const response = responseCF(
          bodyCF({
            message: 'Missing input',
            code: '611',
            status: 'error',
          })
        );
        return res.json(response);
      }
      if (!verifyOtp) {
        const response = responseCF(
          bodyCF({
            message: 'Missing otp',
            code: '611',
            status: 'error',
          })
        );
        return res.json(response);
      }
      if (emailRegex.test(input)) {
        verify = await this.authService.verifyOtp(input, verifyOtp);
      } else {
        verify = await this.mobileService.verifyOtp(input, verifyOtp);
      }
      const response = responseCF(
        bodyCF({
          val: verify,
          code: '600',
          status: 'success',
          message: 'OTP verified',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      return res.json(response);
    }
  };

  public verifyRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refreshToken = req.body.refreshToken;
      const accessToken = req.cookies['Authorization'];
      const {
        cookie,
        tokenData: { verifiedRefreshToken },
      } = await this.authService.verifyToken(refreshToken, accessToken);
      res.setHeader('Set-Cookie', [cookie]);
      const response = responseCF(
        bodyCF({
          val: { verifiedRefreshToken },
          code: '600',
          status: 'success',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      return res.json(response);
    }
  };

  public validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { token: resetLink } = req.body;
      const tokenValid = await this.authService.validateToken(resetLink);
      if (tokenValid) {
        const response = responseCF(
          bodyCF({
            code: '600',
            status: 'success',
            message: 'valid token',
          })
        );
        return res.json(response);
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      return res.json(response);
    }
  };

  public forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData: forgetPasswordDto = req.body;
      if (!userData.email) {
        const response = responseCF(
          bodyCF({
            message: 'Missing input',
            code: '611',
            status: 'error',
          })
        );
        return res.json(response);
      }
      const passwordForgot = await this.authService.forgotPassword(userData);
      console.log(passwordForgot, '----kolo');

      if (passwordForgot) {
        const response = responseCF(
          bodyCF({
            code: '600',
            status: 'success',
            val: passwordForgot,
            message: 'Password link has been sent to your email successfully',
          })
        );
        return res.json(response);
      } else {
        const response = responseCF(
          bodyCF({
            message: 'error in resetting the password',
            code: '611',
            status: 'error',
          })
        );
        return res.json(response);
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      return res.json(response);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log('pore');

      const { token: resetLink, confirmPassword: newPassword } = req.body;
      console.log(req.body, '----body----');
      if (!req.body.token) {
        const response = responseCF(
          bodyCF({
            message: 'Token missing',
            code: '611',
            status: 'error',
          })
        );
        return res.json(response);
      }
      const passwordChanged = await this.authService.resetPassword(
        resetLink,
        newPassword
      );
      let response;
      if (passwordChanged) {
        response = responseCF(
          bodyCF({
            code: '600',
            status: 'success',
            message: 'Your password has been changed successfully',
          })
        );
        return res.json(response);
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: error,
          message: error.message.message,
          code: '611',
          status: 'error',
        })
      );
      return res.json(response);
    }
  };

  public setPassword = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const passwordData: setPasswordDto = req.body;
      console.log(passwordData, '----opdoinew');
      if (passwordData.password !== passwordData.confirm_password) {
        const response = responseCF(
          bodyCF({
            message: 'confirm password not matching',
            code: '611',
            status: 'error',
          })
        );
        return res.json(response);
      }
      const createUserData: User = req.user;
      const passwordUpdate = await this.authService.setPassword(
        passwordData,
        createUserData
      );
      if (passwordUpdate) {
        const response = responseCF(
          bodyCF({
            code: '600',
            status: 'success',
            message: 'Password updated successfully!',
          })
        );
        return res.json(response);
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      return res.json(response);
    }
  };
}
export default AuthController;
