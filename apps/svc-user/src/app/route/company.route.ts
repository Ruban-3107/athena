import { Router } from 'express';
import CompanyController from '../controller/company.controller';
import { CreateCompanyDto } from '../dto/company.dto';
import { Routes } from '../interface/routes.interface';
import {validationMiddleware} from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

class CompanyRoute implements Routes {
    public path = '/company';
    public router = Router();
    public companyController = new CompanyController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
      this.router.get(`${this.path}/getCompanies`,
        // authMiddleware,
        this.companyController.getCompanies);
        this.router.get(`${this.path}/:id(\\d+)`, this.companyController.getCompanyById);
        this.router.post(`${this.path}/createCompany`, 
        validationMiddleware(CreateCompanyDto, 'body'),
         this.companyController.createCompany);
        this.router.put(`${this.path}/updatecompany/:id(\\d+)`,  this.companyController.updateCompany);
        this.router.delete(`${this.path}/delete/:id(\\d+)`, this.companyController.deleteCompany);
  }
}

export default CompanyRoute;
