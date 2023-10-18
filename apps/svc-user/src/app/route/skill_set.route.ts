import { Router } from 'express';
import SkillSetController from '../controller/skill_set.controller';
import { CreateSkillSetDto, UpdateSkillSetDto } from '../dto/skill_set.dto';
import { Routes } from '../interface/routes.interface';
import { validationMiddleware } from '@athena/shared/middleware';

class SkillSetRoute implements Routes {
  public path = '/skillSet';
  public router = Router();
  public skillSetController = new SkillSetController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
    Route Name: getSkillSet
    Path: http://localhost:3000/api/users/skillSet
    Method: GET
    Description: Retrieves a list of skill sets.
    */
    this.router.get(`${this.path}`, this.skillSetController.getSkillSet);
    /**
    Route Name: getSkillSetById
    Path: http://localhost:3000/api/users/skillSet/:id
    Method: GET
    Description: Retrieves a skill set by its ID.
    Params:
    id (number): The ID of the skill set to retrieve.
    */
    this.router.get(
      `${this.path}/:id(\\d+)`,
      this.skillSetController.getSkillSetById
    );
    /**
     * Route Name: createSkillSet
     * Path: http://localhost:3000/api/users/skillSet
     * Req Body: 
     {
      "label": "example_label",
      "value": "example_value"
     }
     */
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateSkillSetDto, 'body'),
      this.skillSetController.createSkillSet
    );
    /**
    Route Name: updateSkillSet
    Path: http://localhost:3000/api/users/skillSet/:id
    Method: PUT
    Description: Updates an existing skill set.
    Params:
    id (number): The ID of the skill set to update.
    Req Body:
    {
    "label": "example_label",
    "value": "example_value"
    }
    */
    this.router.put(
      `${this.path}/:id(\\d+)`,
      validationMiddleware(UpdateSkillSetDto, 'body', true),
      this.skillSetController.updateSkillSet
    );
    /**
    Route Name: deleteSkillSet
    Path: http://localhost:3000/api/users/skillSet/:id
    Method: DELETE
    Description: Deletes a skill set by its ID.
    Params:
    id (number): The ID of the skill set to delete.
    */
    this.router.delete(
      `${this.path}/:id(\\d+)`,
      this.skillSetController.deleteSkillSet
    );
  }
}

export default SkillSetRoute;
