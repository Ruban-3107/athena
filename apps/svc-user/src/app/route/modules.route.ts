import { Router } from 'express';
import modulesController from '../controller/modules.controller';
import { Routes } from '../interface/routes.interface';

class ModulesRoute implements Routes {
    public path = '/modules';
    public router = Router();
    public modulesController = new modulesController();

    constructor() {
        this.initializeRoutes();
    }

    /**
     * API Name: get all modules
     * Path: 
     */
    private initializeRoutes() {
        this.router.get(`${this.path}/get`,  this.modulesController.getModules);
    }
}

export default ModulesRoute;