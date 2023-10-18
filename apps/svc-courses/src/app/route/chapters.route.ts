import { Router } from 'express';
import ChaptersController from '../controller/chapters.controller';
import { CreateChapterDto } from '../dto/chapters.dto';
import { Routes } from '../interface/routes.interface';
import { validationMiddleware } from '../middleware/validation.middleware';
import authMiddleware  from '../middleware/auth.middleware';
import { generateTopicUrl } from '../middleware/generateTopicUrl.middleware';
// import multer, { diskStorage } from 'multer';
// import formidable from 'formidable';
// import bodyParser from 'body-parser';
// import fs from 'fs';
// import AWS from 'aws-sdk';

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

class ChaptersRoute implements Routes {
    // public urlencodedParser = bodyParser.urlencoded({ extended: false });
    public path = '/chapters';
    public router = Router();
    public chaptersController = new ChaptersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.chaptersController.getChapters
    );

        /**Filter chapters*/
        this.router.post(
            `${this.path}/getChapters`,
            authMiddleware,
            this.chaptersController.getChapterBasedOnFilterAndSearch
        );

    this.router.get(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.chaptersController.getChapterById
    );

        this.router.post(
            `${this.path}/create/chapter`,
            authMiddleware,
            generateTopicUrl,
            validationMiddleware(CreateChapterDto, 'body'),
            this.chaptersController.createChapter
        );
        this.router.post(
            `${this.path}/:option`,
            authMiddleware,
            validationMiddleware(CreateChapterDto, 'body'),
            this.chaptersController.createChapter
        );

    this.router.put(
      `${this.path}/publishChapters`,
      authMiddleware,
      // validationMiddleware(CreateChapterDto),
      this.chaptersController.publishChapters
    );
    this.router.put(
      `${this.path}/publishTopic/:id`,
      authMiddleware,
      // validationMiddleware(CreateChapterDto),
      this.chaptersController.publishChapter
    );
    this.router.put(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      // validationMiddleware(CreateChapterDto, 'body', true),
      this.chaptersController.updateChapter
    );

    this.router.put(
      `${this.path}/status`,
      authMiddleware,
      this.chaptersController.updateChapterStatus
    );

    this.router.delete(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.chaptersController.deleteChapter
    );
    this.router.delete(
      `${this.path}/deleteChapters`,
      authMiddleware,
      this.chaptersController.deleteChapters
    );
    this.router.post(
      `${this.path}/verifyChapter`,
      this.chaptersController.verifyChapter
    );
  }
}

export default ChaptersRoute;
