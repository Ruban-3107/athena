/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../interface/auth.interface';
import { User } from '../interface/users.interface';
import NotificationService from '../service/notifications.service';
import {
  responseCF,
  bodyCF,
  codeValue,
} from '../../../../../libs/commonResponse/commonResponse';

class NotificationController {
  public notificationService = new NotificationService();

  /**
   * API endpoint to get notifications for a user
   * Path: /notifications
   * Method: POST
   * Request Body:
   * {
   *   "pageNo": number // Specifies the page number for pagination (optional)
   * }
   * Response:
   * {
   *   "data": Array // Array of notification data
   *   "dataCount": number // Total number of notifications returned
   * }
   */
  public notifications = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userDataFromToken: User = req.user;
      // console.log(userDataFromToken.id, '---user-data');
      const userId = userDataFromToken.id;
      const page = req.body.pageNo; // Parse the page parameter from the request body, default to 1 if not specified
      const limit = 10; // Set the limit to 10 notifications per page

      // Call the notificationService to retrieve the notifications for the specified user, with pagination
      const {  getInAppNotificationData,NotViewedNotificationCount }: any =
        await this.notificationService.get(userId, limit, page);
      // const viewedCount = getInAppNotificationData.filter(data=> data.viewed === false)

      // Prepare the response with the retrieved notification data and data count
      const response = responseCF(
        bodyCF({
          val: {
            data: getInAppNotificationData,
            dataCount: getInAppNotificationData.length,
            notViewedCount: NotViewedNotificationCount,
          },
          code: '600',
          status: 'success',
          message: `Get Notications Successfully`,
        })
      );

      // Send the response back to the client
      return res.json(response);
    } catch (error) {
      // Handle any errors that occur during the request
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '625',
          status: 'error',
          message: `${error.message}`,
        })
      );

      // Send an error response back to the client
      return res.json(response);
    }
  };

  public notificationsViewed = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userDataFromToken: User = req.user;
      const userId = userDataFromToken.id;
      const setViewedtrue = await this.notificationService.view(Number(userId));
      // Prepare the response with the retrieved view status
      if (setViewedtrue.length > 0) {
        const response = responseCF(
          bodyCF({
            code: '600',
            status: 'success',
            message: `view updated successfully!!`,
          })
        );

        // Send the response back to the client
        return res.json(response);
      } else {
        const response = responseCF(
          bodyCF({
            code: '600',
            status: 'success',
            message: `Not update check query!!`,
          })
        );

        // Send the response back to the client
        return res.json(response);
      }
    } catch (error) {
      // Handle any errors that occur during the request
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '625',
          status: 'error',
          message: `${error.message}`,
        })
      );

      // Send an error response back to the client
      return res.json(response);
    }
  };

  public createNotification = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    console.log('req.bosy::', req.body, req.user['dataValues'].id);

    try {
      const ids =req.body.ids ?? "";
      const body = req.body;
      body['user_ids'] = ids;
      body['created_by']=body['status']=='reminder_schedule' ? 'reminder_schedule' : req.user['dataValues'].id;
      delete body['ids'];

      const createNotify = await this.notificationService.create(body);

      const response = responseCF(
        bodyCF({
          code: '600',
          status: 'success',
          message: `notification created successfully!!`
        })
      );

      // Send the response back to the client
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '625',
          status: 'error',
          message: `${error.message}`,
        })
      );

      // Send an error response back to the client
      return res.json(response);
    }
  };

  public acceptAndDeclineNotification = async( req: RequestWithUser,
    res: Response,
    next: NextFunction)=>{

      const body=req.body;
      const token = req.user.id

      try{
        if(req.body.status == "accept"){
          console.log("accept")

        }else if(req.body.status == "declined"){
          const findUser = await this.notificationService.declineSevice(body,token)
          const response = responseCF(
            bodyCF({
              code: '600',
              status: 'success',
              message: `notification created successfully!!`,
            })
          )


        }

      }catch(error){
        const response = responseCF(
          bodyCF({
            val: 'error',
            code: '625',
            status: 'error',
            message: `${error.message}`,
          })
        );
  
        // Send an error response back to the client
        return res.json(response);
           
      }

    }
}

export default NotificationController;
