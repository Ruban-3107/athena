import { Router } from 'express';
import EmploymentHistoryController from '../controller/employmenthistory.controller';
import { Routes } from '../interface/routes.interface';

class EmploymentHistoryRoute implements Routes {
  public path = '/employmentHistory';
  public router = Router();
  public employmentHistoryController = new EmploymentHistoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * Route Name: get all employmentHistory
     * Path: http://localhost:3000/api/users/employmentHistory
    */
    this.router.get(
      `${this.path}`,
      this.employmentHistoryController.getEmploymenthistory
    );
    /**
     * Route Name: get employmentHistory by id
     * Path: http://localhost:3000/api/users/employmentHistory/:id
     */
    this.router.get(
      `${this.path}/:id(\\d+)`,
      this.employmentHistoryController.getEmploymenthistoryById
    );
    /**
     * Route Name: create employmentHistory
     * Path: http://localhost:3000/api/users/employmentHistory
     * ReqBody: {
                  "user_id": 35,
                  "company": "Example Company",
                  "job_title": "Software Engineer",
                  "job_description": "This is a job description.",
                  "start_month": "2022-01-01",
                  "end_month": "2023-01-01"
                }
     */
    this.router.post(
      `${this.path}`,
      this.employmentHistoryController.createEmploymenthistory
    );
    /**
     * Route Name: update employmentHistory
     * Path: http://localhost:3000/api/users/employmentHistory/:id
     * ReqBody: {
                  "user_id": 35,
                  "company": "Example Company",
                  "job_title": "Software Engineer",
                  "job_description": "This is a job description.",
                  "start_month": "2022-01-01",
                  "end_month": "2023-01-01"
                }
     */
    this.router.put(
      `${this.path}/:id(\\d+)`,
      this.employmentHistoryController.updateEmploymenthistory
    );
    /**
     * Route Name: update employmentHistory
     * Path: http://localhost:3000/api/users/employmentHistory/emp/10
     */
    this.router.delete(
      `${this.path}/emp/:id(\\d+)`,
      this.employmentHistoryController.deleteEmploymenthistory
    );
  }
}
export default EmploymentHistoryRoute;
