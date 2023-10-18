import { Router } from 'express';
import DomainTechnologyController from '../controller/domain_technology.controller';
import { Routes } from '../interface/routes.interface';
import  authMiddleware  from '../middleware/auth.middleware';

class DomainTechnologyRoute implements Routes {
  public path = '/domainTechnology';
  public router = Router();
  public domainTechnologyController = new DomainTechnologyController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/getDomainTechnology/:category?`,
      authMiddleware,
      this.domainTechnologyController.getDomainTechnology
    );
    this.router.post(
      `${this.path}/createDomainTechnology`,
      authMiddleware,
      this.domainTechnologyController.createDomainTechnology
    );
    this.router.put(
      `${this.path}/editDomainTechnology/:id`,
      authMiddleware,
      this.domainTechnologyController.editDomainTechnology
    );
    this.router.delete(
      `${this.path}/deleteDomainTechnology/:id`,
      authMiddleware,
      this.domainTechnologyController.deleteDomainTechnology
    );
    
  }
}

export default DomainTechnologyRoute;