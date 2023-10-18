import { NextFunction, Request, Response } from 'express';
import { CreateChapterDto } from '../dto/chapters.dto';
import { Chapter } from '../interface/chapters.interface';
import chapterService from '../service/chapters.service';
import {
  bodyCF,
  responseCF,
} from '../../../../../libs/commonResponse/commonResponse';
import { SECRET_KEY } from '../config';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from '../interface/routes.interface';
import { User } from '../interface/routes.interface';
// import { parseRequestFiles } from '../../../../../file_upload/requestedfiles';

interface FileRequest extends RequestWithUser {
  file: any; // replace 'any' with the type of the uploaded file if known
}
class ChaptersController {
  public chapterService = new chapterService();

  public getChapters = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllChaptersData: Chapter[] =
        await this.chapterService.findAllChapter();
      const response = responseCF(
        bodyCF({
          val: findAllChaptersData,
          code: '600',
          status: 'success',
          message: 'Chapters found successfully',
        })
      );
      console.log("hhhhhhhhhhhhhhhhhhhhh", response)
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '610',
          status: 'error',
          message: `${error}`,
        })
      );
      return res.json(response);
    }
  };

  public getChapterById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const chapterId = Number(req.params.id);
      const findOneChapterData: Chapter =
        await this.chapterService.findChapterById(chapterId);

      const response = responseCF(
        bodyCF({
          val: findOneChapterData,
          code: '600',
          status: 'success',
          message: 'Chapter found successfully',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '610',
          status: 'error',
          message: `${error}`,
        })
      );
      return res.json(response);
    }
  };

  // public createChapter = async (
  //     req: FileRequest,
  //     res: Response,
  //     next: NextFunction
  // ) => {
  //     try {
  //         // console.log("edddddddd",req.body);
  //         const chapterData: CreateChapterDto = req.body;
  //         const userDataFromToken: User = req.user;
  //         const token: any = req.token;
  //         console.log('entered controller reqbody: ', chapterData);
  //         let createChapterData: Chapter;
  //         if (req?.params?.option && req?.params?.option === "throughtrack") {
  //             createChapterData = await this.chapterService.createChapterThroughTrack(chapterData, userDataFromToken, token);
  //         }
  //         else {
  //             createChapterData = await this.chapterService.createChapter(chapterData, userDataFromToken, token);
  //             console.log("before", createChapterData)

  //             try {
  //                 const response = responseCF(
  //                         bodyCF({
  //                             val: createChapterData,
  //                             code: '600',
  //                             status: 'success',
  //                             message: 'Chapter Created successfully',
  //                         })
  //                     );
  //                     console.log("befitself")
  //                     console.log("llllllluiui", res.headersSent, response)
  //                     try {
  //                             return res.json(response); 
  //                     } catch (error) {
  //                         console.log("eeeeeeeeeee", error);
  //                     }
  //             } catch (error) {
  //                 console.log("ffffffffff", error);
  //             }
  //         }



  //     } catch (error) {
  //         console.log("____________errorinCHAPTERCONTROLLER",error)
  //         const response = responseCF(
  //             bodyCF({
  //                 code: '610',
  //                 status: 'error',
  //                 message: `${error}`,
  //             })
  //         );
  //         return res.json(response);
  //     }
  // };

  public createChapter = async (
    req: FileRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // console.log("edddddddd",req.body);
      const chapterData: CreateChapterDto = req.body;
      const userDataFromToken: User = req.user;
      const token: any = req.token;
      console.log('entered controller reqbody: ', chapterData);
      let createChapterData: Chapter;
      if (req.params.option && req.params.option === "throughtrack") {
        createChapterData = await this.chapterService.createChapterThroughTrack(chapterData, userDataFromToken, token);
      }
      else {
        console.log("llllllluiui", res.headersSent)
        createChapterData = await this.chapterService.createChapter(chapterData, userDataFromToken, token);
      }
      const response = responseCF(
        bodyCF({
          val: createChapterData,
          code: '600',
          status: 'success',
          message: 'Chapter Created successfully',
        })
      );
      return res.json(response);
    } catch (error) {
      console.log("error", error);
      const response = responseCF(
        bodyCF({
          code: '610',
          status: 'error',
          message: `${error}`,
        })
      );
      return res.json(response);
    }
  };
  public publishChapter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const chapterId = Number(req.params.id);
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      console.log(jwtToken, '----jwttoken----');
      const decoded = jwt.verify(jwtToken, secret);
      console.log(decoded, '----decodeedddeddd-----');
      const approvedBy = decoded['id'];
      const publishChapter = await this.chapterService.publishChapter(
        chapterId,
        approvedBy
      );
      console.log(publishChapter, '----jdkdsjfdsj=--');
      const response = responseCF(
        bodyCF({
          val: { userData: publishChapter },
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

  public publishChapters = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const topicIds = req.body.ids;
      let error;
      const arrOfPublishedTopics = [];
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      console.log(jwtToken, '----jwttoken----');
      const decoded = jwt.verify(jwtToken, secret);
      console.log(decoded['name'], '----decodeedddeddd-----');
      const approvedBy = decoded['id'];
      // let publishTopic: Topic;
      console.log(topicIds, '---potic data-----');
      for (const userData of topicIds) {
        console.log(userData, '--0userData0');
        const publishTopics: Chapter[] =
          await this.chapterService.publishChapter(userData, approvedBy);
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
      // topicIds.map(async (topicId) => {
      //   console.log(topicId, '---id----');
      //   const publishTopic: Topic = await this.topicService.publishTopic(
      //     topicId,
      //     error
      //   );
      //   console.log(publishTopic, '=====oubu');
      //   arr.push(publishTopic);
      //   console.log(arr.length, '----ar----');
      //   const errorOfReturn = ['Topic Not Found'];
      //   // if (publishTopic) {
      //   // res.json(publishTopic);
      //   // }
      // });
      // console.log(arr, '-out---ar----');

      // res.json(arr)
      // console.log(publishTopic, '-----bublish-----');
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

  public updateChapterStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const chapterId = Number(req.params.id);
      const chapterData = req.body;
      console.log("popiuytrtyuiop", chapterId, chapterData)
      const updateChapterStatus = await this.chapterService.updateChapterStatus(
        chapterId,
        chapterData
      )
      const response = responseCF(
        bodyCF({
          val: { userData: updateChapterStatus },
          code: '600',
          status: 'success',
          message: 'Chapter updated successfully',
        })
      );
      return res.json(response);
    } catch (err) {
      const response = responseCF(
        bodyCF({
          message: err.message,
          code: '611',
          status: 'error',
        })
      );
      console.log(err);
      return res.json(response);

    }
  }

  // public createChapter = async (
  //     req: FileRequest,
  //     res: Response,
  //     next: NextFunction
  // ) => {
  //     try {
  //         // console.log("edddddddd",req.body);
  //         const chapterData: CreateChapterDto = req.body;
  //         const userDataFromToken: User = req.user;
  //         const token: any = req.token;
  //         console.log('entered controller reqbody: ', chapterData);
  //         let createChapterData: Chapter;
  //         if (req?.params?.option && req?.params?.option === "throughtrack") {
  //             createChapterData = await this.chapterService.createChapterThroughTrack(chapterData, userDataFromToken, token);
  //         }
  //         else {
  //             createChapterData = await this.chapterService.createChapter(chapterData, userDataFromToken, token);
  //             console.log("before", createChapterData)

  //             try {
  //                 const response = responseCF(
  //                         bodyCF({
  //                             val: createChapterData,
  //                             code: '600',
  //                             status: 'success',
  //                             message: 'Chapter Created successfully',
  //                         })
  //                     );
  //                     console.log("befitself")
  //                     console.log("llllllluiui", res.headersSent, response)
  //                     try {
  //                             return res.json(response);
  //                     } catch (error) {
  //                         console.log("eeeeeeeeeee", error);
  //                     }
  //             } catch (error) {
  //                 console.log("ffffffffff", error);
  //             }
  //         }

  //     } catch (error) {
  //         console.log("____________errorinCHAPTERCONTROLLER",error)
  //         const response = responseCF(
  //             bodyCF({
  //                 code: '610',
  //                 status: 'error',
  //                 message: `${error}`,
  //             })
  //         );
  //         return res.json(response);
  //     }
  // };


  public updateChapter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const chapterId = Number(req.params.id);
      const chapterData: CreateChapterDto = req.body;
      if (req?.body?.status) {
        // const chaptertatus = req.body.status;
        console.log("chapterssstatttssssssussssss");
        console.log("chaptersssdataaaaa",chapterId,chapterData)
        const updateChapterStatus = await this.chapterService.updateStatus(
          chapterId,
          chapterData
        );
        const response = responseCF(
          bodyCF({
            val: { userData: updateChapterStatus },
            code: '600',
            status: 'success',
            message: 'Chapter updated successfully',
          })
        );
        return res.json(response);
      }

      const updateChapterData: Chapter =
        await this.chapterService.updateChapter(chapterId, chapterData);

      const response = responseCF(
        bodyCF({
          val: updateChapterData,
          code: '600',
          status: 'success',
          message: 'Chapters found successfully',
        })
      );
      console.log('hhhhhhhhhhhhhhhhhhhhh', response);
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

  public deleteChapter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const chapterId = Number(req.params.id);
      const deleteChapterData: Chapter =
        await this.chapterService.deleteChapters(chapterId);

      res.status(200).json({ data: deleteChapterData, message: 'deleted' });
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

  public deleteChapters = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const chapterIds = req.body.ids;
      console.log(chapterIds, '---potic data-----');
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      console.log(jwtToken, '----jwttoken----');
      const decoded = jwt.verify(jwtToken, secret);
      console.log(decoded['name'], '----decodeedddeddd-----');
      const deletedBy = decoded['id'];
      // Creates an array of promises that resolve to the deleted topics
      const promises = chapterIds.map(async (chapterId) => {
        const deletedChapter = await this.chapterService.deleteChapter(
          chapterId,
          deletedBy
        );
        return { id: chapterId, chapter: deletedChapter };
      });
      // Waits for all promises to resolve
      const deletedChapters = await Promise.all(promises);

      // Returns the deleted topics in the response
      const response = responseCF(
        bodyCF({
          val: { userData: deletedChapters },
          code: '600',
          status: 'success',
          message: 'Chapters deleted successfully',
        })
      );
      return res.json(response);

      // console.log(deleteTopics, '-----bublish-----');
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
      // } else next(error);
    }
  };

  public getChapterBasedOnFilterAndSearch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let response;
      if (!Number.isInteger(req.body.pageNo) || req.body.pageNo <= 0) {
        response = responseCF(
          bodyCF({
            code: 611,
            status: 'error',
            message: 'Invalid page number',
          })
        );
      }

      if (req.body.searchkey) {
        console.log('here');
        const foundChaptersData: Chapter[] =
          await this.chapterService.searchChapter(req.body);
        response = responseCF(
          bodyCF({
            val: { chapterData: foundChaptersData },
            code: 600,
            status: 'success',
            message: 'chapters records matching search key',
          })
        );
      } else {
        const sortChapterData: Chapter[] =
          await this.chapterService.chapterFilterSort(req.body);
        response = responseCF(
          bodyCF({
            val: { chapterData: sortChapterData },
            code: 600,
            status: 'success',
            message: 'Filtered chapters',
          })
        );
      }
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: 611,
          status: 'error',
          message: error.message,
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  public verifyChapter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // let payload = req.body;
      const payload = req.body;
      // console.log("topicuploadbulk////////////", payload)

      const chapterData: Chapter = await this.chapterService.verifyChapter(
        payload.title
      );
      const response = responseCF(
        bodyCF({
          val: { chapterData: chapterData },
          code: '600',
          status: 'success',
          message: 'There is no existing chapter with given title',
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
      // console.log(error);
      return res.json(response);
    }
  };
}

export default ChaptersController;
