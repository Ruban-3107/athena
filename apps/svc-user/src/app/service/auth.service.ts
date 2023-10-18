import { compare, hash } from 'bcrypt';
import { Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import {
  SECRET_KEY,
  RESET_PASSWORD_KEY,
  CLIENT_URL,
  HOST_IP_FRONT,
  REDIS_PASSWORD,REDIS_HOST,
  REDIS_PORT,

} from '../config';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line @nx/enforce-module-boundaries
import DB from '../database/index';
import { SignInDto, setPasswordDto, forgetPasswordDto } from '../dto/auth.dto';
import { HttpException } from '@athena/shared/exceptions';
import {
  DataStoredInToken,
  TokenData,
  TokenValidate,
} from '../interface/auth.interface';
import { User } from '../interface/users.interface';
import { RequestWithUser } from '../interface/auth.interface';
import { isEmpty } from '../util/util';
import { SignUpDto } from '../dto/auth.dto';
import UserEventEmitter from '../../app/event/user/basic';
import crypto from 'crypto';
import eventEmitter from '../event';
import { Sequelize, where, Op } from 'sequelize';
import { userSessionHistory } from '../event/user/user_history';

// import client from '../../../../../libs/shared/redisconnect/src/lib/shared-redisconnect'
//import redis from 'redis';
import moment from 'moment';
import bcrypt from 'bcrypt';
import { createClient } from 'redis';
// import {
//   REDIS_HOST,
//   REDIS_PORT,
//   REDIS_DATABASE,
// } from '../../../../../apps/svc-user/src/app/config';
import { Request } from 'express-serve-static-core';
import { log } from 'console';
import { MessageQueue } from '../util/message.queue';
import { Http } from 'winston/lib/winston/transports';
const url = `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
const client = createClient({
  // url: 'redis://:redis123@localhost:6379/2'
  url:url,
});

class AuthService {
  public users = DB.DBmodels.users;
  public roles = DB.DBmodels.roles;
  public userSessionHistory = DB.DBmodels.user_sessions_history;
  public notificationsPreferences = DB.DBmodels.notifications_preferences;
  public userProfiles = DB.DBmodels.user_profiles;

  public async signup(
    userData: SignUpDto,
    role: any
  ): Promise<{ createdUserData: any }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    const findUser: any = await this.users.findOne({
      where: { email: userData.email },
    });
    if (findUser) throw new HttpException(409, `This email already exists`);
    const findUserWithPhoneNumber: any = await this.users.findOne({
      where: { phone_number: userData.phone_number },
    });
    console.log('ffffffffffff', findUserWithPhoneNumber);
    if (findUserWithPhoneNumber)
      throw new HttpException(409, `This mobile number already exists`);
    if (userData.email === userData.personal_email)
      throw new HttpException(
        409,
        `Primary email and secondary email shouldn't be same`
      );
    const password = (
      length = 8,
      wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
    ) =>
      Array.from(crypto.randomFillSync(new Uint32Array(length)))
        .map((x: any) => wishlist[x % wishlist.length])
        .join('');
    const user_password = password();
    const hashedPassword = await hash(user_password, 10);
    if (!userData['users_type']) {
      userData['users_type'] = 'Individual';
    }
    userData['first_name'] = userData['first_name'].toLowerCase();
    userData['last_name'] = userData['last_name'].toLowerCase();
    const name: string = userData['first_name'].concat(
      ' ',
      userData['last_name']
    );
    userData['name'] = name;
    if (userData) {
      const emitData = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        work_email: userData.email,
        password: user_password,
      };
      console.log('hetettetetetetet1221313');
      eventEmitter.emit('new_user_created', emitData);
    } else {
      throw new HttpException(409, `email doesn't sent`);
    }
    const createUserData: any = await this.users.create({
      ...userData,
      encrypted_password: hashedPassword,
    });
    const notificationsPreferences: any =
      await this.notificationsPreferences.findAll();
    const userNotifications = notificationsPreferences.map(
      (x) => x.dataValues.notification_type
    );

    const createUserProfile = await this.userProfiles.create({
      user_id: createUserData.id,
      first_name: createUserData.first_name,
      last_name: createUserData.last_name,
      contact_email: createUserData.email,
      phone_number: createUserData.phone_number,
      preferences: userNotifications,
    });
    console.log('createUserProfile ==>', createUserProfile);
    const { id, is_password_changed } = createUserData;
    const userSessionHistoryData = { id, is_password_changed, name };
    userSessionHistory('create', userSessionHistoryData, role); // sign-in & sign-up logs storing in user_sessions_history

    if (!userData.roles) {
      const roles1 = [];
      const roles: any = await this.roles.findOne({ where: { name: role } });
      roles1.push(roles['dataValues'].id);
      try {
        this.users.findByPk(createUserData.id).then(async (user) => {
          try {
            await user.setUserRoles(roles1);
          } catch (error) {
            console.log('error in auth.service catch==> ', error);
          }
        });
      } catch (error) {
        console.log('error in auth.service catch==> ', error);
      }
    }

    if (createUserData.users_type == 'Individual') {
      await this.users.update(
        { created_by: createUserData.id },
        { where: { id: createUserData.id } }
      );
    }

    if (createUserData) {
      const emitData = {
        first_name: createUserData.first_name,
        last_name: createUserData.last_name,
        work_email: createUserData.email,
        password: user_password,
      };
      console.log('hetettetetetetet');
      eventEmitter.emit('new_user_created', emitData);
    }
    return createUserData;
  }

  public async associateRoles(userId: number, roles: string) {
    // if (isEmpty(userId)) throw new HttpException(400, "User doesn't exist");
    const roles2 = await this.roles.findAll({
      where: { id: { [Op.in]: roles } },
    });

    const mapIds = roles2?.map((x) => x['dataValues'].id);
    try {
      this.users.findByPk(userId).then(async (user) => {
        await user.setUserRoles(mapIds);
      });
    } catch (error) {
      console.log('error in auth.service catch==> ', error);
    }
  }

  public async sendOtp(email: any, type: any): Promise<object> {
    const findUser: any = await this.users.findOne({
      where: { email },
      include: 'userRoles',
    });
    if (!findUser) {
      throw new HttpException(409, `This email ${email} not yet registered`);
    }
    if (findUser.dataValues.is_password_changed === false) {
      throw new HttpException(
        409,
        `Please check your email and change the password first`
      );
    } else {
      if (findUser) {
        const getOTP = () =>
          new Promise(
            (
              res // crypto.randomBytes(size[, callback])
            ) =>
              crypto.randomBytes(4, (err, buffer) => {
                res(
                  parseInt(buffer.toString('hex'), 16).toString().substr(0, 4)
                );
              })
          );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const token: any = await getOTP();
        const emitData = {
          work_email: email,
          otp: token,
        };

        try {
          eventEmitter.emit('login_with_otp', emitData); // to send otp via email
          const messageQueue = new MessageQueue();
          messageQueue.connect();
          const message = {
            event: 'login_with_otp',
            emitData: {
              type,
              work_email: email,
              otp: token,
            },
          };
          messageQueue.send(message);

          const expirationTime = moment().unix() + 60 * 10;
          try {
            await client.connect(); // redis connect and store in redis db to set expiration time
            client.setEx(email, 60 * 1000, `${expirationTime}:${token}`);
            client.quit();
            return token;
          } catch (error) {
            return error;
          }
        } catch (error) {
          return error;
        }
      } else {
        throw new HttpException(
          400,
          'You are not authorized to access this site.'
        );
      }
      // }
    }
  }

  public async verifyOtp(email, verifyotp) {
    const findUser: any = await this.users.findOne({ where: { email } });
    if (!findUser)
      throw new HttpException(409, `This email ${email} doesn't exist`);
    let verified = false;
    await client.connect();
    const value = await client.get(email);
    if (value == null) {
      return { message: 'Time expired please resend OTP' };
    }
    client.disconnect();
    const [expirationTime, storedOtp] = value.split(':');
    const currentTime = moment().unix();
    if (currentTime <= Number(expirationTime)) {
      if (Number(storedOtp) === Number(verifyotp)) {
        verified = true;
      }
    }
    let tokenData;
    if (verified == true) {
      tokenData = this.createToken(findUser);
      const cookie = this.createCookie(tokenData);
    } else {
      throw new HttpException(409, `OTP not matched`);
    }
    return tokenData;
  }

  public async createTokenBasedOnId(id: any) {
    try {
      const findUser: any = await this.users.findOne({ where: { id: id } });
      if (findUser) {
        const tokenData = this.createToken(findUser);

        return {tokenData,findUser};
      }else{
        throw new HttpException(401,'user not found')
      }
    } catch (error) {
      throw new HttpException(401,error)
    }
   
  }

  public async signIn(
    userData: SignInDto
  ): Promise<{ cookie: string; tokenData: any }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    const field = userData.email
      ? {
          where: { email: userData.email },
          include: 'userRoles',
        }
      : {
          where: { phone_number: userData.phone_number },
          include: 'userRoles',
        };

    const findUser: any = await this.users.findOne(field);

    console.log('came::::::::::::::::::::');

    if (!findUser)
      throw new HttpException(
        409,
        `This ${
          userData.email
            ? 'email' + ' ' + userData.email
            : userData.phone_number
            ? 'mobile number' + ' ' + userData.phone_number
            : 'user'
        } was not found`
      );
    if (
      findUser.is_active == 'in active' ||
      findUser.is_active == 'pending approval'
    )
      throw new HttpException(409, 'You are not authorized to login');
    const isPasswordMatching: boolean = await compare(
      userData.password,
      findUser.encrypted_password
    );
    if (!isPasswordMatching) {
      throw new HttpException(409, 'Invalid credentials');
    }
    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);
    const secret = SECRET_KEY;
    const decoded = jwt.verify(tokenData.access_token, secret);
    const decodedToken: any = decoded;
    console.log(decoded, '----deocde');

    const roles = decodedToken?.role?.map((x) => x.name);
    await this.userSessionHistory.create({
      sign_in_at: new Date(),
      user_id: decodedToken.id,
      field: 'Sign_In',
      is_email_verified: true,
      is_password_changed: true,
      user_name: `${decodedToken?.first_name} ${decodedToken?.last_name}`,
      user_roles: roles,
    });
    return { cookie, tokenData };
  }

  public async signOut(req: RequestWithUser, res: Response): Promise<User> {
    try {
      const userData: any = JSON.parse(JSON.stringify(req.user));
      console.log('/////////////////////', userData);
      const roles = userData?.user_roles?.map((x) => x.name);
      await this.userSessionHistory.create({
        sign_out_at: new Date(),
        user_id: userData.id,
        field: 'Sign_Out',
        is_email_verified: true,
        is_password_changed: true,
        user_name: `${userData?.first_name} ${userData?.last_name}`,
        user_roles: roles,
      });

      req.user = null;
      return req.user;
    } catch (err) {
      console.log('error', err);
    }
  }

  public createToken(user: any): TokenData {
    console.log(user, '----user-----');

    const name = user.first_name + ' ' + user.last_name;
    const dataStoredInToken: DataStoredInToken = {
      id: user.id,
      name: name,
      email: user.email,
      phone_number: user.phone_number,
      isPasswordChanged: user.is_password_changed,
      role: user.userRoles,
      first_name: user.first_name,
      last_name: user.last_name,
      handle: user.handle,
      client_id: user.client_id,
    };
    const secretKey: string = SECRET_KEY;
    const access_expiresIn = 1800000;
    const refresh_expiresIn = 1800000;
    console.log('access_expiresIn:::::,', access_expiresIn);
    return {
      access_token: sign(dataStoredInToken, secretKey, {
        expiresIn: access_expiresIn,
      }),
      refresh_token: sign(dataStoredInToken, secretKey, {
        expiresIn: refresh_expiresIn,
      }),
    };
  }

  //to verify refresh token
  public async verifyToken(
    refreshToken: string,
    accessToken: string
  ): Promise<{ cookie: string; tokenData: any }> {
    const secretKey: string = SECRET_KEY;
    const access_uid: any = verify(accessToken, secretKey);
    const refresh_id: any = verify(refreshToken, secretKey);
    if (access_uid.id === refresh_id.id) {
      const tokenData = this.createToken(access_uid.id);
      const cookie = this.createCookie(tokenData);
      return { cookie, tokenData };
    }
  }

  public async forgotPassword(userData: forgetPasswordDto): Promise<any> {
    if (!userData.email) throw new HttpException(400, 'Provide valid email');
    const findUser: any = await this.users.findOne({
      where: { email: userData.email },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    const link_expiresIn: number = 5 * 60;
    const token = sign({ id: findUser.id }, RESET_PASSWORD_KEY, {
      expiresIn: link_expiresIn,
    });
    const mailData = {
      work_email: findUser.email,
      first_name: findUser.first_name,
      url: HOST_IP_FRONT,
      token: token,
      expiry: link_expiresIn / 60,
    };
    try {
      console.log('ttttttttttttttttt');
      UserEventEmitter.emit('change_password', mailData);
      const updateUser: any = await this.users.update(
        { resetpassword: token },
        { where: { id: findUser.id } }
      );
      return token;
    } catch (error) {
      throw new HttpException(400, error);
    }
  }

  public async resetPassword(link, newPassword): Promise<any> {
    try {
      if (!link) throw new HttpException(401, 'Authentication error');
      const tokenValid = verify(link, RESET_PASSWORD_KEY);
      if (tokenValid) {
        const user: any = await this.users.findOne({
          where: { resetpassword: link },
        });
        if (user) {
          const hashedPassword = await hash(newPassword, 10);
          await this.users.update(
            { encrypted_password: hashedPassword, is_password_changed: true },
            { where: { id: user.id } }
          );
          return true;
        } else throw new HttpException(401, `user not found`);
      } else throw new HttpException(401, `incorrect token or expired`);
    } catch (error) {
      console.log('error in resetPassword', error);
      throw new HttpException(401, error);
    }
  }

  public async validateToken(link): Promise<any> {
    if (!link) throw new HttpException(401, 'Authentication error');
    const tokenValid = verify(link, RESET_PASSWORD_KEY);
    if (!tokenValid) throw new HttpException(401, `token expired`);
    return true;
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.access_token}; HttpOnly; Max-Age=${tokenData.access_expiresIn};`;
  }

  public async setPassword(passwordData: setPasswordDto, createUserData: User) {
    if (isEmpty(createUserData)) throw new HttpException(400, 'Token is empty');
    const isPasswordMatching: boolean = await compare(
      passwordData.old_password,
      createUserData.encrypted_password
    );
    if (isPasswordMatching) {
      if (passwordData.password === passwordData.confirm_password) {
        const hashedPassword = await hash(passwordData.password, 10);
        const userObj: any = await this.users.findOne({
          order: [['athena_id', 'DESC']],
        });
        const athena_id =
          userObj.athena_id == null ? '0000001' : userObj.athena_id;
        console.log('athena_id:::::::', athena_id);
        const athena_id1 = '' + userObj.athena_id;
        let temp = '';
        for (let i = 0; i < athena_id1.length; i++) {
          if (!isNaN(athena_id.charAt(0))) {
            temp = temp + athena_id[i];
          }
        }
        if (temp === '9999999') {
          temp = 'A000001';
        } else {
          const a = parseInt(temp) + 1;
          const temp1 = '' + a;
          temp =
            athena_id.substring(0, athena_id.length - temp1.length) + temp1;
        }
        passwordData['athena_id'] = temp;
        await this.userSessionHistory.update(
          { is_password_changed: true },
          { individualHooks: true, where: { id: createUserData.id } }
        );
        await this.users.update(
          {
            encrypted_password: hashedPassword,
            is_password_changed: true,
            password_updated_at: Date.now(),
          },
          { individualHooks: true, where: { id: createUserData.id } }
        );
      }
      return { createUserData };
    } else {
      throw new HttpException(409, 'Invalid Old Password');
    }
  }
}

export default AuthService;
