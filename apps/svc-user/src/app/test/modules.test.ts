import { config } from 'dotenv';
config({ path: '.env.development.local' });
import request from 'supertest';
import App from '../../serverApp';
import ModulesRoute from '../route/modules.route';

const url = '/api/users/modules';

describe(`[GetAll] ${url}/get`, () => {
    it('get all modules', async () => {
      const moduleRoute: ModulesRoute = new ModulesRoute();
      const app: App = new App([moduleRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/users${moduleRoute.path}/get`)
      expect(response.body.body.code).toBe('600');
    });
    it('invalid url', async () => {
      const moduleRoute: ModulesRoute = new ModulesRoute();
      const app: App = new App([moduleRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/users${moduleRoute.path}/getAsllmodules`)
      expect(response.body.body.code).toBe('611');
    });
  });