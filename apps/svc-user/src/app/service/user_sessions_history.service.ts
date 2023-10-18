import { Request } from 'express-serve-static-core';
import { userSessionsHistory } from '../interface/user_sessions_history.interface';
import DB from '../database/index';
import { HttpException } from '@athena/shared/exceptions';
import { isEmpty } from '../util/util';
import { Op, Sequelize } from 'sequelize';

class UserSessionsHistoryService {
  public userSessionsHistory = DB.DBmodels.user_sessions_history;
  public users = DB.DBmodels.users;
  public roles = DB.DBmodels.roles;

  public getPagingData = (data, page, limit, total = null) => {
    const { rows } = data;
    const totalItems = total?.length;
    const totalItemsPerPage = rows.length;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, totalItemsPerPage, rows, totalPages, currentPage };
  };

  public async filterUserSessionsHistoryService(req: any): Promise<any[]> {
    // try {
    //     let finduserSessionsHistory: userSessionsHistory[] = await this.userSessionsHistory.findAll();
    //     console.log("eeeeeeeeeeeeee",finduserSessionsHistory);
    //     return finduserSessionsHistory;

    //  }catch(err){
    //     console.log(err);
    //  }

    try {
      const defaultFilterParams = {
        role: 'all',
        time_duration: 'all',
        pageNo: 1,
        size: 10,
      };

      // Merge defaults to the req param
      req = { ...defaultFilterParams, ...req };

      const where: any = {};

      const currentDate = new Date();
      let startDate, endDate;

      switch (req.time_duration) {
        case 'Last 30 Days':
          startDate = new Date(
            currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
          );
          endDate = currentDate;
          break;
        case 'Last Two Weeks':
          startDate = new Date(
            currentDate.getTime() - 14 * 24 * 60 * 60 * 1000
          );
          endDate = currentDate;
          break;
        case 'Last Week':
          startDate = new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000); // 6 days prior to current date
          endDate = currentDate;
          break;
        case 'Yesterday':
          // eslint-disable-next-line no-case-declarations
          const yesterday = new Date(
            currentDate.getTime() - 24 * 60 * 60 * 1000
          ); // Get yesterday's date
          startDate = new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            0,
            0,
            0,
            0
          ); // Set start time to yesterday 12:00 am
          endDate = new Date(
            yesterday.getFullYear(),
            yesterday.getMonth(),
            yesterday.getDate(),
            23,
            59,
            59,
            999
          ); // Set end time to yesterday 11:59 pm

          break;
        case 'Today':
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            0,
            0,
            0,
            0
          ); // Set start time to yesterday 12:00 am
          endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            23,
            59,
            59,
            999
          );
          break;
      }

      const totalUserSessionsHistory = await this.userSessionsHistory.count();
      console.log(
        'fffffffffff',
        totalUserSessionsHistory,
        req.pageNo,
        req.size
      );

      const limit = req.size;
      const offset = (req.pageNo - 1) * limit;

      // console.log('fffffffffff', limit, offset);

      where.field = {
        [Op.or]: ['Sign_In', 'Sign_Out'],
      };

      if (req.time_duration !== 'all') {
        where.created_at = {
          [Op.between]: [startDate, endDate],
        };
      }
      // console.log('fffffffffff', where, limit, offset);

      const response = await this.userSessionsHistory.findAndCountAll({
        attributes: [
          'user_id',
          [
            Sequelize.fn(
              'MAX',
              Sequelize.col('userSessionsHistory.created_at')
            ),
            'last_signin_date',
          ],
          [
            Sequelize.fn(
              'MAX',
              Sequelize.literal(
                "CASE WHEN field = 'Sign_Out' THEN userSessionsHistory.created_at ELSE null END"
              )
            ),
            'last_signout_date',
          ],
          'user_name',
          'user_roles',
        ],
        where: where,
        limit,
        offset,
        // include: [
        //   {
        //     model: this.users,
        //     as: 'datahistory_user',
        //     attributes: ['id', 'name', 'roles'],
        //     include: [
        //       {
        //         model: this.roles,
        //         as: 'user_roles',
        //       },
        //     ],
        //   },
        // ],
        group: [
          'userSessionsHistory.user_id',
          'userSessionsHistory.user_name',
          'userSessionsHistory.user_roles',
        ],
      });

      // const response = await this.userSessionsHistory.findAndCountAll({
      //   attributes: [
      //     'user_id',
      //     [
      //       Sequelize.fn('MAX', Sequelize.col('userSessionsHistory.created_at')),
      //       'last_signin_date',
      //     ],
      //     [
      //       Sequelize.fn(
      //         'MAX',
      //         Sequelize.literal(
      //           "CASE WHEN field = 'Sign_Out' THEN userSessionsHistory.created_at ELSE null END"
      //         )
      //       ),
      //       'last_signout_date',
      //     ],
      //   ],
      //   where: {
      //     field: {
      //       [Op.or]: ['Sign_In', 'Sign_Out'],
      //     },
      //   },
      //   group: ['userSessionsHistory.user_id'],
      //   distinct: true, // add this to remove duplicates
      //   include: [
      //     {
      //       model: this.users,
      //       as: 'datahistory_user',
      //       include: [
      //         {
      //           model: this.roles,
      //           as: 'user_roles',
      //           // where: userRoles,
      //         },
      //       ],
      //     },
      //   ],
      // });

      console.log('Response query:', response);

      // Get the required data in proper format
      const allUser: any = this.getPagingData(
        response,
        req.pageNo,
        limit,
        response.count
      );

      return allUser;
      // } else {
      //   throw new HttpException(400, 'Status not found');
      // }
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }

  public async createUserSessionsHistory(userData: any) {
    try {
      console.log(userData, '----dataUser----');
      
      if (isEmpty(userData))
        throw new HttpException(400, 'userSessionsHistory is empty');
      const createUserSessionsHistoryObj: userSessionsHistory =
        await this.userSessionsHistory.create(userData);
      return createUserSessionsHistoryObj;
    } catch (err) {
      console.log(err);
    }
  }
}

export default UserSessionsHistoryService;
