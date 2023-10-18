import { NextFunction, Request, Response } from 'express';
import TemplateService from '../service/template.service';
import { HttpException } from '@athena/shared/exceptions';
import DB from '../database/index';
import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';

class TemplateController {
  public usersdata = DB.DBmodels.users;
  public template = new TemplateService();

  public async createTemplate(req: Request, res: Response, next: NextFunction) {
    const temp = req.body;

    console.log('template::', temp);

    try {
      const addTemplateResponse: any = await this.template.createTemplate(temp);
      console.log('dhghdhdhdhhdhdhh');
      if (addTemplateResponse) {
        const response = responseCF(
          bodyCF({
            val: addTemplateResponse,
            code: '600',
            status: 'success',
            message: `Template created Successfully`,
          })
        );
        return res.json(response);
      }
    } catch (err) {
      const response = responseCF(
        bodyCF({
          code: '611',
          status: 'error',
          message: `error in create template',${err}`,
        })
      );
      return res.json(response);
    }
  }

  public getTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(
        'req.body.template_name::controller:',
        req.body.template_name
      );
      const getTemp = await this.template.getTemplateData(
        req.body.template_name
      );

      if (getTemp) {
        const response = responseCF(
          bodyCF({
            val: getTemp,
            code: '600',
            status: 'success',
            message: `Template retrived Successfully`,
          })
        );
        return res.json(response);
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '611',
          status: 'error',
          message: `error in get template',${error}`,
        })
      );
      return res.json(response);
    }
  };
}

export default TemplateController;
