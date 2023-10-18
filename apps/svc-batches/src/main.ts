import BatchesAdminMetricsRoute from './app/route/batches_admin_metrics.route';
import BatchesLearnerMetricsRoute from './app/route/batches_learner_metrics.route';
import BatchesTrainerMetricsRoute from './app/route/batches_trainer_metrics.route';
import BatchesRoute from './app/route/batches.route';
import SchedulesRoute from './app/route/schedules.route';
import UserTracksRoute from './app/route/user_tracks.route';
import App from './serverApp';

//import BatchesRoute from './app/route/batches.route';

const routes = [];
//routes.push(new BatchesRoute());
routes.push(new BatchesAdminMetricsRoute());
routes.push(new BatchesLearnerMetricsRoute());
routes.push(new BatchesTrainerMetricsRoute());
routes.push(new BatchesRoute());
routes.push(new SchedulesRoute());
routes.push(new UserTracksRoute());
const app = new App(routes);
app.listen();
