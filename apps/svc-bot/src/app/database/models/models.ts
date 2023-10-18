import { Sequelize } from 'sequelize';
import { bot_questions_answers as _bot_questions_answers } from './bot_questions_answers';
import type {
  bot_questions_answersAttributes,
  bot_questions_answersCreationAttributes,
} from './bot_questions_answers';

export { _bot_questions_answers as bot_questions_answers };

export type {
  bot_questions_answersAttributes,
  bot_questions_answersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const bot_questions_answers = _bot_questions_answers.initModel(sequelize);

  return {
    bot_questions_answers: bot_questions_answers,
  };
}
