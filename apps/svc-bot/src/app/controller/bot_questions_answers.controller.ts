import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';
import BotQuestionsAnswersService from '../service/bot_questions_answers.service';
import { NextFunction, Request, Response } from 'express';
import { CreateBotQuestionsAnswersDto } from '../dto/bot_questions_answers.dto';
import { BotQuestionsAnswers } from '../interface/bot_questions_answers.interface';

class BotQuestionsAnswersController {
  public botQuestionsAnswersService = new BotQuestionsAnswersService();

  public chatGptGetAnswer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const botData: CreateBotQuestionsAnswersDto = req.body;
      console.log(botData,"botdata");
      
      const searchData: BotQuestionsAnswers =
        await this.botQuestionsAnswersService.getChatGpt(botData);
      const response = responseCF(
        bodyCF({
          val: searchData,
          code: '600',
          status: 'success',
        })
      );
      return res.json(response);
      
      
    } catch (error) {
      console.log('error', error);
      const response = responseCF(
        bodyCF({ message: error.message, code: '611', status: 'error' })
      );
      return res.json(response);
    }
  };
}

export default BotQuestionsAnswersController;
