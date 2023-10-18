import { NextFunction, Request, Response } from 'express';
import { UserCertifications } from '../interface/users_certifications.interface';
import CertificationService from '../service/user_certifications.service';
import { parseRequestFiles } from '@athena/shared/file-upload';

class CertificationsController {
  public CertificationService = new CertificationService();

  public getCertifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllCertificationsData: UserCertifications[] =
        await this.CertificationService.findAllCertifications();

      res
        .status(200)
        .json({ data: findAllCertificationsData, message: 'findAll' });
      return findAllCertificationsData;
    } catch (error) {
      res
        .status(404)
        .json({ message: error.message, code: error.status, status: 'error' });
      //next(error);
    }
  };

  public getCertificationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const certificationId = Number(req.params.id);
      const findOneUserData: UserCertifications =
        await this.CertificationService.findCertificationById(certificationId);

      res
        .status(200)
        .json({ data: findOneUserData, message: 'findOne', status: 'success' });
      return findOneUserData;
    } catch (error) {
      res
        .status(404)
        .json({ message: error.message, code: error.status, status: 'error' });
      // next(error);
    }
  };

  public createCertification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // const certificationData: CreateCertificationsDto = req.body;

//       // console.log("body in controllers", req.body);

      const payload = await parseRequestFiles(req);
      console.log('aaaaaaaaaaaaaaaa', payload);

      req['body'] = payload['fields'];
      req['files'] = payload['files'];
      const { body, files }: any = req;
      console.log('in certifications controller', body, files);
      const createCertificationData: UserCertifications =
        await this.CertificationService.createCertification(body, files);
      console.log('ok::123');
      res
        .status(201)
        .json({
          data: createCertificationData,
          message: 'created',
          status: 'success',
        });
      return createCertificationData;
    } catch (error) {
      res
        .status(404)
        .json({ message: error.message, code: error.status, status: 'error' });
      // next(error);
    }
  };

  public updateCertification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const certificationId = Number(req.params.id);
      // const certificationData: CreateCertificationsDto = req.body;
      const payload = await parseRequestFiles(req);
      // console.log("controllerPayload",payload);
      req['body'] = payload['fields'];
      req['files'] = payload['files'];
      const { body, files }: any = req;
      // console.log("///",certificationId,payload)
      const updateCertificationData: UserCertifications =
        await this.CertificationService.updateCertification(
          certificationId,
          body,
          files
        );

      res
        .status(200)
        .json({
          data: updateCertificationData,
          message: 'updated',
          status: 'success',
        });
      // return updateCertificationData;
    } catch (error) {
      console.log('controllerzzzzzzzzzzzzzz', error);
      res
        .status(404)
        .json({ message: error.message, code: error.status, status: 'error' });
      // next(error);
    }
  };

  public deleteCertification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const certificationId = Number(req.params.id);
      const deleteCertificationData: UserCertifications =
        await this.CertificationService.deleteCertification(certificationId);

      res
        .status(200)
        .json({
          data: deleteCertificationData,
          message: 'deleted',
          status: 'success',
        });
      return deleteCertificationData;
    } catch (error) {
      res
        .status(404)
        .json({ message: error.message, code: error.status, status: 'error' });
      //next(error);
    }
  };
}

export default CertificationsController;
