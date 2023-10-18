import { Router } from 'express';
import { Routes } from '../interface/routes.interface';
import UploadFileController from '../controller/upload_file.controller';


class UploadFileRoute implements Routes {
    public path = '/uploadfile';
    public router = Router();
    public UploadFileController =
      new UploadFileController();
 
  constructor() {
      this.initializeRoutes();
    }
  
  private initializeRoutes() {
      
      this.router.post(
        `${this.path}/createfile`,
        this.UploadFileController.createUploadFile
    );
    
    this.router.get(
      `${this.path}/alltemplates`,
      this.UploadFileController.getAlltemplates
    );

    this.router.get(
      `${this.path}/:key`,
      this.UploadFileController.getTemplateByID
    )
  
  
      // this.router.put(
      //   `${this.path}/:id(\\d+)`,
      //   this.UploadFileController.updateUploadFile
      // );
      // this.router.delete(
      //   `${this.path}/deleteCertificationProvider/:id(\\d+)`,
      //   this.UploadFileController.deleteUploadFile
      // );
    }
  }
  
  export default UploadFileRoute;