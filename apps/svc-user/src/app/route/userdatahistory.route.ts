import { Router } from 'express';
import UserdatahistoryController from '../controller/userdatahistory.controller';
// import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '../interface/routes.interface';


class UserdatahistoryRoute implements Routes {
    public path = '';
    public router = Router();
    public userdatahistoryController = new UserdatahistoryController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/datahistory`, this.userdatahistoryController.getUserdatahistoryBasedOnFiterAndSearch);
        this.router.post(`${this.path}/createdatahistory`, this.userdatahistoryController.createuserdatahistory);
    }
}

export default UserdatahistoryRoute;
