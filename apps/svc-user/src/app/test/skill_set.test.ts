import { config } from 'dotenv';
config({ path: '.env.development.local' });
import request from 'supertest';
import App from '../../serverApp';
import SkillSetRoute from '../route/skill_set.route';

const url = '/api/users/skillSet';

describe('testing the roles route', () => {
  describe(`[GET all] ${url}`, () => {
    it('get role by id', async () => {
      const skillSetRoute: SkillSetRoute = new SkillSetRoute();
      const app: App = new App([skillSetRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/users${skillSetRoute.path}`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });        
      expect(response.body.body.code).toBe('600');
    });
    it('invalid url', async () => {
      const skillSetRoute: SkillSetRoute = new SkillSetRoute();
      const app: App = new App([skillSetRoute]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/ussser${skillSetRoute.path}/29`)
        .set({
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1IiwibmFtZSI6ImNsZW1lbnQgdGhhcmNpdXMiLCJlbWFpbCI6ImNsZW1lbnRAYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiIrOTEgODYxMDkyODM3OCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcInRvcGljXCIsXCJuYW1lXCI6W1wiVmlldyBUb3BpY3NcIl19LHtcImFjdGlvblwiOltcInJlYWRcIl0sXCJzdWJqZWN0XCI6XCJjaGFwdGVyXCIsXCJuYW1lXCI6W1wiVmlldyBDaGFwdGVyc1wiXX0se1wiYWN0aW9uXCI6W1wicmVhZFwiXSxcInN1YmplY3RcIjpcImNvdXJzZVwiLFwibmFtZVwiOltcIlZpZXcgQ291cnNlc1wiXX0se1wiYWN0aW9uXCI6W1wiY3JlYXRlXCIsXCJ1cGRhdGVcIixcImRlbGV0ZVwiXSxcInN1YmplY3RcIjpcImJhdGNoc2NoZWR1bGVcIixcIm5hbWVcIjpbXCJDcmVhdGUgQmF0Y2ggU2NoZWR1bGVcIixcIkVkaXQgQmF0Y2ggU2NoZWR1bGVcIixcIkRlbGV0ZSBCYXRjaCBTY2hlZHVsZVwiXX1dIiwiaWQiOiI3IiwibmFtZSI6IkxlYXJuZXIiLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2VyX3JvbGVzIjp7ImNyZWF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDYtMTRUMDg6MTI6MDIuMDU2WiIsInVzZXJJZCI6IjM1IiwiUm9sZUlkIjoiNyJ9fV0sImZpcnN0X25hbWUiOiJjbGVtZW50IiwibGFzdF9uYW1lIjoidGhhcmNpdXMiLCJoYW5kbGUiOiJjbGVtZW50XzNLclAiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NjczMDU0MSwiZXhwIjoxNjg4NTMwNTQxfQ.Gd38s0JSMD7UhhuHCDPMDOIokNcpzfdULJxfmyhn300`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      expect(response.body.body.code).toBe('611');
    });
  });
});
