import { Configuration, OpenAIApi } from 'openai';
import { CHAP_GPT_API_KEY } from '../config';
import DB from '../database/index';
import { HttpException } from '@athena/shared/exceptions';
import { Op } from 'sequelize';
import { BotQuestionsAnswers } from '../interface/bot_questions_answers.interface';

const configuration = new Configuration({
  apiKey: CHAP_GPT_API_KEY,
});
// Creating a new instance of the Configuration class with the OpenAI API key

const openai = new OpenAIApi(configuration);
// Creating a new instance of the OpenAIApi class with the configuration

class BotQuestionsAnswersService {
  public botQuestionsAnswers = DB.DBmodels.bot_questions_answers;
  // Assigning the bot_questions_answers model from the DB module to the botQuestionsAnswers property

  public async getChatGpt(botData) {
    try {
      const query = botData.question;
      // Extracting the question from the botData

      if (botData.questionToBot) {
        console.log('Question to bot');

        // If the question is directed to the bot
        const getData: any = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: botData.questionToBot }],
        });
        // Generating a chat completion using OpenAI API
        // The user message is provided to the model

        const answer = getData.data.choices[0].message.content;
        // Extracting the generated answer from the API response

        return answer;
        // Returning the generated answer
      }

      if (botData.questionButton) {
        console.log('Question Button');
        // If a question button is clicked
        const questions = await this.botQuestionsAnswers.findOne({
          where: { question: botData.questionButton },
        });
        // Retrieving the matching question from the database

        return questions;
        // Returning the matching question
      } else if (botData.question) {
        console.log('general question');

        // If a general question is asked
        const { q } = query;

        if (botData.question == 'hi' || botData.question == 'hello')
          return { answer: 'Hello! How may I assist you today?' };
        // If the question is a greeting, return a predefined response

        const words = query.split(' ').filter((word) => word.length > 0);
        // Splitting the query into words and filtering out empty words

        const likePatterns = words.map((word) => `%${word}%`);
        // Creating patterns for searching similar questions using Sequelize

        const where = {
          [Op.or]: [{ question: { [Op.like]: { [Op.any]: likePatterns } } }],
        };
        // Creating a where clause for Sequelize to search for similar questions

        const questions = await this.botQuestionsAnswers.findAll({ where });
        // Retrieving all questions matching the patterns from the database

        if (questions.length) {
          console.log('To return questions');

          // If matching questions are found in the database
          const question = questions.map((q) => q.question);
          // Extracting the questions from the query result

          const numQuestions = question.length;
          // Getting the number of questions found

          if (numQuestions === 3) {
            console.log('To return 3 questions');
            return question;
            // If exactly three questions are found, return the questions
          } else if (numQuestions > 3) {
            // If more than three questions are found

            console.log('To return 3 questions from multiple questions');
            const randomValues = [];
            const usedIndexes = new Set();

            while (randomValues.length < 3) {
              const randomIndex = Math.floor(Math.random() * numQuestions);
              // Selecting a random index from the available questions

              const questionWords = question[randomIndex].split(' ');
              // Splitting the question into words

              if (!usedIndexes.has(randomIndex) && questionWords.length >= 3) {
                // Checking if the index is not used and the question has at least three words

                console.log(
                  'Checked if the index is not used and the question has at least three words'
                );
                randomValues.push(question[randomIndex]);
                usedIndexes.add(randomIndex);
              }
            }

            return randomValues;
            // Returning the randomly selected questions
          } else if (numQuestions < 3) {
            // If less than three questions are found

            console.log(question[0], '*****first question*****');
            // Logging the first question

            return question;
            // Returning the single question in the array
          } else {
            console.log('No questions found');
            return 'No questions found';
            // If no questions are found, return a message indicating no questions found
          }
        } else {
          // If the question is not found in the database, use OpenAI to generate an answer
          const getData: any = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: query }],
          });
          // Generating a chat completion using OpenAI API
          // The user message is provided to the model

          const answer = getData.data.choices[0].message.content;
          // Extracting the generated answer from the API response

          const createBotData: BotQuestionsAnswers =
            await this.botQuestionsAnswers.create({
              ...botData,
              question: query,
              answer: answer,
            });
          // Creating a new entry in the database with the question, answer, and other botData

          return createBotData;
          // Returning the created entry
        }
      }
    } catch (e) {
      throw new HttpException(409, e);
      // Throwing an HTTP exception with the status code 409 and the error message
    }
  }
}

export default BotQuestionsAnswersService;
