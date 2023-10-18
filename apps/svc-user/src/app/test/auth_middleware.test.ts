import { config } from 'dotenv';
config({ path: '.env.development.local' });
import request from 'supertest';
import App from '../../serverApp';
import AuthMiddlewareRoute from '../route/auth_middleware.route';

const url = '/api/users/getAuth';

describe(`[GetAll] ${url}`, () => {
  it('get auth verified', async () => {
    const authMiddlewareRoute: AuthMiddlewareRoute = new AuthMiddlewareRoute();
    const app: App = new App([authMiddlewareRoute]);
    const response: request.Response = await request(app.getServer())
      .get(`/api/users/getAuth`)
      .set({
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU0IiwibmFtZSI6ImFkbWludXNlciB5b3AiLCJlbWFpbCI6ImFkbWludXNlckB5b3BtYWlsLmNvbSIsInBob25lX251bWJlciI6Iis5MSA4NjAxMDI4Mzc4IiwiaXNQYXNzd29yZENoYW5nZWQiOmZhbHNlLCJyb2xlIjpbeyJwZXJtaXNzaW9ucyI6Ilt7XCJhY3Rpb25cIjpbXCJyZWFkXCJdLFwic3ViamVjdFwiOlwidG9waWNcIixcIm5hbWVcIjpbXCJWaWV3IFRvcGljc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNoYXB0ZXJcIixcIm5hbWVcIjpbXCJWaWV3IENoYXB0ZXJzXCJdfSx7XCJhY3Rpb25cIjpbXCJyZWFkXCJdLFwic3ViamVjdFwiOlwiY291cnNlXCIsXCJuYW1lXCI6W1wiVmlldyBDb3Vyc2VzXCJdfSx7XCJhY3Rpb25cIjpbXCJjcmVhdGVcIixcInVwZGF0ZVwiLFwiZGVsZXRlXCJdLFwic3ViamVjdFwiOlwiYmF0Y2hzY2hlZHVsZVwiLFwibmFtZVwiOltcIkNyZWF0ZSBCYXRjaCBTY2hlZHVsZVwiLFwiRWRpdCBCYXRjaCBTY2hlZHVsZVwiLFwiRGVsZXRlIEJhdGNoIFNjaGVkdWxlXCJdfV0iLCJpZCI6IjciLCJuYW1lIjoiTGVhcm5lciIsImNyZWF0ZWRBdCI6IjIwMjItMDgtMTFUMDU6MTk6MjcuNzk0WiIsInVwZGF0ZWRBdCI6IjIwMjItMDgtMTFUMDU6MTk6MjcuNzk0WiIsInVzZXJfcm9sZXMiOnsiY3JlYXRlZEF0IjoiMjAyMy0wNi0yMlQwNTo0NjoyNi44MTdaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0yMlQwNTo0NjoyNi44MTdaIiwidXNlcklkIjoiNTQiLCJSb2xlSWQiOiI3In19XSwiZmlyc3RfbmFtZSI6ImFkbWludXNlciIsImxhc3RfbmFtZSI6InlvcCIsImhhbmRsZSI6ImFkbWludXNlcl9VSjd0IiwiY2xpZW50X2lkIjpudWxsLCJpYXQiOjE2ODc0MTMwNjcsImV4cCI6MTY4OTIxMzA2N30.135Z-cWeaje_7L45HOupEdQXSCWKvP2DSN-fvIjbAGM`,
        CHECK_WITH_CUSTOM_USER: true,
      });
    console.log(response, '----opm');

    expect(response.body.body.code).toBe('600');
  });
  it('Unauthorized token', async () => {
    const authMiddlewareRoute: AuthMiddlewareRoute = new AuthMiddlewareRoute();
    const app: App = new App([authMiddlewareRoute]);
    const response: request.Response = await request(app.getServer())
      .get(`/api/users/getAuth`)
      .set({
        Authorization: `Bearer eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
        CHECK_WITH_CUSTOM_USER: true,
      });
    console.log(response.body, '---pli');
    expect(response.body.body.code).toBe('611');
  });
  it('invalid url', async () => {
    const authMiddlewareRoute: AuthMiddlewareRoute = new AuthMiddlewareRoute();
    const app: App = new App([authMiddlewareRoute]);
    const response: request.Response = await request(app.getServer()).get(
      `/api/users/${authMiddlewareRoute.path}/getAsllmodules`
    );
    expect(response.body.body.code).toBe('611');
  });
});
