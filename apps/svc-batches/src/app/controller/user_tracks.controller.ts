import { NextFunction, Request, Response } from 'express';
import { UserTrack } from '../interface/user_tracks.interface';
// import { User } from '@interfaces/users.interface';
import userTrackService from '../service/user_tracks.service';
import HttpResponse from '../../../../../libs/shared/modules/src/lib/Response/HttpResponse';
// import { RequestWithUser } from '@athena/shared/middleware';
import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';
class UserTracksController {
  public userTrackService = new userTrackService();

  public getMyTracks = async (req: any, res: Response, next: NextFunction) => {
    console.log('get my tracks:::::::::::::::::::::');
    try {
      const userData: any = req.user;
      const userId = Number(userData.id);
      const trackId = Number(req.params.track_id);
      const childId = Number(req.params.child_id);
      const token = req.token;
      console.log('before:::::::::::::::::::::::::::');
      const data: UserTrack | UserTrack[] =
        await this.userTrackService.getMyTracks(userId, trackId, childId,token);
      const response = responseCF(
        bodyCF({
          code: '601',
          status: 'success',
          val: data,
        })
      );
      return res.json(response);

      // const httpResponse = HttpResponse.get({ data });
      // res.status(200).json(httpResponse)
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'false',
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  public joinTrack = async (req, res: Response, next: NextFunction) => {
    try {
      const userArray = [],
        trackArray = [];
      const token = req?.token;
      if (!req.body.users && req?.params?.track_id) {
        console.log('innnnnnnnnnnnn', req?.user?.id);
        userArray.push(req?.user?.id);
        trackArray.push(req?.params?.track_id);
      }
      // const userData = [720048];
      // const trackId = req.params.track_id;
      const userData = userArray.length > 0 ? userArray : req.body.users;
      const trackId = trackArray.length > 0 ? trackArray : req.body.tracks;
      const batchId = req.params.batch_id ?? null;

      console.log('contr', userData, trackId);
      const data = await this.userTrackService.joinTrack(
        userData,
        trackId,
        batchId,
        token
      );
      const response = responseCF(
        bodyCF({
          code: '601',
          status: 'success',
          val: data,
        })
      );
      return res.json(response);

      // const httpResponse = HttpResponse.get({ data });
      // res.status(200).json(httpResponse)
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'false',
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  public updateTrackCourseSummaryData = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData: any = req.user;

      const userId = Number(userData.id);
      // const trackId = Number(req.params.track_id);
      const params = req.params;

      const data = await this.userTrackService.updateUserTrackCourseSummaryData(
        userId,
        params
      );

      const httpResponse = HttpResponse.get({ data });
      res.status(200).json(httpResponse);
    } catch (error) {
      next(error);
    }
  };
}

export default UserTracksController;
