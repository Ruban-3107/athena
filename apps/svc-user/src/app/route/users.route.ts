import { NextFunction, Request, Response, Router } from 'express';
import UsersController from '../controller/users.controller';
import { CreateUserDto } from '../dto/users.dto';
import { Routes } from '../interface/routes.interface';

import { authMiddleware } from '../middleware/auth.middleware';
import { authorizationMiddleware } from '../middleware/authorization.middleware';
import {
  ActionConstants,
  SubConstants,
} from '../middleware/constants.middleware';
import { validationMiddleware } from '@athena/shared/middleware';
class UsersRoute implements Routes {
  public path = '';
  public router = Router();
  public usersController = new UsersController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/getAllTrainers`,
      authMiddleware,
      this.usersController.getUsersWithTrainerRole
    );
    /**
     * Route Name: getUsers
     * Path: http://localhost:3000/api/users/getUsers
     * ReqBodyForSearch: {
                              "searchKey": "cl",
                              "pageNo": 1,
                              "size": 10
                          }
     * ReqBodyForFilterAndPagination: {
                                          "type": "Individual",
                                          "status": "all",
                                          "registrationType":"all",
                                          "pageNo": 1,
                                          "size": 10,
                                          "roles": "all",
                                          "clients": "all"
                                      }
     */
    this.router.post(
      `${this.path}/getUsers`,
      authMiddleware,
      this.usersController.getUserBasedOnFilterAndSearch
    );
    this.router.post(`${this.path}/getusers/all`, authMiddleware, this.usersController.getAllUsers);
    /**
     * Route Name: getUserById
     * Path: http://localhost:3000/api/users?ids[]=35&ids[]=36
     */
    this.router.post(
      `${this.path}/getNeededUsers/byIds`,
      authMiddleware,
      this.usersController.getUserById
    );
    this.router.get(
      `${this.path}/getUser/:handle`,
      authMiddleware,
      authorizationMiddleware(ActionConstants.READ, SubConstants.USERS),
      this.usersController.getUserByHandle
    );
    /**
     * Route Name: createUser
     * Path: http://localhost:3000/api/users/createUser
     * ReqBody: {
                    "email": "user@email.com",
                    "phone_number": "1234567890",
                    "password": "Pass*",
                    "first_name": "User",
                    "last_name": "Name",
                    "roles": [
                        1,2
                    ]
                }
     */
    this.router.post(
      `${this.path}/createUser`,
      authMiddleware,
      validationMiddleware(CreateUserDto, 'body'),
      this.usersController.createUser
    );
    /**
     * Route Name: bulkUpload
     * Path: http://localhost:3000/api/users/bulkUpload
     * ReqBody: 
                --form 'file=@"path to file' \
                --form 'roles="[1]"
     */
    this.router.post(
      `${this.path}/bulkUpload`,
      authMiddleware,
      this.usersController.bulkUpload
    );
    /**
     * Route Name: createUser
     * Path: http://localhost:3000/api/users/createUser
     * ReqBody: {
                  "athena_id": "12345",
                  "email": "clement@bassure.com",
                  "personal_email": "personal@example.com",
                  "password": "password123",
                  "users_type": "admin",
                  "phone_number": "1234567890",
                  "uid": "987654321",
                  "handle": "john_doe",
                  "first_name": "John",
                  "last_name": "Doe",
                  "client_id": 1,
                  "roles": [1, 2, 3],
                  "created_by": 4,
                  "updated_by": 5,
                  "name": "John Doe"
                }
     */
    this.router.put(
      `${this.path}/update/:handle`,
      authMiddleware,
      validationMiddleware(CreateUserDto, 'body', true),
      this.usersController.updateUser
    );
    /**
     * Route Name: updateUserStatus
     * Path: http://localhost:3000/api/users/:id/:type?
     * Params:
     * id -> 33
     * type -> approve/enable/disable
     */
    this.router.delete(
      `${this.path}/:id/:type?`,
      authMiddleware,
      this.usersController.userStatus
    );
    // don't know if its used
    this.router.post(
      `${this.path}/client/:clientId/:user_type?`,
      authMiddleware,
      this.usersController.getUsersByClientId
    );
    this.router.get(
      `${this.path}/trainingFacilitator`,
      authMiddleware,
      this.usersController.getTrainingFacilitator
    );
    this.router.get(
      `${this.path}/jobArchitects`,
      authMiddleware,
      this.usersController.getJobArchitects
    );
  }
}

export default UsersRoute;
