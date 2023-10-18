import MsTemasRoute from './app/route/ms-teams.route';

import App from './serverApp';

const routes = [];
routes.push(new MsTemasRoute());

const app = new App(routes);
app.listen();
