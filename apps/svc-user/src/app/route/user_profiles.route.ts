import { Router } from 'express';
import UserProfilesController from '../controller/user_profiles.controller';
// import { CreateUserProfileDto } from '@dtos/userprofiles.dto';
import { Routes } from '../interface/routes.interface';
// import { validationMiddleware } from '@middlewares/validation.middleware';

class UserProfilesRoute implements Routes {
  public path = '/profiles';
  public router = Router();
  public userProfileController = new UserProfilesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
   * Route Name: getUserProfiles
   * Path: http://localhost:3000/api/users/profiles */
    this.router.get(`${this.path}`, this.userProfileController.getUserProfiles);
    /**
    * Route Name: getUserProfileById
    * Path: http://localhost:3000/api/users/profiles/2 */
    this.router.get(`${this.path}/:id(\\d+)`, this.userProfileController.getUserProfileById);
    /**
    * Route Name: createUserProfile
    * Path: http://localhost:3000/api/users/profiles/
    * ReqBody: {
                              "email":"user@email.com",
                              "user_id":"1234",
                              "first_name":"FirstName",
                              "last_name":"LastName",
                              "phone_number":"1234567890",
                          } 
    */
    this.router.post(`${this.path}/:type?`, this.userProfileController.createUserProfile);
    /**
    * Route Name: updateUserProfile
    * Path: http://localhost:3000/api/users/profiles/
    * ReqBody: {
                              "email":"user1@email.com",
                              "user_id":"1234",
                              "first_name":"FirstName",
                              "last_name":"LastName",
                              "phone_number":"1234567890",
                          } 
    */
    this.router.put(`${this.path}/:type?/:id(\\d+)`, this.userProfileController.updateUserProfile);
    /**
    * Route Name: createUserProfile
    * Path: http://localhost:3000/api/users/profiles/1
    */
    this.router.delete(`${this.path}/pro/:id(\\d+)/:type?`, this.userProfileController.deleteUserProfile);
  }
}

export default UserProfilesRoute;
