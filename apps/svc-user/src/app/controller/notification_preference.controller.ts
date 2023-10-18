import { NextFunction, Request, Response } from 'express';
import { NotificationsPreferences } from '../interface/notification_preference.interface';
import NotificationPreferenceService from '../service/notification_preference.service';
import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';
import { SECRET_KEY } from '../config';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from '../interface/auth.interface';

class NotificationPreferenceController {
  public NotificationPreferenceService = new NotificationPreferenceService();

  public getNotificationPreference = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      const decoded = jwt.verify(jwtToken, secret);
      const userRole = decoded['role'];
      const names = userRole.map((obj) => obj.name);
      console.log(names, '----names----');
      const findAllNotificationPreference: NotificationsPreferences[] =
        await this.NotificationPreferenceService.findAllNotificationPreference(
          userRole
        );
      const response = responseCF(
        bodyCF({
          val: findAllNotificationPreference,
          code: '600',
          status: 'success',
          message: `Get Notification Preference Executed Successfully`,
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '625',
          status: 'error',
          message: `${error.message},error in get notification preference`,
        })
      );
      return res.json(response);
    }
  };

  public updateNotificationPreference = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      const decoded = jwt.verify(jwtToken, secret);
      const userRole = decoded['role'];
      const names = userRole.map((obj) => obj.name);
      console.log(names, '----naghjgjmes----');
      const notificationPreferenceEnableIds = req.body.enable_ids;
      const notificationPreferenceDisableIds = req.body.disable_ids;
      console.log(
        notificationPreferenceEnableIds,
        '--------notificationPreferenceEnableIds---------'
      );
      if (names.includes('Super Admin')) {
        console.log('admin in ');
        if (notificationPreferenceDisableIds) {
          for (const notificationPreferenceDisableId of notificationPreferenceDisableIds) {
            console.log(
              notificationPreferenceDisableId,
              '-----Disable-data------'
            );
            await this.NotificationPreferenceService.updateNotificationPreference(
              null,
              notificationPreferenceDisableId
            );
          }
        }
        if (notificationPreferenceEnableIds) {
          for (const notificationPreferenceEnableId of notificationPreferenceEnableIds) {
            console.log(
              notificationPreferenceEnableId,
              '-----Enable-data------'
            );
            await this.NotificationPreferenceService.updateNotificationPreference(
              notificationPreferenceEnableId,
              null
            );
          }
        }
        const response = responseCF(
          bodyCF({
            code: '600',
            status: 'success',
            message: `Update Notification Preference Executed Successfully`,
          })
        );
        return res.json(response);
      } else {
        const response = responseCF(
          bodyCF({
            code: '611',
            status: 'error',
            message: 'Invalid User',
          })
        );
        return res.json(response);
      }
    } catch (error) {
      console.log('Catch Block Error: ', error);
      const response = responseCF(
        bodyCF({
          val: error,
          code: '611',
          status: 'error',
          message: 'Invalid User',
        })
      );
      return res.json(response);
    }
  };
}

export default NotificationPreferenceController;
