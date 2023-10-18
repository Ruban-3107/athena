import App from './serverApp';
import AdminMetricsRoute from './app/route/admin_metrics.route';
import LearnerMetricsRoute from './app/route/learner_metrics.route';
import TrainerMetricsRoute from './app/route/trainer_metrics.route';

const routes = [];
routes.push(new AdminMetricsRoute());
routes.push(new LearnerMetricsRoute());
routes.push(new TrainerMetricsRoute());
const app = new App(routes);
app.listen();
