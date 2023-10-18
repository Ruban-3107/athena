import { Router } from 'express';
import TopicsController from '../controller/topics.controller';
import { CreateTopicDto } from '../dto/topics.dto';
import { Routes } from '../interface/routes.interface';
import { validationMiddleware } from '../middleware/validation.middleware';
import authMiddleware  from '../middleware/auth.middleware';
// import multer, { diskStorage } from 'multer';

// const storage = diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const extension = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + Date.now() + extension);
//   },
// });

// const upload = multer( { storage: storage });

class TopicsRoute implements Routes {
  public path = '/topics';
  public router = Router();
  public topicsController = new TopicsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //To get topics
    this.router.get(
      `${this.path}`,
      //authMiddleware,
      this.topicsController.getTopics
    );
    //To get topic by Id
    this.router.get(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.topicsController.getTopicById
    );
    //To get topic by status
    this.router.get(
      `${this.path}/:status`,
      //authMiddleware,
      this.topicsController.getTopicsByStatus
    );
    /**
     * To search a topic based on title and to filter a topic based on delivery_type, topic_type and status
     * Sample ReqBody for search:
     *  {
          "searchKey":"${title}"
        }
     * Sample ReqBody for filter:
     *  {
          "delivery_type":"${title}"
        }
     */
    this.router.post(
      `${this.path}/searchAndFilterTopic`,
      //authMiddleware,
      this.topicsController.getTopicsBasedOnFilterAndSearch
    );
    /**
     * To publish multiple a topic
     * Sample ReqBody:
     *  {
          "ids":[378, 379]
        }
     */
    this.router.put(
      `${this.path}/publishTopics/top`,
      authMiddleware,
      //validationMiddleware(CreateTopicDto),
      this.topicsController.publishTopics
    );
    //To publish topic by id
    this.router.put(
      `${this.path}/publishTopic/:id`,
      //authMiddleware,
      // validationMiddleware(CreateTopicDto),
      this.topicsController.publishTopic
    );

    this.router.post(
      `${this.path}/create/topic`,
      authMiddleware,
     validationMiddleware(CreateTopicDto, 'body'),
      this.topicsController.createTopiclink
    );

    this.router.post(
      `${this.path}/throughchapter`,
      authMiddleware,
     validationMiddleware(CreateTopicDto),
      this.topicsController.createTopicThroughChapter
    );
    /** To update a topic using id */
    this.router.post(
      `${this.path}/:id(\\d+)`,
      //authMiddleware,
      // validationMiddleware(CreateTopicDto, 'body', true),
      // upload.single('file'),
      this.topicsController.updateTopic
    );

    this.router.put(
      `${this.path}/status`,
      authMiddleware,
      this.topicsController.updateTopicStatus
    );
    /** To delete(soft) a topic by id */
    this.router.delete(
      `${this.path}/:id(\\d+)`,
      //authMiddleware,
      this.topicsController.deleteTopic
    );
    /** To delete(soft) multiple topics
     * Sample ReqBody:
     *
      {
        "ids":[2,3]
      }
    */
    this.router.delete(
      `${this.path}/deleteTopics`,
      //authMiddleware,
      this.topicsController.deleteTopics
    );

    this.router.post(
      `${this.path}/convertFileToLinkS3/:fileName`,
      this.topicsController.s3FileConvertToLink
    )
  }
}

export default TopicsRoute;
