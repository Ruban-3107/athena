import TemplateController from '../controller/template.controller';
import { Routes } from '../interface/routes.interface';
import { Router } from 'express';

class TemplateRoute implements Routes{
    public path = '/template';
    public router = Router();
    public templateController = new TemplateController()

    constructor() {
        this.initializeRoutes();
      }
      /**
       * Initialize the routes for the authentication middleware
       */
      private initializeRoutes() {
        // this.router.post(`${this.path}/createTemplate`, this.templateController.createTemplate);
        this.router.post(`${this.path}/getTemplate`, this.templateController.getTemplate)
      }



}

export  default TemplateRoute;