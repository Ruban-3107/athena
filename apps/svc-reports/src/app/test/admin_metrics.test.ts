/////////Run the test files after your application backend services are running separately since there is no direct connection to database for svc-reports.////////////////////
import { config } from 'dotenv';
config({ path: '.env.development.local' });
import request from 'supertest';
import App from '../../serverApp'; //@ absolute//
import AdminMetricsRoute from '../route/admin_metrics.route';

const url = '/api/reports/adminmetrics';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcyMDM3MyIsIm5hbWUiOiJhZG1pbiB1c2VyIiwiZW1haWwiOiJhZG1pbkBiYXNzdXJlLmNvbSIsInBob25lX251bWJlciI6IjkxOTc5MDYzMDQ1NCIsImlzUGFzc3dvcmRDaGFuZ2VkIjp0cnVlLCJyb2xlIjpbeyJwZXJtaXNzaW9ucyI6Ilt7IFwiYWN0aW9uXCI6IFwibWFuYWdlXCIsIFwic3ViamVjdFwiOiBcImFsbFwiIH1dIiwiaWQiOjEyLCJuYW1lIjoiU3VwZXIgQWRtaW4iLCJjcmVhdGVkQXQiOiIyMDIyLTEyLTI4VDExOjA2OjU5LjkwNVoiLCJ1cGRhdGVkQXQiOiIyMDIyLTEyLTI4VDExOjA2OjU5LjkwNVoiLCJ1c2Vycm9sZXMiOnsiY3JlYXRlZEF0IjoiMjAyMy0wMy0wOFQwNzowNDo1MC4wNzdaIiwidXBkYXRlZEF0IjoiMjAyMy0wMy0wOFQwNzowNDo1MC4wNzdaIiwidXNlcklkIjoiNzIwMzczIiwicm9sZUlkIjoiMTIifX1dLCJmaXJzdF9uYW1lIjoiYWRtaW4iLCJsYXN0X25hbWUiOiJ1c2VyIiwiaGFuZGxlIjoiYWRtaW5fWEtreiIsImNsaWVudF9pZCI6bnVsbCwiaWF0IjoxNjgxMTk3MjUzLCJleHAiOjE2ODI5OTcyNTN9.fDEGEXDpgNrvHIhLfLXvhGfNzyCPxPQekh5Ep2oXdw0';

describe('Testing performance chart data', () => {
  let adminMetricsRoute: AdminMetricsRoute;
  let app: App;

  beforeAll(() => {
    adminMetricsRoute = new AdminMetricsRoute();
    app = new App([adminMetricsRoute]);
  });

  it('should fetch and return the expected admin performance chart data', async () => {
    const dateRange = 'week';
    const response = await request(app.getServer()).get(
      `${url}/adminPerformanceChart?view=${dateRange}`
    );
    // .set({ Authorization: `Bearer ${token}` });

    expect(response.statusCode).toBe(200);

    const {
      body: {
        code,
        value: { adminPerformanceChartData },
        status,
        message,
      },
    } = JSON.parse(response.text);

    expect(code).toBe(600);
    expect(status).toBe('success');
    expect(message).toBe('Fetched admin performance chart data');
    expect(adminPerformanceChartData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          graphLabel: expect.any(String),
          type: expect.any(String),
          count: expect.any(String),
        }),
      ])
    );
  });
});
