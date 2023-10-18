import { NextFunction, Request, Response } from 'express';
import {
    bodyCF,
    responseCF,
} from '../../../../../libs/commonResponse/commonResponse';
import { CreateActivitiesDto } from '../dto/activities_log.dto';
import activitieslogService from '../service/activities_log.service';
import { Activities_log } from '../interface/activities_log.interface';
import { RequestWithUser } from '../interface/auth.interface';


class ActivitieslogController {
    public activitieslogService = new activitieslogService();

    public getActivities = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const findAllChaptersData: Activities_log[] =
                await this.activitieslogService.findAllActivities();
            const response = responseCF(
                bodyCF({
                    val: findAllChaptersData,
                    code: '600',
                    status: 'success',
                    message: 'Chapters found successfully',
                })
            );
            console.log("hhhhhhhhhhhhhhhhhhhhh", response)
            return res.json(response);
        } catch (error) {
            const response = responseCF(
                bodyCF({
                    code: '610',
                    status: 'error',
                    message: `${error}`,
                })
            );
            return res.json(response);
        }
    }

    public createActivities = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            console.log("activitiessssssbodyyyyy",req.body);
            const activitiesData: CreateActivitiesDto = req.body;
            console.log('entered actvities_log controller reqbody: ', activitiesData);
            // let createChapterData: Chapter;
                const createActivitiesData: Activities_log = await this.activitieslogService.createActivities(activitiesData);
                const response = responseCF(
                    bodyCF({
                        val: createActivitiesData,
                        code: '600',
                        status: 'success',
                        message: 'Activities_log Created successfully',
                    })
                );
                console.log("ssssssssssssss", response)
                return res.json(response);

        } catch (error) {
            const response = responseCF(
                bodyCF({
                    code: '610',
                    status: 'error',
                    message: `${error}`,
                })
            );
            return response
        }
    }

    public getActivitiesBasedOnFilterAndSearch = async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
      ) => {
        try {
          // if (req.body.searchkey) {
          //   console.log('here');
          //   const foundTopicsData: any[] = await this.ActivitiesService.searchTopics(
          //     req.body
          //   );
          //   const response = responseCF(
          //     bodyCF({
          //       val: { topicData: foundTopicsData },
          //       code: '600',
          //       status: 'search success',
          //     })
          //   );
    
          //   return res.json(response);
          // } else {
          const sortUserData: any[] = await this.activitieslogService.filterActivities(
            req.body,req.token
          );
          const response = responseCF(
            bodyCF({
              val: { activityData: sortUserData },
              code: '600',
              status: 'filter success',
            })
          );
          return res.json(response);
        } catch (error) {
          // }
          const response = responseCF(
            bodyCF({
              message: error.message,
              code: '611',
              status: 'error',
            })
          );
          console.log(error);
          return res.json(response);
        }
      };
}

export default ActivitieslogController;