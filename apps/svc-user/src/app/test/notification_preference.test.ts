import { config } from 'dotenv';
config({ path: '.env.development.local' });
import request from 'supertest';
import App from '../../serverApp';
import NotificationPreferenceRoutes from '../route/notification_preference.route';

const jwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU2IiwibmFtZSI6InN1cGVyIGFkbWluIHlvcCB1c2VyIiwiZW1haWwiOiJzdXBlcmFkbWluQHlvcG1haWwuY29tIiwicGhvbmVfbnVtYmVyIjoiOTYwMDkxODA5MCIsImlzUGFzc3dvcmRDaGFuZ2VkIjpmYWxzZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wibWFuYWdlXCJdLFwic3ViamVjdFwiOlwiYWxsXCJ9XSIsImlkIjoiMiIsIm5hbWUiOiJTdXBlciBBZG1pbiIsImNyZWF0ZWRBdCI6IjIwMjItMDgtMTFUMDU6MTk6MjcuNzk0WiIsInVwZGF0ZWRBdCI6IjIwMjItMDgtMTFUMDU6MTk6MjcuNzk0WiIsInVzZXJfcm9sZXMiOnsiY3JlYXRlZEF0IjoiMjAyMy0wNi0yMlQwNjowODozMi44NjZaIiwidXBkYXRlZEF0IjoiMjAyMy0wNi0yMlQwNjowODozMi44NjZaIiwidXNlcklkIjoiNTYiLCJSb2xlSWQiOiIyIn19XSwiZmlyc3RfbmFtZSI6InN1cGVyIGFkbWluIHlvcCIsImxhc3RfbmFtZSI6InVzZXIiLCJoYW5kbGUiOiJzdXBlcmFkbWluX1pNbmYiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NzQxNDE0MSwiZXhwIjoxNjg5MjE0MTQxfQ.-qxFAzvuEUMIbya5yF5vgaBhDl4eJHzPLq_Wn_HsIbY';
const unauthorizedJwtToken =
  'eyJhbGciOiJIUzI1NiIsInE5cCI6IkpXVCJ9.eyJpZCI6IjcyMDE1NCIsIm5hbWUiOiJhZG1pbiB1c2VycyIsImVtYWlsIjoiYWRtaW5AYmFzc3VyZS5jb20iLCJwaG9uZV9udW1iZXIiOiI5MTk3OTA2MzA0NTMiLCJpc1Bhc3N3b3JkQ2hhbmdlZCI6dHJ1ZSwicm9sZSI6W3sicGVybWlzc2lvbnMiOiJbe1wiYWN0aW9uXCI6W1wibWFuYWdlXCJdLFwic3ViamVjdFwiOlwiYWxsXCJ9XSIsImlkIjoxLCJuYW1lIjoiU3VwZXIgQWRtaW4iLCJjcmVhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTA4LTExVDA1OjE5OjI3Ljc5NFoiLCJ1c2Vycm9sZXMiOnsiY3JlYXRlZEF0IjoiMjAyMy0wNS0xOVQxMDo1MDo0OS40MDhaIiwidXBkYXRlZEF0IjoiMjAyMy0wNS0xOVQxMDo1MDo0OS40MDhaIiwidXNlcklkIjoiNzIwMTU0Iiwicm9sZUlkIjoiMSJ9fV0sImZpcnN0X25hbWUiOiJhZG1pbiIsImxhc3RfbmFtZSI6InVzZXJzIiwiaGFuZGxlIjoiYWRtaW4xMjM0NTc3Nzc5OTk5X1J2eHIiLCJjbGllbnRfaWQiOm51bGwsImlhdCI6MTY4NTY5OTY2NiwiZXhwIjoxNjg3NDk5NjY2fQ.5pv3uuUa2veIkRd2Mheb0wrP9pSbHnQfOtYszlmfCt8';

const url = '/api/users';
const updateReqBody = {
  disableIds:[1,2,3,4]
}

describe('testing the users route', () => {
  describe(`[GetAll] ${url}/notificationPreference/get`, () => {
    it('getting all notification preferences', async () => {
      const notificationPreferenceRoutes: NotificationPreferenceRoutes = new NotificationPreferenceRoutes();
      const app: App = new App([notificationPreferenceRoutes]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/users${notificationPreferenceRoutes.path}/get`)
        .set({
          Authorization: `Bearer ${jwtToken}`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      console.log(notificationPreferenceRoutes, '----reassaspdssdone----');

      expect(response.body.body.code).toBe('600');
    });
    it('Unauthorized jwt', async () => {
      const notificationPreferenceRoutes: NotificationPreferenceRoutes = new NotificationPreferenceRoutes();
      const app: App = new App([notificationPreferenceRoutes]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/${notificationPreferenceRoutes.path}users/notificationPreference/get`)
        .set({
          Authorization: `Bearer ${unauthorizedJwtToken}`,
          CHECK_WITH_CUSTOM_USER: true,
        });
      console.log(response.body, '----respdssdone----');

      expect(response.body.body.code).toBe('611');
    });
    it('invalid url', async () => {
      const notificationPreferenceRoutes: NotificationPreferenceRoutes = new NotificationPreferenceRoutes();
      const app: App = new App([notificationPreferenceRoutes]);
      const response: request.Response = await request(app.getServer())
        .get(`/api/${notificationPreferenceRoutes.path}users/notificationPrefeerence/get`)
        .set({
          Authorization: `Bearer ${jwtToken}`,
          CHECK_WITH_CUSTOM_USER: true,
        }).send(updateReqBody);
      console.log(response.body, '----respdssdone----');

      expect(response.body.body.code).toBe('611');
    });
  });
  describe(`[Put] ${url}/notificationPreference/update`, () => {
    it('updating notification preference', async () => {
      const notificationPreferenceRoutes: NotificationPreferenceRoutes = new NotificationPreferenceRoutes();
      const app: App = new App([notificationPreferenceRoutes]);
      const response: request.Response = await request(app.getServer())
        .put(`/api/users/notificationPreference/update`)
        .set({
          Authorization: `Bearer ${jwtToken}`,
          CHECK_WITH_CUSTOM_USER: true,
        }).send(updateReqBody);
        console.log(response.body, '----jup----');
        
      expect(response.body.body.code).toBe('600');
    });

    it('Unauthorized jwt', async () => {
      const notificationPreferenceRoutes: NotificationPreferenceRoutes = new NotificationPreferenceRoutes();
      const app: App = new App([notificationPreferenceRoutes]);
      const response: request.Response = await request(app.getServer())
        .put(`/api/users/notificationPreference/update`)
        .set({
          Authorization: `Bearer ${unauthorizedJwtToken}`,
          CHECK_WITH_CUSTOM_USER: true,
        }).send(updateReqBody);
      console.log(response.body, '----respdssdone----');

      expect(response.body.body.code).toBe('611');
    });
    it('invalid url', async () => {
      const notificationPreferenceRoutes: NotificationPreferenceRoutes = new NotificationPreferenceRoutes();
      const app: App = new App([notificationPreferenceRoutes]);
      const response: request.Response = await request(app.getServer())
        .put(`/api/${notificationPreferenceRoutes.path}users/notificationPrefeerence/update`)
        .set({
          Authorization: `Bearer ${jwtToken}`,
          CHECK_WITH_CUSTOM_USER: true,
        }).send(updateReqBody);
      console.log(response.body, '----respdssdone----');

      expect(response.body.body.code).toBe('611');
    });
  });
});
