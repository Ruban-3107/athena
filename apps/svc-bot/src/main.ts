import App from './serverApp';
import BotQuestionsAnswersRoute from './app/route/bot_questions_answers.route';

const routes = [];

routes.push(new BotQuestionsAnswersRoute());

const app = new App(routes);
app.listen();