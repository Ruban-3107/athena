import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';
// import Domain from '../services/bot_questions_answers.service';
import { NextFunction, Request, Response } from 'express';
import { CreateDomainTechnologyDto, EditDomainTechnologyDto } from '../dto/domain_technology.dto';
import { DomainTechnology } from '../interface/domain_technology.interface';
import DomainTechnologyService from '../service/domain_technology.service';
import { RequestWithUser } from '../interface/auth.interface';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config';
class DomainTechnologyController {
  public domainTechnologyService = new DomainTechnologyService();

  public getDomainTechnology = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category: any = String(req.params.category);
      const getDomainTechnologyData: DomainTechnology[] =
        await this.domainTechnologyService.getDomainTechnology(category);
      const response = responseCF(
        bodyCF({
          val: getDomainTechnologyData,
          code: '600',
          status: 'success',
        })
      );
      return res.json(response);
    } catch (error) {
      console.log('error', error);
      const response = responseCF(
        bodyCF({ message: error.message, code: '611', status: 'error' })
      );
      return res.json(response);
    }
  };
  public createDomainTechnology = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const createDomainTechnology: CreateDomainTechnologyDto = req.body;
      if (!createDomainTechnology) {
        const response = responseCF(
          bodyCF({
            message: 'request body is missing',
            code: '611',
            status: 'error',
          })
        );
        return res.json(response);
      }
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      const decoded = jwt.verify(jwtToken, secret);
      const userRole = decoded['role'];
      const names = userRole.map((obj) => obj.name);
      if (names.includes('Admin') || names.includes('Super Admin')) {
        const createDomainTechnologyData: DomainTechnology =
          await this.domainTechnologyService.createDomainTechnology(
            createDomainTechnology
          );
        const response = responseCF(
          bodyCF({
            val: createDomainTechnologyData,
            code: '600',
            status: 'success',
          })
        );
        return res.json(response);
      }
    } catch (error) {
      console.log('error', error);
      const response = responseCF(
        bodyCF({ message: error.message, code: '611', status: 'error' })
      );
      return res.json(response);
    }
  };
  public editDomainTechnology = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const editDomainTechnologyData: EditDomainTechnologyDto = req.body;
      const domainTechnologyId = req.params.id;
      if (!domainTechnologyId) {
        const response = responseCF(
          bodyCF({
            message: 'domain technology id is missing',
            code: '611',
            status: 'error',
          })
        );
        return res.json(response);
      }
      if (!editDomainTechnologyData) {
        const response = responseCF(
          bodyCF({
            message: 'request body is missing',
            code: '611',
            status: 'error',
          })
        );
        return res.json(response);
      }
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      const decoded = jwt.verify(jwtToken, secret);
      const userRole = decoded['role'];
      const names = userRole.map((obj) => obj.name);
      if (names.includes('Admin') || names.includes('Super Admin')) {
        const updatedDomainTechnology: DomainTechnology =
          await this.domainTechnologyService.editDomainTechnology(
            domainTechnologyId,
            editDomainTechnologyData
          );
        const response = responseCF(
          bodyCF({
            val: updatedDomainTechnology,
            code: '600',
            status: 'success',
          })
        );
        return res.json(response);
      }
    } catch (error) {
      console.log('error', error);
      const response = responseCF(
        bodyCF({ message: error.message, code: '611', status: 'error' })
      );
      return res.json(response);
    }
  };
  public deleteDomainTechnology = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const domainTechnologyId = req.params.id;
      if (!domainTechnologyId) {
        const response = responseCF(
          bodyCF({
            message: 'domain technology id is missing',
            code: '611',
            status: 'error',
          })
        );
        return res.json(response);
      }
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      const decoded = jwt.verify(jwtToken, secret);
      const userRole = decoded['role'];
      const names = userRole.map((obj) => obj.name);

      if (names.includes('Admin') || names.includes('Super Admin')) {
        await this.domainTechnologyService.deleteDomainTechnology(
          domainTechnologyId
        );

        const response = responseCF(
          bodyCF({
            val: 'Deleted Successfully',
            code: '600',
            status: 'success',
          })
        );
        return res.json(response);
      }
    } catch (error) {
      console.log('error', error);
      const response = responseCF(
        bodyCF({ message: error.message, code: '611', status: 'error' })
      );
      return res.json(response);
    }
  };
}

export default DomainTechnologyController;
