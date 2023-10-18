import CoursesAdminMetricsRoute from './app/route/courses_admin_metrics.route';
import CoursesLearnerMetricsRoute from './app/route/courses_learner_metrics.route';
import App from './serverApp';
import TracksRoute from './app/route/tracks.route';
import TopicsRoute from './app/route/topics.route';
import ChaptersRoute from './app/route/chapters.route';

import CoursesTrainerMetricsRoute from './app/route/courses_trainer_metrics.route';
// import chapterssRoute from './app/route/chapterss.route';
import DomainTechnologyRoute from './app/route/domain_technology.route';
import ActivitiesLogRoute from './app/route/activities_log.route';
import AssessmentRoute from './app/route/assessment.route';

const routes = [];
routes.push(new TracksRoute());
routes.push(new TopicsRoute());
routes.push(new ChaptersRoute());
routes.push(new CoursesAdminMetricsRoute());
routes.push(new CoursesLearnerMetricsRoute());
routes.push(new CoursesTrainerMetricsRoute());
// routes.push(new chapterssRoute());
routes.push(new DomainTechnologyRoute());
routes.push(new ActivitiesLogRoute());
routes.push(new AssessmentRoute());
const app = new App(routes);
app.listen();
