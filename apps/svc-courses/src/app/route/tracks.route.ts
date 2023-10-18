import { Router,NextFunction } from 'express';
import TracksController from '../controller/tracks.controller';
import { Routes } from '../interface/routes.interface';
import { CreateTrackDto } from '../dto/tracks.dto';
import authMiddleware from '../middleware/auth.middleware';
import {
  generateTopicUrl,
  generateTopicUrlForTrack,
  validationMiddleware,
} from '@athena/shared/middleware';

// import { generateTopicUrl, generateTopicUrlForTrack } from '../middleware/generateTopicUrl.middleware';
// import { generateTopicUrlForTrack } from '../middleware/generateTopicUrl.middleware';

class TracksRoute implements Routes {
  public path = '/tracks';
  public router = Router();
  public tracksController = new TracksController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:id(\\d+)?/:child_id(\\d+)?`,
      authMiddleware,
      this.tracksController.getTracks
    );

    this.router.get(
      `${this.path}/status_type/:status`,
      authMiddleware,
      this.tracksController.getTracks
    );

    this.router.get(
      `${this.path}/:course_type/:id(\\d+)?`,
      authMiddleware,
      this.tracksController.getTracksWithChapterOrChild
    );
    this.router.get(
      // `${this.path}/:id(\\d+)?`,
      `${this.path}/trackduration/:dateRangeType?`,
      authMiddleware,
      this.tracksController.getTracksbyduration
    );
    this.router.get(`${this.path}/soft/:type/:status`, this.tracksController.getTracks);

    this.router.post(
      `${this.path}/create/track`,
      authMiddleware,
      generateTopicUrl,
      validationMiddleware(CreateTrackDto, 'body'),
      this.tracksController.createTrack
    );
    this.router.post(
      `${this.path}/child/create`,
      authMiddleware,
      generateTopicUrlForTrack,
      validationMiddleware(CreateTrackDto, 'body'),
      this.tracksController.createTrack
    );
    this.router.post(
      `${this.path}/:option`,
      authMiddleware,
      validationMiddleware(CreateTrackDto, 'body'),
      this.tracksController.createTrack
    );
    this.router.put(
      `${this.path}/:id(\\d+)/:update_type?`,
      authMiddleware,
      validationMiddleware(CreateTrackDto, 'body', true),
      this.tracksController.updateTrack
    );
    this.router.put(
      `${this.path}/publishTracks`,
      authMiddleware,
      // validationMiddleware(CreateTrackDto),
      this.tracksController.publishTracks
    );

    this.router.put(
      `${this.path}/status`,
      authMiddleware,
      this.tracksController.updateTrackStatus
    );

    this.router.delete(
      `${this.path}`,
      authMiddleware,
      this.tracksController.deleteTrack
    );

    this.router.put(
      `${this.path}/publishTracks`,
      authMiddleware,
      validationMiddleware(CreateTrackDto),
      this.tracksController.publishTracks
    );

    /**Filter using track_type*/
    // this.router.get(
    //   `${this.path}/:track_type([a-zA-Z]+)`,
    //   authMiddleware,
    //   this.tracksController.searchAndFilterTracks
    // );

    /**Search tracks*/
    this.router.post(
      // `${this.path}/searchTracks/:searchkey([a-zA-Z]+)`,
      `${this.path}/search/searchTracks`,
      authMiddleware,
      this.tracksController.searchTracks
    );

    this.router.get(
      `${this.path}/newSearchTracks/fetchTracks`,
      authMiddleware,
      this.tracksController.newSearchAndFilterTracks
    );
    this.router.get(
      `${this.path}/get/newSearchCourses/fetchCourses`,
      authMiddleware,
      this.tracksController.newSearchAndFilterCourses
    );
    this.router.post(
      `${this.path}/getNeededTracks/byIds`,
      authMiddleware,
      this.tracksController.getNeededTracks
    );
  }
}

export default TracksRoute;
