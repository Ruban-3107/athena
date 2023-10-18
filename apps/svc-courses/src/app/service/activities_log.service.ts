import DB from '../database/index';
import { Activities_log } from '../interface/activities_log.interface';
import { CreateActivitiesDto } from '../dto/activities_log.dto';
import {HttpException} from '@athena/shared/exceptions';
import { Op } from 'sequelize';
import { apiRequestHandlerWithTransaction } from '@athena/shared/common-functions';
import { PATHS, USERS_SERVICE_PORT, USERS_SERVICE_URL } from '../config/index';

class ActivitieslogService {
    public activitieslog = DB.DBmodels.activities_log;

    public getPagingData = (data, page, limit, total = null) => {
      const { rows } = data;
      const totalItems = total;
      const totalItemsPerPage = rows.length;
      const currentPage = page ? +page : 0;
      const totalPages = Math.ceil(totalItems / limit);
      return { totalItems, totalItemsPerPage, rows, totalPages, currentPage };
    };

    public async findAllActivities(): Promise<Activities_log[]> {
        const allActivities: Activities_log[] = await this.activitieslog.findAll({
        });
        return allActivities;
    }
    
    public async createActivities(
        activitiesData: CreateActivitiesDto,
      ): Promise<Activities_log> {
        let result;
      try {
          console.log("act-----serviceessss");
          
            const createactivitiesData: Activities_log = await this.activitieslog.create({
                ...activitiesData
            }) 
            const fetchActivities: Activities_log = await this.activitieslog.findOne({
                where: { id: createactivitiesData.id },
              });
            return fetchActivities;
        } catch (error) {
          console.log('activitieserrorrrrr', error);
          throw new HttpException(400, error?.message);
        }
        return result;
      }

    public async filterActivities(req: any,token:string): Promise<any[]> {
        try {
          console.log(req, '---oooostatus0000---');
    
          const defaultFilterParams = {
            role: 'all',
            activity: 'all',
            module_type: 'all',
            time_duration: 'all',
            pageNo: 1,
            size: 10,
          };
    
          // Merge defaults to the req param
          req = { ...defaultFilterParams, ...req };
    
          let where: any = {};
    
          if (req.activity !== 'all') {
            where.action = req.activity;
          }
    
          if (req.module_type !== 'all') {
            where.module_type = req.module_type;
          }
    
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
              const today = currentDate.getDay();
              startDate = new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000); // 6 days prior to current date
              endDate = currentDate;
              break;
            case 'Yesterday':
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
    
          if (req.time_duration !== 'all') {
            where.created_at = {
              [Op.between]: [startDate, endDate],
            };
          }
    
          const totalActivities = await this.activitieslog.count();
          // console.log('fffffffffff', totalActivities, req.pageNo, req.size);
    
          const limit = req.size;
          const offset = (req.pageNo - 1) * limit;
    
          // console.log('fffffffffff', limit, offset);
    
          console.log('where', where, limit, offset);
          const response: any = await this.activitieslog.findAndCountAll({
            where: where,
            limit,
            offset,
            distinct: true,
            // include: [
            //   {
            //     model: this.users,
            //     as: 'activitylog_user',
            //     include: [
            //       {
            //         model: this.roles,
            //         as: 'user_roles',
            //         // where: userRoles,
            //       },
            //     ],
            //   },
            // ],
          });
          for(const i of response.rows){
            const item = {
              users: [
                { activitylog_user: i.user_id },
              ],
            };
            const userData = await apiRequestHandlerWithTransaction(
              `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}/${PATHS.GETUSERS}`,
              token,
              'POST',
              item,
              false
              // t
            );
            if (userData?.status === 'success') {
              i['dataValues']['activitylog_user'] = userData?.value?.activitylog_user;
            }
          }
    
          // console.log('Response query:', response);
    
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
}




export default ActivitieslogService;