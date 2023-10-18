import { NextFunction, Request, Response } from 'express';
import { CreateEmploymenthistoryDto } from '../dto/employmenthistory.dto';
import { Employmenthistory } from '../interface/employmenthistory.interface';
import employmenthistoryService from '../service/employmenthistory.service';

class EmploymenthistoryController {
  public employmenthistoryService = new employmenthistoryService();

  public getEmploymenthistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllEmploymenthistoryData: Employmenthistory[] = await this.employmenthistoryService.findAllEmploymenthistory();
        res.status(200).json({ data: findAllEmploymenthistoryData, message: 'findAll', status:'success' });
     // return findAllEmploymenthistoryData;
    } catch (error) {
      res.status(404).json({ message: error.message, code: error.status, status: "error" });
      next(error);
    }
  };

  public getEmploymenthistoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employmenthistoryId = Number(req.params.id);
      const findOneEmploymenthistoryData: Employmenthistory = await this.employmenthistoryService.findEmploymenthistoryById(employmenthistoryId);

      res.status(200).json({ data: findOneEmploymenthistoryData, message: 'findOne', status:'success' });
      //return findOneEmploymenthistoryData;
    } catch (error) {
      res.status(404).json({ message: error.message, code: error.status, status: "error" });
      next(error);
    }
  };

  public createEmploymenthistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employmenthistoryData: CreateEmploymenthistoryDto = req.body;

      //console.log(".....",employmenthistoryData);
      const createEmploymenthistoryData: Employmenthistory = await this.employmenthistoryService.createEmploymenthistory(employmenthistoryData);

      res.status(201).json({ data: createEmploymenthistoryData, message: 'created', status:'success' });
     // return createEmploymenthistoryData;
      //return createEmploymenthistoryData;
    } catch (error) {
      //console.log("error", error);
      res.status(404).json({ message: error.message, code: error.status, status: "error" });
      next(error);
    }
  };

  public updateEmploymenthistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employmenthistoryId = Number(req.params.id);
      const employmenthistoryData: CreateEmploymenthistoryDto = req.body;
      const updateEmploymenthistoryData: Employmenthistory = await this.employmenthistoryService.updateEmploymenthistory(employmenthistoryId, employmenthistoryData);

      res.status(200).json({ data: updateEmploymenthistoryData, message: 'updated', status:'success' });
      //return updateEmploymenthistoryData;
    } catch (error) {
      res.status(404).json({ message: error.message, code: error.status, status: "error" });
      next(error);
    }
  };

  public deleteEmploymenthistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employmenthistoryId = Number(req.params.id);
      const deleteEmploymenthistoryData: Employmenthistory = await this.employmenthistoryService.deleteEmploymenthistory(employmenthistoryId);

      res.status(200).json({ data: deleteEmploymenthistoryData, message: 'deleted', status:'success' });
      //return deleteEmploymenthistoryData
    } catch (error) {
      res.status(404).json({ message: error.message, code: error.status, status: "error" });
      next(error);
    }
  };
}

export default EmploymenthistoryController;
