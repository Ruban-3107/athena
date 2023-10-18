import { config } from 'dotenv';
config({ path: '.env.development.local' });
import request from 'supertest';
import App from '../../serverApp';
import EmploymentHistoryRoute from '../route/employment_history.route';

const url = '/api/users/employmentHistory';
let currentlyCreatedId: any;
const reqBody = {
  user_id: 35,
  company: 'Example Company-2',
  job_title: 'Software Engineer',
  job_description: 'This is a job description.',
  start_month: '2022-01-01',
  end_month: '2023-01-01',
};
const updateReqBody = {
  user_id: 35,
  company: 'Example Company-2',
  job_title: 'Software Developer',
  job_description: 'This is a job description.',
  start_month: '2022-01-01',
  end_month: '2023-01-01',
};

describe('testing the employment historyRoute route', () => {
  describe(`[POST] ${url}`, () => {
    it('creating employment history', async () => {
      const employmentHistoryRoute: EmploymentHistoryRoute =
        new EmploymentHistoryRoute();
      const app: App = new App([employmentHistoryRoute]);
      const response: request.Response = await request(app.getServer())
        .post(`/api/users${employmentHistoryRoute.path}`)
        .send(reqBody);
      expect(response.body.body.code).toBe('600');
      currentlyCreatedId = response.body.body.value.id;
    });
    it('invalid api', async () => {
      const employmentHistoryRoute: EmploymentHistoryRoute =
        new EmploymentHistoryRoute();
      const app: App = new App([employmentHistoryRoute]);
      const response: request.Response = await request(app.getServer())
        .post(`/api/users${employmentHistoryRoute.path}/createClien`)
        .send(reqBody);
      expect(response.body.body.code).toBe('611');
    });
  });
  describe(`[Get] ${url}/:id`, () => {
    it('get employment history by id', async () => {
      const employmentHistoryRoute: EmploymentHistoryRoute =
        new EmploymentHistoryRoute();
      const app: App = new App([employmentHistoryRoute]);
      const response: request.Response = await request(app.getServer()).get(
        `/api/users${employmentHistoryRoute.path}/${currentlyCreatedId}`
      );
      expect(response.body.body.code).toBe('600');
    });
    it('invalid id', async () => {
      const employmentHistoryRoute: EmploymentHistoryRoute =
        new EmploymentHistoryRoute();
      const app: App = new App([employmentHistoryRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/users${employmentHistoryRoute.path}/a`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      expect(response.body.body.code).toBe('611');
    });
    it('invalid url', async () => {
      const employmentHistoryRoute: EmploymentHistoryRoute =
        new EmploymentHistoryRoute();
      const app: App = new App([employmentHistoryRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/ussser${employmentHistoryRoute.path}/29`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      expect(response.body.body.code).toBe('611');
    });
  });
  describe(`[GetAll] ${url}`, () => {
    it('get all employment history', async () => {
      const employmentHistoryRoute: EmploymentHistoryRoute =
        new EmploymentHistoryRoute();
      const app: App = new App([employmentHistoryRoute]);
      const response: request.Response = await request(app.getServer()).get(
        `/api/users${employmentHistoryRoute.path}`
      );
      expect(response.body.body.code).toBe('600');
    });
    it('invalid url', async () => {
      const employmentHistoryRoute: EmploymentHistoryRoute =
        new EmploymentHistoryRoute();
      const app: App = new App([employmentHistoryRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/users${employmentHistoryRoute.path}/getAsllClients`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      expect(response.body.body.code).toBe('611');
    });
  });
  describe(`[PUT] ${url}/updateClient/:id`, () => {
    it('updating employment history', async () => {
      const employmentHistoryRoute: EmploymentHistoryRoute =
        new EmploymentHistoryRoute();
      const app: App = new App([employmentHistoryRoute]);
      const response: request.Response = await request(app.getServer())
        .put(`/api/users${employmentHistoryRoute.path}/${currentlyCreatedId}`)
        .send(updateReqBody);
      expect(response.body.body.code).toBe('600');
      currentlyCreatedId = response.body.body.value.id;
    });
    it('invalid api', async () => {
      const employmentHistoryRoute: EmploymentHistoryRoute =
        new EmploymentHistoryRoute();
      const app: App = new App([employmentHistoryRoute]);
      const response: request.Response = await request(app.getServer())
        .put(
          `/api/users${employmentHistoryRoute.path}/updateCliesnt/${currentlyCreatedId}`
        )
        .send(reqBody);
      expect(response.body.body.code).toBe('611');
    });
  });
  describe(`[DELETE] ${url}/emp/:id`, () => {
    it('delete employment history', async () => {
      const employmentHistoryRoute: EmploymentHistoryRoute =
        new EmploymentHistoryRoute();
      const app: App = new App([employmentHistoryRoute]);
      const response: request.Response = await request(app.getServer()).delete(
        `/api/users${employmentHistoryRoute.path}/emp/${currentlyCreatedId}`
      );
      expect(response.body.body.code).toBe('600');
    });
    it('invalid api', async () => {
      const employmentHistoryRoute: EmploymentHistoryRoute =
        new EmploymentHistoryRoute();
      const app: App = new App([employmentHistoryRoute]);
      const response: request.Response = await request(app.getServer())
        .delete(
          `/api/users${employmentHistoryRoute.path}/updateCliesnt/${currentlyCreatedId}`
        )
        .send(reqBody);
      expect(response.body.body.code).toBe('611');
    });
  });
});
