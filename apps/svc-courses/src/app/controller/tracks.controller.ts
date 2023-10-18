import { NextFunction, Request, Response } from 'express';
import { CreateTrackDto } from '../dto/tracks.dto';
import { Track } from '../interface/tracks.interface';
import trackService from '../service/tracks.service';
import HttpResponse from '../../../../../libs/shared/modules/src/lib/Response/HttpResponse';
import { SECRET_KEY } from '../config';
import jwt from 'jsonwebtoken';
import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';
import { RequestWithUser } from '../interface/routes.interface';

class TracksController {
  public trackService = new trackService();
  public getTracks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log('req.params.id::::::::::::::', req.params.id);
      const trackId: number | null = Number(req.params.id) ?? null;
      const childId: number | null = Number(req.params.child_id) ?? null;
      // const type = req.params.type;
      const status = req?.params?.status ?? null;
      const type = req?.params?.type ?? null;
      console.log('ssssssssssss', status);
      const data: Track | Track[] = await this.trackService.getTracks(
        trackId,
        childId,
        status,
        type,
      );
      const response = responseCF(
        bodyCF({
          val: data,
          code: '600',
          status: 'success',
        })
      );

      return res.json(response);
      // const httpResponse = HttpResponse.get({ data });
      // res.status(200).json(httpResponse);
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
  public getTracksWithChapterOrChild = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log('req.params.id::::::::::::::', req.query, req.query.searchKey, req.params.id);
      const trackId: number | null = Number(req.params.id);
      const course_type: string | null = req.params.course_type;
      // const type = req.params.type;
      const searchKey: any  = req.query.searchKey;
      const data: Track | Track[] =
        await this.trackService.getTracksWithChapterOrChild(
          trackId,
          course_type, searchKey
        );
      const response = responseCF(
        bodyCF({
          val: data,
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
          status: 'false',
        })
      );
      console.log(error);
      return res.json(response);
    }
  };
  public getTracksbyduration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dateRangeType = req.params.dateRangeType ?? null;
      console.log('zzzzzz', dateRangeType);

      const findAllTrackData: Track[] =
        await this.trackService.getTracksbyduration(dateRangeType);

      const response = responseCF(
        bodyCF({
          val: { trackData: findAllTrackData },
          code: 'searchAPI',
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
      console.log(error);
      return res.json(response);
    }
  };

  public createTrack = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // const userDataFromToken: User = req.user;
      // const { body, files }: any = req;
      // const token: any = req.token;

      const { body, token, user: userDataFromToken } = req;
      // if (files.certificate_upload) {
      if (body.image_url) {
        const option =
          req.params?.option && req.params?.option === 'childthroughtrack'
            ? req.params?.option
            : null;
        console.log('qqqqqqqqqqq', res.headersSent);
        const createTrackData: Track = await this.trackService.createTrack(
          body,
          userDataFromToken,
          token,
          option
        );
        console.log('wwwwwwwwwww', res.headersSent, createTrackData);
        try {
          const response = responseCF(
            bodyCF({
              message: 'created',
              code: '601',
              status: 'success',
              val: createTrackData,
            })
          );
          console.log('before response::::::::::::::::::::::::::::::::::');
          console.log('llllll', response);
          // if (!res.headersSent) {
          return res.json(response);
          // }
        } catch (error) {
          console.log('responseeeeeeerrrrrr', error);
        }
      } else {
        const response = responseCF(
          bodyCF({
            message: 'Please Upload Cover Image',
            code: '611',
            status: 'error',
          })
        );
        // if (!res.headersSent) {
        return res.json(response);
        // }
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      console.log('ggggg', error);
      return res.json(response);
    }
  };

  public updateTrackStatus = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // const trackId = Number(req.params.id);
      const trackIds = req.body.ids;
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      console.log(jwtToken, '----jwttoken----');
      const decoded = jwt.verify(jwtToken, secret);
      console.log(decoded['name'], '----decodeedddeddd-----');
      const approvedBy = decoded['id'];
      const updatedtracks = [];
      console.log('popiuytrtyuiop', trackIds,);
      for (const trackData of trackIds) {
        const updateTrackStatus = await this.trackService.updateTrackStatus(
          trackData, approvedBy
        );
        updatedtracks.push(updateTrackStatus)
      }

      const response = responseCF(
        bodyCF({
          val: { userData: updatedtracks },
          code: '600',
          status: 'success',
          message: 'Track updated successfully',
        })
      );
      return res.json(response);
    } catch (err) {
      console.log('error', err);
    }
  };

  public updateTrack = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const trackId = Number(req.params.id);
      const trackData: CreateTrackDto = req.body;
      const updateType = req.params.update_type ?? null;
      console.log('qqqqqqqq', trackId, trackData, updateType);

      if (req?.body?.status) {
        console.log("statttssssssusssssstraaackk");
        console.log("trackkksssdaaataaaa", trackId, trackData)
        const updateTrackStatus = await this.trackService.updateStatus(
          trackId,
          trackData
        )
        const response = responseCF(
          bodyCF({
            val: { userData: updateTrackStatus },
            code: '600',
            status: 'success',
            message: 'Track updated successfully',
          })
        );
        return res.json(response);
      }

      const updateTrackData: Track = await this.trackService.updateTrack(
        trackId,
        trackData,
        updateType
      );
      const response = responseCF(
        bodyCF({
          message: 'updated',
          code: '601',
          status: 'success',
          val: updateTrackData,
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
      console.log(error);
      return res.json(response);
    }
  };

  public publishTracks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const trackIds = req.body.ids;
      const trackStatus = req.body.trackStatus;
      let error;
      const arrOfPublishedTracks = [];
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      console.log(jwtToken, '----jwttoken----');
      const decoded = jwt.verify(jwtToken, secret);
      console.log(decoded['name'], '----decodeedddeddd-----');
      const approvedBy = decoded['id'];
      console.log(trackIds, '---potic data-----');
      for (const userData of trackIds) {
        console.log(userData, '--0userData0');
        const publishTopics: Track[] = await this.trackService.publishTracks(
          userData,
          approvedBy,
          trackStatus
        );
        console.log(publishTopics, '---publish topic--');
        arrOfPublishedTracks.push(publishTopics);
      }
      const response = responseCF(
        bodyCF({
          val: { userData: arrOfPublishedTracks },
          code: '600',
          status: 'success',
          message: 'Track Id found successfully',
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
      console.log(error);
      return res.json(response);
    }
  };
  public deleteTrack = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      const decoded = jwt.verify(jwtToken, secret);
      const deletedBy = decoded['id'];
      const trackIds = req.body.ids;

      const promises = trackIds.map(async (trackId) => {
        const deletedTrack = await this.trackService.deleteTrack(
          trackId,
          deletedBy
        );
        return { id: trackId, topic: deletedTrack };
      });
      // Waits for all promises to resolve
      const deletedTopics = await Promise.all(promises);

      // Returns the deleted topics in the response
      const response = responseCF(
        bodyCF({
          val: { userData: deletedTopics },
          code: '600',
          status: 'success',
          message: 'Topics deleted successfully',
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
      console.log(error);
      return res.json(response);
    }
  };

  /**Filter by track_type*/
  public searchAndFilterTracks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // let track_type = req.params.track_type;
      const filteredTracks: Track[] =
        await this.trackService.searchAndFilterTracks(req.params.track_type);
      res.status(200).json({
        data: filteredTracks,
        message: 'filtered Tracks',
        status: 'success',
      });
    } catch (error) {
      if (error.status === 404) {
        res
          .status(error.status)
          .json({ data: null, message: error.message, status: 'success' });
      } else next(error);
    }
  };

  /**Search tracks bro!!*/
  public searchTracks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const foundTracksData: Track[] = await this.trackService.searchTracks(
        req.body
      );

      const response = responseCF(
        bodyCF({
          code: '600',
          val: foundTracksData,
          status: 'success',
          message: 'tracks searchAPI',
        })
      );

      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '611',
          status: 'error',
          message: error.message,
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  public newSearchAndFilterTracks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let response: any;
    let message: string;

    try {
      const { limit } = req.query;
      let newFoundTracks: any = [];

      newFoundTracks = await this.trackService.newSearchTracks(
        req.query,
        Number(limit)
      );
      message = 'New Search Tracks success';

      response = responseCF(
        bodyCF({
          message,
          val: { tracksData: newFoundTracks },
          code: 600,
          status: 'success',
        })
      );
    } catch (error) {
      response = responseCF(
        bodyCF({
          message: error.message,
          code: 611,
          status: 'fail',
        })
      );
    }

    console.log(')))))', req.query);
    return res.json(response);
  };
  public newSearchAndFilterCourses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let response: any;
    let message: string;
    try {
      let newFoundTracks: any = [];

      const queryObject: any = req.query;
      newFoundTracks = await this.trackService.newSearchCourses(queryObject);
      message = 'Search Courses success';

      response = responseCF(
        bodyCF({
          message,
          val: { coursesData: newFoundTracks },
          code: 600,
          status: 'sucess',
        })
      );
    } catch (error) {
      response = responseCF(
        bodyCF({
          message: error.message,
          code: 611,
          status: 'fail',
        })
      );
    }
    return res.json(response);
  };

  public getNeededTracks = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log('in controllerrrsssss');

      const token: any = req.user;
      let tracksData = [];
      console.log('controllersssss', req.body.tracks);

      tracksData = await this.trackService.getNeededTracks(
        req.body.tracks,
        token
      );
      const response = responseCF(
        bodyCF({
          code: '600',
          val: { tracksData },
          status: 'success',
          message: 'All Requested Tracks',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '611',
          status: 'error',
          message: error.message,
        })
      );
      console.log(error);
      return res.json(response);
    }
  };
}

export default TracksController;
