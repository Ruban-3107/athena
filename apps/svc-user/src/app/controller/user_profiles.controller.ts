import { NextFunction, Request, Response } from 'express';
import { CreateUserProfileDto } from '../dto/user_profiles.dto';
import { UserProfile } from '../interface/user_profiles.interface';
import UserProfileService from '../service/user_profiles.service';
import CertificationsController from '../controller/user_certifications.controller';
import EmploymenthistoryController from '../controller/employmenthistory.controller';
// import { validationMiddleware } from '@middlewares/validation.middleware';
import { parseRequestFiles } from '@athena/shared/file-upload';
import {
  responseCF,
  bodyCF,
  codeValue
} from '../../../../../libs/commonResponse/commonResponse';

class UserProfilesController {
  public UserProfileService = new UserProfileService();
  public certificationController = new CertificationsController();
  public employmenthistoryController = new EmploymenthistoryController();

  public getUserProfiles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let dataSent: any;
      if (req.params.type === 'certifications') {
        dataSent = await this.certificationController.getCertifications(
          req,
          res,
          next
        );
      } else if (req.params.type === 'employmenthistory') {
        dataSent = await this.employmenthistoryController.getEmploymenthistory(
          req,
          res,
          next
        );
      } else {
        const findAllUserProfilesData: UserProfile[] =
          await this.UserProfileService.findAllUserProfile();
        dataSent = findAllUserProfilesData;
      }
      res.status(200).json({ data: dataSent, message: 'findAll', status:'success' });
    } catch (error) {
      res.status(404).json({ message: error.message, code: error.status, status: "error" });
      next(error);
    }
  };

  public getUserProfileById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userProfileId = Number(req.params.id);
      let dataSent: any;
      if (req.params.type === 'certifications') {
        dataSent = await this.certificationController.getCertificationById(
          req,
          res,
          next
        );
      } else if (req.params.type === 'employmenthistory') {
        dataSent =
          await this.employmenthistoryController.getEmploymenthistoryById(
            req,
            res,
            next
          );
      } else {
        const findOneUserProfileData: UserProfile =
          await this.UserProfileService.findUserProfileById(userProfileId);
        // console.log("kekerrrrf", findOneUserProfileData);
        dataSent = findOneUserProfileData ? findOneUserProfileData : null;
      }
     
       
      res.status(200).json({
        data: dataSent.status === 409 ? null : dataSent,
        message: 'user profile retrived',
        status: 'success',
      });
    } catch (error) {
      //console.log('/////error/////', error);
      res.status(404).json({ message: error.message, code: error.status, status: "error" });
      next(error);
    }
  };

  public createUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let dataSent: any;
      if (req.params.type === 'certifications') {
        dataSent = await this.certificationController.createCertification(
          req,
          res,
          next
        );
      } else if (req.params.type === 'employmenthistory') {
        dataSent =
          await this.employmenthistoryController.createEmploymenthistory(
            req,
            res,
            next
          );
      } else {
        console.log("honey")
        const userProfileData: CreateUserProfileDto = req.body;

        const createUserProfileData: UserProfile =
          await this.UserProfileService.createUserProfile(userProfileData);
        dataSent = createUserProfileData;
      }
      //console.log("ok:!23")
     return  res.status(201).json({
        data: dataSent,
        message: 'user profile created',
        status: 'success',
      });
    } catch (error) {
      //console.log("error12333::",error.message)
      res.status(404).json({ message: error.message, code: error.status, status: "error" });
      //next(error);
    }
  };

  public updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userProfileId = Number(req.params.id);
      let dataSent: any;
      if (req.params.type === 'certifications') {
        dataSent = await this.certificationController.updateCertification(
          req,
          res,
          next
        );
      } else if (req.params.type === 'employmenthistory') {
        dataSent =
          await this.employmenthistoryController.updateEmploymenthistory(
            req,
            res,
            next
          );
      }
      if (req.params.type === 'about_me') {
        const userProfileData = req.body;
        const updateUserProfileData: UserProfile =
          await this.UserProfileService.updateUserProfile(
            userProfileId,
            userProfileData,null
          );
        dataSent = updateUserProfileData;
      } else if(req.params.type === "preferences") {
        const userProfileData = req.body;
        const updateUserProfileData: UserProfile =
          await this.UserProfileService.updateUserProfile(
            userProfileId,
            userProfileData,null
          )
        dataSent = updateUserProfileData;
      } else if(req.params.type === "imageupload"){
        const payload = await parseRequestFiles(req);
            console.log("controllerPayload",payload);
            req['body'] = payload['fields'];
            req['files'] = payload['files'];
            const {
              body,
              files
        }: any = req;
        const userProfileData: CreateUserProfileDto = req.body;
        const updateUserProfileData: UserProfile =
          await this.UserProfileService.updateUserProfile(
            userProfileId,
            userProfileData
            ,files
          );
        dataSent = updateUserProfileData;
      }
      else {
        const userProfileData: CreateUserProfileDto = req.body;
        const updateUserProfileData: UserProfile =
          await this.UserProfileService.updateUserProfile(
            userProfileId,
            userProfileData,null
          );
        dataSent = updateUserProfileData;
      }
      const response = responseCF(
        bodyCF({
          message: 'created',
          code: codeValue.success,
          status: 'success',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({ message: error.message, code: codeValue.error, status: 'error' })
      );
      return res.json(response);
    }
  };

  public deleteUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userProfileId = Number(req.params.id);
      let dataSent: any;
      if (req.params.type === 'certifications') {
        dataSent = await this.certificationController.deleteCertification(
          req,
          res,
          next
        );
      } else if (req.params.type === 'employmenthistory') {
        dataSent =
          await this.employmenthistoryController.deleteEmploymenthistory(
            req,
            res,
            next
          );
      } else {
        const deleteUserProfileData: UserProfile =
          await this.UserProfileService.deleteUserProfile(userProfileId);
        dataSent = deleteUserProfileData;
      }

      res.status(200).json({ data: dataSent, message: 'deleted', status: 'success'});
    } catch (error) {
      res.status(404).json({ message: error.message, code: error.status, status: "error" });
      next(error);
    }
  };
}

export default UserProfilesController;
