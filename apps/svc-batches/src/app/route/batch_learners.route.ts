// import { Router } from 'express';
// import Batch_learnersController from '@controllers/batch_learners.controller';
// import { CreateBatch_learnersDto } from '@dtos/batch_learners.dto';
// import { Routes } from '@interfaces/routes.interface';
// import { validationMiddleware } from '../middlewares/validation.middleware';

// /**200089 */
// class Batch_learnersRoute implements Routes {

//     public path = '/batch_learners';
//     public router = Router();
//     public batch_learnersController = new Batch_learnersController();
//     constructor() {
//         this.initializeRoutes();
//     }

//     private initializeRoutes() {
//         this.router.get(`${this.path}`, this.batch_learnersController.getBatch_learners);
//         this.router.get(`${this.path}/:id(\\d+)`, this.batch_learnersController.getBatch_learnerById);
//         this.router.post(`${this.path}`, validationMiddleware(CreateBatch_learnersDto, 'body'), this.batch_learnersController.createBatch_learner);
//         this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateBatch_learnersDto, 'body', true), this.batch_learnersController.updateBatch_learner);
//         this.router.delete(`${this.path}/:id(\\d+)`, this.batch_learnersController.deleteBatch_learner);

//     }
// }

// export default Batch_learnersRoute;
