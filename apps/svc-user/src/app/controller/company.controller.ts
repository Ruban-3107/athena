import { NextFunction, Request, Response } from 'express';
import { CreateCompanyDto } from '../dto/company.dto';
import { Company } from '../interface/company.interface';
import companyService from '../service/company.service';
import { RequestWithUser } from '../interface/auth.interface';
import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';
class CompanyController {
  public companyService = new companyService();

  public getCompanies = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
    //   const companyData:any = req.user;
      const findAllCompaniesData: Company[] = await this.companyService.findAllCompanies(req.body);
      const response = responseCF(
        bodyCF({
          val: findAllCompaniesData,
          code: '600',
          status: 'success',
          message: `Get Roles Successfully`,
        })
      );
      return res.json(response)
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '625',
          status: 'error',
          message: `${error.message},error in getting companies`,
        })
      );
      return res.json(response)
    }
  };

  public getCompanyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.id);
      const findOneCompanyData: Company = await this.companyService.findCompanyById(companyId);
      const response = responseCF(
        bodyCF({
          val: findOneCompanyData,
          code: '600',
          status: 'success',
          message: `Get Company Successfully`,
        })
      );
      return res.json(response)
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '625',
          status: 'error',
          message: `${error.message},error in getting roles`,
        })
      );
      return res.json(response)
    }
  };

  public createCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyData: CreateCompanyDto = req.body;
      const createCompanyData: Company = await this.companyService.createCompany(companyData);
      const response = responseCF(
        bodyCF({
          val: createCompanyData,
          code: '600',
          status: 'success',
          message: `Company Created Successfully`,
        })
      );
      return res.json(response);
    } catch (error) { 
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '625',
          status: 'error',
          message: `${error.message},error in creating company`,
        })
      );
      return res.json(response)
    }
  };

  public updateCompany= async (req: Request, res: Response, next: NextFunction) => {
    try {
      const CompanyId = Number(req.params.id);
      const companyData: CreateCompanyDto = req.body;
      const updateCompanyData: Company = await this.companyService.updateCompany(CompanyId, companyData);

      const response = responseCF(
        bodyCF({
          val: updateCompanyData,
          code: '600',
          status: 'success',
          message: `Company Updated Successfully`,
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '625',
          status: 'error',
          message: `${error.message},error in updating role`,
        })
      );
      return res.json(response)
    }
  };

  public deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = Number(req.params.id);
      const deleteComapnyData: Company = await this.companyService.deleteCompany(companyId);

      const response = responseCF(
        bodyCF({
          val: deleteComapnyData,
          code: '600',
          status: 'success',
          message: `Company Deleted Successfully`,
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '625',
          status: 'error',
          message: `${error.message},error in updating role`,
        })
      );
      return res.json(response)
    }
  };
}

export default CompanyController;
