import { Router } from 'express';
import ActivitiesController from '../controller/activities_log.controller';
import { CreateActivitiesDto } from '../dto/activities_log.dto';
import { Routes } from '../interface/routes.interface';
import { validationMiddleware } from '../middleware/validation.middleware';
import authMiddleware from '../middleware/auth.middleware';

class ActivitiesLogRoute implements Routes {
    // public urlencodedParser = bodyParser.urlencoded({ extended: false });
    public path = '/activities';
    public router = Router();
    public activitiesController = new ActivitiesController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        console.log("activities routesssss");
        
        this.router.get(
            `${this.path}/all`,
            // authMiddleware,
            this.activitiesController.getActivities
        );

        // this.router.get(
        //     `${this.path}/:id(\\d+)`,
        //     authMiddleware,
        //     this.activitiesController.getActivitiesById
        // );

        this.router.post(
            `${this.path}/create/activities`,
            // authMiddleware,
            validationMiddleware(CreateActivitiesDto, 'body'),
            this.activitiesController.createActivities
        );

        // this.router.delete(
        //     `${this.path}/:id(\\d+)`,
        //     authMiddleware,
        //     this.activitiesController.deleteActivities
        // );
        this.router.post(
            `${this.path}/getActivities`,
            authMiddleware,
            this.activitiesController.getActivitiesBasedOnFilterAndSearch
          );
    }
}

export default ActivitiesLogRoute;
