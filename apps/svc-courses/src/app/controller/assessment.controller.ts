import { NextFunction, Response, Request } from 'express';
import AssessmentsService from '../service/assessment.service';
import {
  bodyCF,
  responseCF,
} from '../../../../../libs/commonResponse/commonResponse';
import { RequestWithUser, User } from '../interface/routes.interface';

class AssessmentsController {
  public assessmentsService = new AssessmentsService();

  public createAssessment = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body: any = req.body;
      const user: User = req.user;
      console.log('usrer::::::::::', user);
      body['created_by'] = Number(user.id);
      if (body['status'] == 'Approved') {
        body['approved_by'] = Number(user.id);
        body['approved_at'] = Date.now();
      }

      const create = await this.assessmentsService.createAssessment(body);
      if (create) {
        const response = responseCF(
          bodyCF({
            code: '600',
            status: 'success',
            message: 'Assessment Created successfully',
          })
        );
        return res.json(response);
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '701',
          status: 'error',
          message: error,
        })
      );
      return res.json(response);
    }
  };

  public getAllAssessment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const getAll = await this.assessmentsService.getAllAssessment();
      if (getAll) {
        const response = responseCF(
          bodyCF({
            code: '600',
            status: 'success',
            message: 'Assessment Created successfully',
            val: getAll,
          })
        );
        return res.json(response);
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '701',
          status: 'error',
          message: error,
        })
      );
      return res.json(response);
    }
  };

  public editAssessment = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body = req.body;
      const user: User = req.user;
      if (body['status'] == 'Approved') {
        body['approved_by'] = Number(user.id);
        body['approved_at'] = Date.now();
      } else {
        body['updated_by'] = Number(user.id);
      }
      console.log('user::::::::::', user);
      body['updated_by'] = Number(user.id);

      const updateAssessment =
        await this.assessmentsService.updateAssessmentService(body);
      if (updateAssessment) {
        const response = responseCF(
          bodyCF({
            code: '600',
            status: 'success',
            message: 'Assessment Updated successfully',
          })
        );
        return res.json(response);
      }
    } catch (err) {
      console.log('error in edit assessment', err);
      const response = responseCF(
        bodyCF({
          code: '701',
          status: 'error',
          message: err,
        })
      );
      return res.json(response);
    }
  };

  public deleteAssessment = async (req: RequestWithUser, res: Response) => {
    try {
      const body = req.body;
      const user: User = req.user;
      body['deleted_by'] = Number(user.id);
      const deleteAssessment =
        await this.assessmentsService.deleteAssessmentService(body);
      if (deleteAssessment) {
        const response = responseCF(
          bodyCF({
            code: '600',
            status: 'success',
            message: 'Assessment Deleted successfully',
          })
        );
        return res.json(response);
      }
    } catch (err) {
      console.log('error in delete assessment', err);
      const response = responseCF(
        bodyCF({
          code: '701',
          status: 'error',
          message: err,
        })
      );
      return res.json(response);
    }
  };

  public getByIdAssessment = async (req: Request, res: Response) => {
    try {
      const id= Number(req.params.id);

      const getById = await this.assessmentsService.getByIdAssessment(id);
      if (getById) {
        const response = responseCF(
          bodyCF({
            code: '600',
            status: 'success',
            message: 'Assessment Created successfully',
            val: getById,
          })
        );
        return res.json(response);
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '701',
          status: 'error',
          message: error,
        })
      );
      return res.json(response);
    }
  };
}

export default AssessmentsController;
