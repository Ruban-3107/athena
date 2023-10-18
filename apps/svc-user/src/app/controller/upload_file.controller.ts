import { NextFunction, Request, Response } from 'express';
import uploadfileService from '../service/upload_file.service';
import formidable from 'formidable';
import { User } from '../interface/users.interface';
import {
    responseCF,
    bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';
import { RequestWithUser } from '../interface/auth.interface';
import { SECRET_KEY } from '../config/index';
import jwt from 'jsonwebtoken';
import { Template } from 'handlebars';


class UploadFileController {
    public uploadfileService = new uploadfileService();

    public createUploadFile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            // const userDataFromToken: User = req.user;
            // const templateId = Number(req.params.id)
            const authHeader = req.headers.authorization;
            const jwtToken = authHeader.split(' ')[1];
            const secret = SECRET_KEY;
            const decoded = jwt.verify(jwtToken, secret);
            const approvedBy = decoded['id'];
            const role = decoded['role'][0].name
            const FileData = req.body;
            const form1 = formidable({ multiples: true });
            form1.parse(req, async (err, fields, files) => {
                console.log("in controller ksjdksjdis fieldsss:", fields, "filesss:", files);
                console.log("afteree fileesssss");
                if (err) {
                    next(err);
                    return;
                }
                let createTopicData: any
                    createTopicData = await this.uploadfileService.createUploadFile(
                        files, fields, role
                );
                console.log("jhfudhfifihfd",createTopicData);

                if (createTopicData) {
                    const response = responseCF(
                        bodyCF({
                            code: '600',
                            val: createTopicData,
                            status: 'success',
                            message: 'File uploaded successfully',
                        })
                    )
                    return res.json(response);
                }
                else {
                    const response = responseCF(
                        bodyCF({
                            code: '611',
                            status: 'error',
                            message: 'error in file uploading',
                        })
                    )
                    return res.json(response);
                }

            });

        } catch (error) {
            res.status(404).json({ message: error.message, code: error.status, status: "error" });
        }
    };

    public getAlltemplates = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const findAllTemplateData: Template[] =
            await this.uploadfileService.findAllTemplates();
          const response = responseCF(
            bodyCF({
              val: findAllTemplateData,
              code: '600',
              status: 'success',
              message: `Get Templates Successfully`,
            })
          );
          return res.json(response);
        } catch (error) {
          const response = responseCF(
            bodyCF({
                message: error.message,
                code: '611',
                status: 'error',
            })
          );
          return res.json(response);    }
    };
    
    public getTemplateByID = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
            const templateId = req.params.key; 
          const findOneTemplateData: Template =
                await this.uploadfileService.findTemplateById(templateId);
            console.log("jhfudhfifihfd",findOneTemplateData);
            
          const response = responseCF(
            bodyCF({
              val: findOneTemplateData,
              code: '600',
              status: 'success',
              message: `Get Template Successfully`,
            })
          );
          return res.json(response);
        } catch (error) {
          const response = responseCF(
            bodyCF({
                message: error.message,
                code: '611',
                status: 'error',
            })
          );
          return res.json(response);    }
      };

    // public deleteUploadFile = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const fileId = Number(req.params.id);
    //         const deleteFileData: any = await this.uploadfileService.deleteUploadFile(fileId);
    //         res.status(200).json({ data: deleteFileData, message: 'deleted', status: 'success'});
    //     } catch (error) {
    //         res.status(404).json({ message: error.message, code: error.status, status: "error" });
    //         next(error);
    //     }
    // };
}

export default UploadFileController;
