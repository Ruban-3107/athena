import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional, NonAttribute } from 'sequelize';

export interface bot_questions_answersAttributes {
  id: number;
  question?: string;
  answer?: string;
  created_at: Date;
  updated_at?: Date;
}

export type bot_questions_answersPk = 'id';
export type bot_questions_answersId =
  bot_questions_answers[bot_questions_answersPk];
export type bot_questions_answersOptionalAttributes =
  | 'id'
  | 'question'
  | 'answer';
export type bot_questions_answersCreationAttributes = Optional<
  bot_questions_answersAttributes,
  bot_questions_answersOptionalAttributes
>;

export class bot_questions_answers
  extends Model
  implements bot_questions_answersAttributes
{
  id: number;
  question?: string;
  answer?: string;
  created_at!: Date;
  updated_at?: Date;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof bot_questions_answers {
    return bot_questions_answers.init(
      {
        id: {
          autoIncrement: true,
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        question: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        answer: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Date.now()
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'bot_questions_answers',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'bot_questions_answers_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
