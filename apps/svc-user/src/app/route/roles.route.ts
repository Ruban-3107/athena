import { Router } from 'express';
import RolesController from '../controller/roles.controller';
import { Routes } from '../interface/routes.interface';
import { authMiddleware } from '../middleware/auth.middleware';

class RolesRoute implements Routes {
  public path = '/roles';
  public router = Router();
  public rolesController = new RolesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/getRoles`,
      authMiddleware,
      this.rolesController.getRoles
    );
    this.router.get(`${this.path}/:id(\\d+)`, this.rolesController.getRoleById);
    /**
      Route Name: createRole
      Path: http://localhost:3000/api/roles/createRoles
      Method: POST
      Description: Creates a new role.
      ReqBody: {
                  "name": "example_name",
                  "description": "example_description"
               }
    */
    this.router.post(
      `${this.path}/createRoles`,
      this.rolesController.createRole
    );
    this.router.put(`${this.path}/:id(\\d+)`, this.rolesController.updateRole);
  }
}

export default RolesRoute;
