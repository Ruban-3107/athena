import { NextFunction, Request, Response } from 'express';
// import rimraf from 'rimraf';
import { SECRET_KEY } from '../config/index';
import { CreateTopicDto } from '../dto/topics.dto';
import { Topic } from '../interface/topic.interface';
import topicService from '../service/topic.service';
import axios, { AxiosResponse } from 'axios';
import { User } from '../interface/auth.interface';
import formidable from 'formidable';
import jwt from 'jsonwebtoken';
import {
    responseCF,
    bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';
import * as fs from 'fs';
import FormData from 'form-data';
import { STRAPI_URL } from '../config/index';
import { createReadStream } from 'fs';
import { toNamespacedPath } from 'path/posix';
import { log } from 'winston';
import { RequestWithUser } from '../interface/auth.interface';
import { generateTopicUrl } from '@athena/shared/file-upload';

interface FileRequest extends RequestWithUser {
    file: any; // replace 'any' with the type of the uploaded file if known
}

// import { FormData } from 'form-data';

class TopicsController {
    public topicService = new topicService();

    public getTopicsBasedOnFilterAndSearch = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (req.body.searchkey) {
                console.log('here');
                const foundTopicsData: Topic[] = await this.topicService.searchTopics(
                    req.body
                );
                const response = responseCF(
                    bodyCF({
                        val: { topicData: foundTopicsData },
                        code: '600',
                        status: 'search success',
                    })
                );

                return res.json(response);
            } else {
                const sortUserData: Topic[] = await this.topicService.filterTopics(
                    req.body
                );
                const response = responseCF(
                    bodyCF({
                        val: { topicData: sortUserData },
                        code: '600',
                        status: 'filter success',
                    })
                );
                return res.json(response);
            }
        } catch (error) {
            const response = responseCF(
                bodyCF({
                    message: error.message,
                    code: '611',
                    status: 'error',
                })
            );
            console.log(error);
            return res.json(response);
        }
    };

    public getTopics = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const findAllTopicsData: Topic[] = await this.topicService.findAllTopic();

            res.status(200).json({
                data: findAllTopicsData,
                message: 'findAll',
                status: 'success',
            });
        } catch (error) {
            const response = responseCF(
                bodyCF({
                    message: error.message,
                    code: '611',
                    status: 'error',
                })
            );
            console.log(error);
            return res.json(response);
        }
    };

    public getTopicById = async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const topicId = Number(req.params.id);
            const token = req.token;
            const findOneTopicData: Topic = await this.topicService.findTopicById(
                topicId,token
            );
            const response = responseCF(
                bodyCF({
                    val: { userData: findOneTopicData },
                    code: '600',
                    status: 'success',
                    message: 'Topic Id found successfully',
                })
            );
            return res.json(response);
        } catch (error) {
            // if (error.status === 404) {
            const response = responseCF(
                bodyCF({
                    message: error.message,
                    code: '611',
                    status: 'error',
                })
            );
            console.log(error);
            return res.json(response);
        }
    };

    public getTopicsByStatus = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const topicStatus = String(req.params.status);
            console.log(topicStatus, '---staruss');

            const findOneTopicData: Topic[] =
                await this.topicService.findTopicByStatus(topicStatus);
            const response = responseCF(
                bodyCF({
                    val: { userData: findOneTopicData },
                    code: '600',
                    status: 'success',
                    message: 'Status found successfully',
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
            console.log(error);
            return res.json(response);
        }
    };

    public publishTopic = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const topicId = Number(req.params.id);
            const authHeader = req.headers.authorization;
            const jwtToken = authHeader.split(' ')[1];
            const secret = SECRET_KEY;
            console.log(jwtToken, '----jwttoken----');
            const decoded = jwt.verify(jwtToken, secret);
            console.log(decoded, '----decodeedddeddd-----');
            const approvedBy = decoded['id'];
            const publishTopic = await this.topicService.publishTopic(
                topicId,
                approvedBy
            );
            console.log(publishTopic, '----jdkdsjfdsj=--');
            const response = responseCF(
                bodyCF({
                    val: { userData: publishTopic },
                    code: '600',
                    status: 'success',
                    message: 'Topic Id found successfully',
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
            console.log(error);
            return res.json(response);
        }
    };

    public publishTopics = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const topicIds = req.body.ids;
            const arrOfPublishedTopics = [];
            const authHeader = req.headers.authorization;
            const jwtToken = authHeader.split(' ')[1];
            const secret = SECRET_KEY;
            console.log(jwtToken, '----jwttoken----');
            const decoded = jwt.verify(jwtToken, secret);
            console.log(decoded['name'], '----decodeedddeddd-----');
            const approvedBy = decoded['id'];
            console.log(topicIds, '---potic data-----');
            for (const userData of topicIds) {
                console.log(userData, '--0userData0');
                const publishTopics: Topic[] = await this.topicService.publishTopic(
                    userData,
                    approvedBy
                );
                console.log(publishTopics, '---publish topic--');
                arrOfPublishedTopics.push(publishTopics);
            }
            const response = responseCF(
                bodyCF({
                    val: { userData: arrOfPublishedTopics },
                    code: '600',
                    status: 'success',
                    message: 'Topic Id found successfully',
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
            console.log(error);
            return res.json(response);
        }
    };

    public createTopiclink = async (
        req: FileRequest,
        res: Response,
        next: NextFunction
    ) => {
        const authHeader = req.headers.authorization;
        const jwtToken = authHeader.split(' ')[1];
        const secret = SECRET_KEY;
        const decoded = jwt.verify(jwtToken, secret);
        const approvedBy = decoded['id'];
        const role = decoded['role'][0].name
        console.log("rollleeeeeeeeee", role);
        const userDataFromToken: User = req.user;

        

        const form1 = formidable({ multiples: true });
        let payload;
        form1.parse(req, async (err, fields, files) => {
            console.log("in controller", req["user"], "fieldsss:", fields, "filesss:", files);

            if (err) {
                next(err);
                return;
            }
            payload = await generateTopicUrl(files, fields, 'file');
            console.log('iuiuiuiuiullllllll', payload);
            const topicData:any = payload;
            topicData.created_by = req["user"].id;
            if (role === 'Trainer') {
                topicData.status = 'Pending Approval';
            }
            console.log("afterrr roleeeee");
            const createTopicData: Topic = await this.topicService.createTopiclink(
                topicData, role, userDataFromToken, approvedBy
            );
            const response = responseCF(
                bodyCF({
                    val: { userData: createTopicData },
                    code: '600',
                    status: 'success',
                    message: 'Topic created successfully',
                })
            );
            return res.json(response);
        });
    };

    public createTopicThroughChapter = async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const topicData: CreateTopicDto = req.body;

            const validTopicTypes = [
                'Virtual Class',
                'Self-paced',
                'Classroom',
                'Activity',
            ];
            const isTopicTypeValid = validTopicTypes.includes(topicData.topic_type);

            if (topicData.topic_type === 'Topic Link' && !topicData.topic_link) {
                const response = responseCF(
                    bodyCF({
                        code: '611',
                        status: 'error',
                        message: 'Topic link is required for Topic Link type',
                    })
                );
                return res.json(response);
            } else if (
                topicData.topic_type === 'Topic Link' &&
                topicData.topic_link
            ) {
                console.log('in first else if');
                topicData.attachment_url = null;
                topicData.created_by = String(req?.user?.id);
            } else if (isTopicTypeValid && !topicData.attachment_url) {
                console.log('in second else if');
                const response = responseCF(
                    bodyCF({
                        code: '611',
                        status: 'error',
                        message:
                            'File is required or the provided file is invalid for Virtual Class, Self-paced, Classroom, and Activity types',
                    })
                );
                return res.json(response);
            } else if (isTopicTypeValid && topicData.attachment_url) {
                console.log('in third else if');
                topicData.topic_link = null;
                topicData.created_by = String(req?.user?.id);
            }

            const createTopicData: Topic =
                await this.topicService.createTopicThroughTransaction(topicData);
            const response = responseCF(
                bodyCF({
                    val: createTopicData,
                    code: '600',
                    status: 'success',
                    message: 'Topic created successfully',
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
            console.log(error);
            return res.json(response);
        }
    };

    public updateTopicStatus = async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
    ) => {
        try {
            // const topicId = Number(req.params.id);
            const arrOfPublishedTopics = [];
            const topicIds = req.body.ids;
            const userDataFromToken: User = req.user;
            console.log("popiuytrtyuiop", topicIds)
            for (const userData of topicIds) {
                console.log("entered i  forlooopppp");
                const updateTopicStatus: Topic[] = await this.topicService.updateTopicStatus(
                    userData,
                    userDataFromToken
                )
                arrOfPublishedTopics.push(updateTopicStatus);
                console.log(updateTopicStatus, "updateTopicStatus");
            }
            const response = responseCF(
                bodyCF({
                    val: { userData: arrOfPublishedTopics },
                    code: '600',
                    status: 'success',
                    message: 'Topic updated successfully',
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
            console.log(error);
            return res.json(response);

        }
    };

    public updateTopic = async (
        req: FileRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const topicId = Number(req.params.id);
            const authHeader = req.headers.authorization;
            const jwtToken = authHeader.split(' ')[1];
            const secret = SECRET_KEY;
            const decoded = jwt.verify(jwtToken, secret);
            const topicData: CreateTopicDto = req.body;
            console.log(topicData.description, '----desc=====');

            /** Only uploads file to strapi if topic type is either Virtual Class, Self-paced, Classroom, Activity and file is uploaded
             * Sets topic_link to null
             */
            const validTopicTypes = [
                'Virtual Class',
                'Self-paced',
                'Classroom',
                'Activity',
            ];
            
            console.log("beforeeeupdate statusss");
            if (req?.body?.status) {
                // const topicstatus = req.body.status;
                // console.log("in bodyyyyy",topicstatus);
                
                console.log("statttssssssussssss");
                console.log("popiuytrtyuiop",topicId,topicData)
                const updateTopicStatus = await this.topicService.updateStatus(
                    topicId,
                    topicData
                )
                const response = responseCF(
                  bodyCF({
                    val: { userData: updateTopicStatus },
                    code: '600',
                    status: 'success',
                    message: 'Topic updated successfully',
                  })
                );
                return res.json(response);
            }
            
            console.log("afterrrrupdate statusss");

            const isTopicTypeValid = validTopicTypes.includes(req.body.topic_type);
            // If file is getting updated
            if (isTopicTypeValid && req.file) {
                const fileData = req.file;
                console.log(fileData, '----patoffile');
                const form1 = formidable({ multiples: true });
                let payload;
                console.log("after payloaddddd");
                
                form1.parse(req, async (err, fields, files) => {
                    console.log("in controller", req["user"], "fieldsss:", fields, "filesss:", files);

                    if (err) {
                        next(err);
                        return;
                    }
                    payload = await generateTopicUrl(files, fields, 'file');
                    // console.log("payloaddddd",payload);
                    
                    topicData.attachment_url = payload.url;

                    // const readFileData = fs.readFileSync(fileData.path); //reads file from the uploads directory
                    // const formData = new FormData(); //formData is need to upload file to the Strapi
                    // console.log(fileData, '---file Data---');
                    // const admin = {
                    //   identifier: 'Clement',
                    //   password: 'clemBassure123',
                    // }; // These are the strapi admin credentials, to be set in the env file??Pending
                    // const strapiToken = await axios.post(
                    //   `${STRAPI_URL}/api/auth/local`,
                    //   admin
                    // ); // To get the strapi token
                    // formData.append('files', readFileData, fileData.originalname);
                    // const strapiUrl = `${STRAPI_URL}api`;
                    // const endpoint = '/upload';
                    // const uploadFile = await axios.post(
                    //   `${STRAPI_URL}/api/upload`,
                    //   formData,
                    //   {
                    //     headers: {
                    //       'Content-Type': `multipart/form-data`,
                    //       Authorization: `Bearer ${strapiToken.data.jwt}`,
                    //     },
                    //   }
                    // ); // To upload a file to the strapi
                    // const fileId = uploadFile.data[0].id;
                    // const myObj = {
                    //   data: {
                    //     title: '',
                    //     content: 0,
                    //   },
                    // }; // ReqBody for posting the content to strapi
                    // myObj['data']['title'] = req.body.title;
                    // myObj['data']['content'] = fileId;
                    // const strapiData = myObj;
                    // const strapi = await axios.post(
                    //   `${STRAPI_URL}/api/topics?populate=*`,
                    //   strapiData
                    // ); // To post the content to strapi
                    // const attachmentUrl =
                    //   strapi.data.data.attributes.content.data[0].attributes.url;
                    // topicData.attachment_url = `${STRAPI_URL}${attachmentUrl}`;
                    topicData.topic_link = null;
                    topicData.updated_by = decoded['id'];
                    console.log(topicData.updated_by, '----topicData.updated_by----');

                    const updateTopicData: Topic = await this.topicService.updateTopic(
                        topicId,
                        topicData, jwtToken
                    );
                    // const folderPath = './uploads';
                    // // The below code reads the file from the folderPath and deletes it every time.
                    // fs.readdir(folderPath, (err, files) => {
                    //     if (err) {
                    //         return console.error(err);
                    //     }
                    //     files.forEach((file) => {
                    //         console.log(file, '---file----');
                    //         const filePath = `${folderPath}/${file}`;
                    //         fs.unlink(filePath, (err) => {
                    //             if (err) {
                    //                 return console.error(err, 'erroeeeee');
                    //             }
                    //             console.log(`Deleted file: ${filePath}`);
                    //         });
                    //     });
                    // });
                    const response = responseCF(
                        bodyCF({
                            // val: { userData: updateTopicData },
                            code: '600',
                            status: 'success',
                            message: 'Topic updated successfully',
                        })
                    );
                    return res.json(response);
                })
            }
            // If file is not being update
            if (isTopicTypeValid && !req.file) {
                topicData.attachment_url = req.body.attachment_url;
                topicData.topic_link = null;
                topicData.updated_by = decoded['id'];
                const updateTopicData: Topic = await this.topicService.updateTopic(
                    topicId,
                    topicData, jwtToken
                );
                const response = responseCF(
                    bodyCF({
                        val: { userData: updateTopicData },
                        code: '600',
                        status: 'success',
                        message: 'Topic updated successfully',
                    })
                );
                return res.json(response);
            }
            /** Sets topic_link and set attachment_url to null */
            if (req.body.topic_type === 'Topic Link' && req.body.topic_link) {
                console.log('in else');
                topicData.created_by = decoded['id'];
                const updateTopicData: Topic = await this.topicService.updateTopic(
                    topicId,
                    topicData, jwtToken
                );
                const response = responseCF(
                    bodyCF({
                        val: updateTopicData,
                        code: '600',
                        status: 'success',
                        message: 'Topic updated successfully',
                    })
                );
                return res.json(response);
            } else {
                const response = responseCF(
                    bodyCF({
                        code: '611',
                        status: 'error',
                        message:
                            'Either providing Topic Link or Uploading a file is mandatory',
                    })
                );
                return res.json(response);
            }
        } catch (error) {
            const response = responseCF(
                bodyCF({
                    message: error.message,
                    code: '611',
                    status: 'error',
                })
            );
            console.log(error);
            return res.json(response);
        }
    };

    public deleteTopic = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const topicId = Number(req.params.id);
            const authHeader = req.headers.authorization;
            const jwtToken = authHeader.split(' ')[1];
            const secret = SECRET_KEY;
            const decoded = jwt.verify(jwtToken, secret);
            const deletedBy = decoded['id'];
            const deleteTopicData: Topic = await this.topicService.deleteTopic(
                topicId,
                deletedBy
            );
            const response = responseCF(
                bodyCF({
                    val: { userData: deleteTopicData },
                    code: '600',
                    status: 'success',
                    message: 'Topic deleted successfully',
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
            console.log(error);
            return res.json(response);
        }
    };

    public deleteTopics = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const topicIds = req.body.ids;

            const authHeader = req.headers.authorization;
            const jwtToken = authHeader.split(' ')[1];
            const secret = SECRET_KEY;
            const decoded = jwt.verify(jwtToken, secret);
            const deletedBy = decoded['id'];
            const promises = topicIds.map(async (topicId) => {
                const deletedTopic = await this.topicService.deleteTopic(
                    topicId,
                    deletedBy
                );
                return { id: topicId, topic: deletedTopic };
            });
            // Waits for all promises to resolve
            const deletedTopics = await Promise.all(promises);

            const response = responseCF(
                bodyCF({
                    val: { userData: deletedTopics },
                    code: '600',
                    status: 'success',
                    message: 'Topics deleted successfully',
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
            console.log(error);
            return res.json(response);
        }
    };

    public s3FileConvertToLink = async(req:Request,res:Response,next:NextFunction)=>{
        const fileName =req.params.fileName

        try{

            const responseLink = await this.topicService.convertFileToLinkS3(fileName);

        const response = responseCF(
            bodyCF({
                val:  responseLink,
                code: '600',
                status: 'success',
                message: 'Fetched link successfully',
            })
        );
        return res.json(response);
        }catch(error){
            const response = responseCF(
                bodyCF({
                    message: error.message,
                    code: '611',
                    status: 'error',
                })
            );
            console.log(error);
            return res.json(response);

        }

        

    }
}

export default TopicsController;
