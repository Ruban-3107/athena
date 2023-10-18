import { Router } from 'express';
import CertificationsController from '../controller/user_certifications.controller';
import { CreateCertificationsDto,UpdateCertificationsDto } from '../dto/user_certifications.dto';
import { Routes } from '../interface/routes.interface';
import bodyParser from 'body-parser';

// /**200089 */
class CertificationsRoute implements Routes {

    public urlencodedParser = bodyParser.urlencoded({ extended: false });
    public path = '/certifications';
    public router = Router();
    public certificationsController = new CertificationsController();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.certificationsController.getCertifications);
        this.router.get(`${this.path}/:id(\\d+)`, this.certificationsController.getCertificationById);
        // validationMiddleware(CreateCertificationsDto, 'body')
        this.router.post(`${this.path}`, this.urlencodedParser, this.certificationsController.createCertification);
        this.router.put(`${this.path}/:id(\\d+)`, this.certificationsController.updateCertification);
        this.router.delete(`${this.path}/cert/:id(\\d+)`, this.certificationsController.deleteCertification);
    }
}

export default CertificationsRoute;
