import { Router } from 'express';
import BotQuestionsAnswersController from '../controller/bot_questions_answers.controller';
import { Routes } from '../interface/routes.interface';
class BotQuestionsAnswersRoute implements Routes {
  public path = '/botQuestionsAnswers';
  public router = Router();
  public botQuestionsAnswersController = new BotQuestionsAnswersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
         * Route Name: botQuestionsAnswers
         * Route: http://localhost:3004/api/bot/botQuestionsAnswers
         * ReqBody:{
                        "question": "java"
                   } (or)
                   {
                        "questionToBot": "java"
                   } (or)
                   {
                        "questionButton": "java"
                   }
    */
    this.router.post(
      `${this.path}`,
      this.botQuestionsAnswersController.chatGptGetAnswer
    );
  }
}

export default BotQuestionsAnswersRoute;
