
import { Routes } from '../interface/routes.interface';
import {Router} from 'express';
import authMiddleware from '../middleware/auth.middleware';
import AssessmentsController from '../controller/assessment.controller';
import CreateAssessmentDto from '../dto/assessment.dto';
import { validationMiddleware } from '../middleware/validation.middleware';




class AssessmentRoute implements Routes{
    public path = '/assessments'
    public router = Router();
    public assessmentController =new AssessmentsController();
   


    constructor(){
        this.initializeRoutes();
    }


    public initializeRoutes(){
        this.router.post(`${this.path}/createAssessment`,
        authMiddleware,
        this.assessmentController.createAssessment)

        this.router.get(`${this.path}/getAllAssessment`,
        authMiddleware,
        this.assessmentController.getAllAssessment)

        
        this.router.post(`${this.path}/updateAssessment`,
        authMiddleware,
        this.assessmentController.editAssessment)

        this.router.post(`${this.path}/deleteAssessment`,
        authMiddleware,
        this.assessmentController.deleteAssessment)

        this.router.get(`${this.path}/getByIdAssessment/:id`,
        authMiddleware,
        this.assessmentController.getByIdAssessment)
    }

    
}


export default AssessmentRoute;