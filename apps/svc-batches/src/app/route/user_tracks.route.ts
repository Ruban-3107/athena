
import { Router,NextFunction,Request,Response } from 'express';
import UserTracksController from '../controller/user_tracks.controller';
import { Routes } from '../interface/routes.interface';
import authMiddleware from '../middleware/auth.middleware';

class UserTracksRoute implements Routes {
  public path = '/user_tracks';
  public router = Router();
  public userTracksController = new UserTracksController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:track_id(\\d+)?/:child_id(\\d+)?`,
      ((req:Request,res:Response,next:NextFunction) => {
        console.log("tttttttttttttt");
        next();
        return;
      }),
      authMiddleware,
      this.userTracksController.getMyTracks
    );
    // this.router.get(
    //   `${this.path}`,
    //   ((req: Request, res: Response, next: NextFunction) => {
    //     console.log("tttttttttttttt");
    //     next();
    //     return;
    //   }),
    //   // authMiddleware,
    //   // this.userTracksController.getMyTracks
    // );
    this.router.put(
      `${this.path}/:track_id(\\d+)/chapter/:chapter_id(\\d+)/topic/:topic_id(\\d+)/child/:child_id(\\d+)?/`,
      /*authMiddleware */
      this.userTracksController.updateTrackCourseSummaryData
    );
    // this.router.post(`${this.path}/join`, authMiddleware, this.userTracksController.joinTrack);
    this.router.post(
      `${this.path}/join/track/:track_id`,
      authMiddleware,
      this.userTracksController.joinTrack
    );
    //:track_id(\\d+)
    this.router.post(`${this.path}/join`, this.userTracksController.joinTrack);
  }
}

export default UserTracksRoute;
