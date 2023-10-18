import { config } from 'dotenv';
config({ path: '.env.development.local' });
import request from 'supertest';
import App from '../../serverApp';
import ClientRoute from '../route/clients.route';

const userId = 720043;
const url = '/api/users/clients';
let currentlyCreatedId: any;
const status = 1;
let updateBody: any;

const searchReqBody = {
  searchKey: 'abc',
  size: 10,
  pageNo: 1,
};
const filterReqBody = {
  pageNo: 1,
  size: 10,
};
const reqBody = {
  corporate_group: 'ABC-Chennaiq',
  company_name: 'ABC Companyq',
  contact_details: [
    {
      first_name: 'John',
      last_name: 'Doe',
      primary_email: 'john.doe@example.com',
      secondary_email: 'johndoe@gmail.com',
      mobile_number: 9076543010,
      is_primary: true,
    },
    {
      first_name: 'Jane',
      last_name: 'Smith',
      primary_email: 'jane.smith@example.com',
      secondary_email: 'janesmith@gmail.com',
      mobile_number: 8765430009,
      is_primary: false,
    },
  ],
};
const updateReqBody = {
  corporate_group: 'ABC-Chennaiq',
  company_name: 'ABC Companyq',
  contact_details: [
    {
      first_name: 'John',
      last_name: 'Doe',
      primary_email: 'john.doe@example.com',
      secondary_email: 'johndoe@gmail.com',
      mobile_number: 9076543011,
      is_primary: true,
    },
    {
      first_name: 'Jane',
      last_name: 'Smith',
      primary_email: 'jane.smith@example.com',
      secondary_email: 'janesmith@gmail.com',
      mobile_number: 8765430009,
      is_primary: false,
    },
  ],
};
const primaryAndSecEmailErrReqBody = {
  corporate_group: 'ABC-Chennaiq',
  company_name: 'ABC Companyq',
  contact_details: [
    {
      first_name: 'John',
      last_name: 'Doe',
      primary_email: 'john.doeas1@example.com',
      secondary_email: 'john.doeas1@example.com',
      mobile_number: 9076543010,
      is_primary: true,
    },
    {
      first_name: 'Jane',
      last_name: 'Smith',
      primary_email: 'jane.smith1@example.com',
      secondary_email: 'john.doeas1@example.com',
      mobile_number: 8765430009,
      is_primary: false,
    },
  ],
};

describe('testing the client route', () => {
  describe(`[POST] ${url}/createClient`, () => {
    it('creating client', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .post(`/api/users${clientRoute.path}/createClient`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        })
        .send(reqBody);
      console.log(response.body, '----redf');

      expect(response.body.body.code).toBe('600');
      currentlyCreatedId = response.body.body.value.id;
    });
    it('invalid Token', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .post(`/api/users${clientRoute.path}/createClient`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        })
        .send(reqBody);
      expect(response.body.body.code).toBe('611');
    });
    it('invalid api', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .post(`/api/users${clientRoute.path}/createClien`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        })
        .send(reqBody);
      console.log(response.body.body, '---respone----');

      expect(response.body.body.code).toBe('611');
    });
    it('primary email and secondary email cannot be similar', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .post(`/api/users${clientRoute.path}/createClient`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        })
        .send(primaryAndSecEmailErrReqBody);
      console.log(response.body, '----ref');

      expect(response.body.body.code).toBe('611');
    });
  });
  describe(`[Get] ${url}/:id`, () => {
    it('get client by id', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      console.log(typeof currentlyCreatedId, '---kdsjdskkds');

      const response: request.Response = await request(app.getServer())
        .get(`/api/users${clientRoute.path}/${currentlyCreatedId}`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });

      expect(response.body.body.code).toBe('600');
    });
    it('invalid token', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/users${clientRoute.path}/29`)
        .set({
          Authorization: `Bearer .eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      console.log(response, '---oooo---rdsdedssdsfdsred');

      expect(response.body.body.code).toBe('611');
    });
    it('invalid id', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/users${clientRoute.path}/a`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      console.log(response, '---oooo---rdsdedssdsfdsred');

      expect(response.body.body.code).toBe('611');
    });
    it('invalid url', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/user${clientRoute.path}/29`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      expect(response.body.body.code).toBe('611');
    });
  });
  describe(`[GetAll] ${url}/getAllClients`, () => {
    it('get all clients', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      console.log(typeof currentlyCreatedId, '---kdsjdskkds');

      const response: request.Response = await request(app.getServer())
        .get(`/api/users${clientRoute.path}/getAllClients`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      console.log(response, '---oooo---rdsdedssdsfdsred');

      expect(response.body.body.code).toBe('600');
    });
    it('invalid url', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/users${clientRoute.path}/getAsllClients`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      expect(response.body.body.code).toBe('611');
    });
  });
  describe(`[PUT] ${url}/updateClient/:id`, () => {
    it('updating client', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .put(`/api/users${clientRoute.path}/updateClient/${currentlyCreatedId}`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        })
        .send(updateReqBody);
      console.log(response.body, '----redipdaf');

      expect(response.body.body.code).toBe('600');
      currentlyCreatedId = response.body.body.value.id;
    });
    it('invalid api', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .put(
          `/api/users${clientRoute.path}/updateCliesnt/${currentlyCreatedId}`
        )
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        })
        .send(reqBody);
      console.log(response.body.body, '---resp1234323one----');
      expect(response.body.body.code).toBe('611');
    });
    it('primary email and secondary email cannot be similar', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .put(`/api/users${clientRoute.path}/updateClient/${currentlyCreatedId}`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        })
        .send(primaryAndSecEmailErrReqBody);
      console.log(response.body, '----ref');

      expect(response.body.body.code).toBe('611');
    });
  });
  describe(`[POST] ${url}/getClients`, () => {
    it('get clients based on searchKey', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .post(`/api/users${clientRoute.path}/getClients`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        })
        .send(searchReqBody);
      console.log(response.body, '----redf');

      expect(response.body.body.code).toBe('600');
      currentlyCreatedId = response.body.body.value.id;
    });
    it('get clients based on filter', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .post(`/api/users${clientRoute.path}/getClients`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        })
        .send(filterReqBody);
      console.log(response.body, '----redfilterereref');
      expect(response.body.body.code).toBe('601');
      currentlyCreatedId = response.body.body.value.id;
    });
    it('invalid URL', async () => {
      const clientRoute: ClientRoute = new ClientRoute();
      const app: App = new App([clientRoute]);
      const response: request.Response = await request(app.getServer())
        .post(`/api/users${clientRoute.path}/getSSClients`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        })
        .send(reqBody);
      expect(response.body.body.code).toBe('611');
    });
  });
});
