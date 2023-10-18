import { config } from 'dotenv';
config({ path: '.env.development.local' });
import request from 'supertest';
import App from '../../serverApp';
import RolesRoute from '../route/roles.route';

const url = '/api/users/roles';
let currentlyCreatedId: any;
const reqBody = {
  name: 'rolesName',
  description: 'example_description',
};
const updateReqBody = {
  name: 'example11s2s_name',
  description: 'example_description',
};

describe('testing the roles route', () => {
  describe(`[POST] ${url}`, () => {
    it('creating role', async () => {
      const rolesRoute: RolesRoute = new RolesRoute();
      const app: App = new App([rolesRoute]);
      const response: request.Response = await request(app.getServer())
        .post(`/api/users${rolesRoute.path}/createRoles`)
        .send(reqBody);
      console.log(response.body, '---opense---');

      expect(response.body.body.code).toBe('600');
      currentlyCreatedId = response.body.body.value.id;
    });
    it('role already exists', async () => {
      const rolesRoute: RolesRoute = new RolesRoute();
      const app: App = new App([rolesRoute]);
      console.log(currentlyCreatedId, '----currentlyCreatedIdhh----');

      const response: request.Response = await request(app.getServer())
        .post(`/api/users${rolesRoute.path}/createRoles`)
        .send(reqBody);
      console.log(response, 'roleseresp');

      expect(response.body.body.code).toBe('611');
      currentlyCreatedId = response.body.body.value.id;
    });
    it('invalid url', async () => {
      const rolesRoute: RolesRoute = new RolesRoute();
      const app: App = new App([rolesRoute]);
      const response: request.Response = await request(app.getServer())
        .post(`/api/users${rolesRoute.path}/crweateRoles`)
        .send(reqBody);
      expect(response.body.body.code).toBe('611');
    });
  });
  describe(`[GET] ${url}/:id`, () => {
    it('get role by id', async () => {
      const rolesRoute: RolesRoute = new RolesRoute();
      const app: App = new App([rolesRoute]);
      console.log(currentlyCreatedId, '---getid990---');

      const routeName = `/api/users${rolesRoute.path}/${currentlyCreatedId}`;
      console.log(routeName, '-----goutename----');

      const response: request.Response = await request(app.getServer())
        .get(`/api/users${rolesRoute.path}/2`)
      console.log(response.body, '---poensin----');

      expect(response.body.body.code).toBe('600');
    });
    it('invalid id', async () => {
      const rolesRoute: RolesRoute = new RolesRoute();
      const app: App = new App([rolesRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/users${rolesRoute.path}/a`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      expect(response.body.body.code).toBe('611');
    });
    it('invalid url', async () => {
      const rolesRoute: RolesRoute = new RolesRoute();
      const app: App = new App([rolesRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/ussser${rolesRoute.path}/29`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      expect(response.body.body.code).toBe('611');
    });
  });
  describe(`[PUT] ${url}`, () => {
    it('updating role', async () => {
      const rolesRoute: RolesRoute = new RolesRoute();
      const app: App = new App([rolesRoute]);
      const response: request.Response = await request(app.getServer())
        .put(`/api/users${rolesRoute.path}/10`)
        .send(updateReqBody);
      console.log(response.body, '---opense---');

      expect(response.body.body.code).toBe('600');
      currentlyCreatedId = response.body.body.value.id;
    });
    it('invalid url', async () => {
      const rolesRoute: RolesRoute = new RolesRoute();
      const app: App = new App([rolesRoute]);
      const response: request.Response = await request(app.getServer())
        .put(`/api/users${rolesRoute.path}/crweateRoles`)
        .send(reqBody);
      expect(response.body.body.code).toBe('611');
    });
  });
  describe(`[GET all] ${url}/getRoles`, () => {
    it('get role by id', async () => {
      const rolesRoute: RolesRoute = new RolesRoute();
      const app: App = new App([rolesRoute]);
      console.log(currentlyCreatedId, '---getid990---');

      const routeName = `/api/users${rolesRoute.path}/getRoles`;
      console.log(routeName, '-----goutename----');

      const response: request.Response = await request(app.getServer())
        .get(`/api/users${rolesRoute.path}/getRoles`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      console.log(response.body, '---poensin----');

      expect(response.body.body.code).toBe('600');
    });
    it('invalid jwt', async () => {
      const rolesRoute: RolesRoute = new RolesRoute();
      const app: App = new App([rolesRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/users${rolesRoute.path}/getRoles`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiI68289e309404iu3dsjhfdsjsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
        console.log(response,'---0opo');
        
      expect(response.body.body.code).toBe('611');
    });
    it('invalid url', async () => {
      const rolesRoute: RolesRoute = new RolesRoute();
      const app: App = new App([rolesRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/ussser${rolesRoute.path}/29`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      expect(response.body.body.code).toBe('611');
    });
  });
});
