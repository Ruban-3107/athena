import { config } from 'dotenv';
config({ path: '.env.development.local' });
import request from 'supertest';
import App from '../../serverApp';
import UsersRoute from '../route/users.route';
import XLSX from 'xlsx';

const url: string = '/api/users/';
const urlForBulkUpload: string = '/api/users/bulkUpload';

const keywordSamples = [
  '',
  's',
  '@',
  'iammsanjeev@gmail.com',
  '@gmail.com',
  '.com',
];

describe(`testing the users route`, () => {
    test(`(GET) => getting all users details: `, async () => {
      const usersRoute: UsersRoute = new UsersRoute();
      const app: App = new App([usersRoute]);
      const response: request.Response = await request(app.getServer()).get(
        `${url}`
      );

      /**The response object must be of this format*/
      type ExpectedReponseObject = {
        code: string;
        value: {
          userData: {
            totalItems: number;
            rows: object[];
            totalPages: number;
            currentPage: number;
          };
        };
        status: boolean;
        error: null | { message: string };
      };

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject<ExpectedReponseObject>;
    });

    // it(`(GET) => SearchAPI: searches records by macthing values in the object with the keyword given in input params`, async () => {
    //   const usersRoute: UsersRoute = new UsersRoute();
    //   const app: App = new App([usersRoute]);
    //   for (let i of keywordSamples) {
    //     const response: request.Response = await request(app.getServer()).get(
    //       `${url}/${i}`
    //     );
    //     expect(response.statusCode).toBe(200);
    //   }
    // });

    test(`(POST) => To test search and filter functionality when we pass a req object containing searchkeyword and filter parameters: `, async () => {
      const usersRoute: UsersRoute = new UsersRoute();
      const app: App = new App([usersRoute]);

      /**The response object must be of this format*/
      type ExpectedResponseObject = {
        code: string;
        value: null | {
          data: {
            totalItems: number;
            rows: object[];
            totalPages: number;
            currentPage: number;
          };
          status: null | boolean;
          error: null | { message: string };
        };
      };

      /**Data for success cases*/
      let requestBodyObjectsPass = [
        //0 pass//
        {},
        //1 pass//
        {
          type: 'individual',
        },
        //2 pass//
        {
          nameFilter: 'ASC',
        },
        //3 pass//
        {
          emailFilter: 'DESC',
        },
        //4 pass//
        { registrationType: '' },
        //5 pass//
        { status: true },
        //6 pass//
        { pageNo: 0 },
        //7 pass//
        { size: 5 },
        { roles: [1] },
      ];

      for (let i of requestBodyObjectsPass) {
        const response: request.Response = await request(app.getServer())
          .post(`${url}/getUsers`)
          .set(i);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject<ExpectedResponseObject>;
      }
    });

    test(`(POST) => To add new user `, async () => {
      const usersRoute: UsersRoute = new UsersRoute();
      const app: App = new App([usersRoute]);

      /**Data for success cases*/
      let requestBodyObjectPassData = [
        {
          email: 'powell@gmail.com',
          password: 'chittappa123',
          uuid: 9999,
          handle: 'chittapa123',
          first_name: 'Powell',
          last_name: 'Poly Chandy',
          roles: [1, 2],
        },
      ];

      /**Data for failure cases*/
      let requestBodyObjectFailData = [{}];
      let failResponseObject = {
        body: {
          code: '611',
          value: null,
          status: null,
          error: {
            message: 'userData is empty',
          },
        },
      };

      /**The response object must be of this format*/
      type ExpectedReponseObject = {
        code: string;
        value: null | {
          userData: {
            is_active: boolean;
            email: string;
            uuid: string;
            handle: string;
            first_name: string;
            last_name: string;
            roles: number[];
            updatedAt: Date;
            createdAt: Date;
            phone_number: null | string;
            users_type: null | string;
            alternative_phoneNumber: null | string;
            personal_email: null | string;
            email_confirmed: null | boolean;
            work_email: null | string;
            created_by: null | number;
            deleted_at: null | Date;
            registration_type: null | string;
            client_id: null | object | number;
          };
          status: boolean;
          error: null | { message: string };
        };
      };

      for (let i of requestBodyObjectPassData) {
        const response: request.Response = await request(app.getServer())
          .post(`${url}`)
          .set(i);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject<ExpectedReponseObject>;
      }
      for (let i of requestBodyObjectFailData) {
        const response: request.Response = await request(app.getServer())
          .post(`${url}`)
          .set(i);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject<ExpectedReponseObject>;
        expect(response.body).toStrictEqual(failResponseObject);
      }
    });

  test(`(PUT) => To make sure we can successfully edit an existing user record`, () => { });
  
    test(`(DELETE) => To make sure the user is successfully disabled`, () => {});

    it('should throw 404 error for wrongURL', async () => {
      const usersRoute: UsersRoute = new UsersRoute();
      const app: App = new App([usersRoute]);
      const response: request.Response = await request(app.getServer()).get(
        `${url}/s`
      );

      expect(response.statusCode).toBe(404);
    });

  // jest.setTimeout(500);

  /*Test case for bulkUpload */
  describe(`[POST] ${urlForBulkUpload}`, () => {
    //Positive POST Case:
    it('posting the bulk users', async () => {
      const usersRoute: UsersRoute = new UsersRoute();
      const app: App = new App([usersRoute]);
      const workbook = XLSX.readFile('./File1.xlsx');
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      let reqBody: any = { data };
      let response: request.Response = await request(app.getServer())
        .post(`/api/users${usersRoute.path}`)
        .set({
          // Authorization: `Bearer ${userId}`,
          // CHECK_WITH_CUSTOM_USER: true,
        })
        .send(reqBody);
      expect(response.statusCode).toBe(200);
    });
    //Negative POST Case:
    it('File Not Found', async () => {
      let usersRoute: UsersRoute = new UsersRoute();
      const app: App = new App([usersRoute]);
      // const file = XLSX.readFile('ds.png')
      let reqBody: any = {};
      let response: request.Response = await request(app.getServer())
        .post(`/api/courses${usersRoute.path}`)
        // .set({
        //   Authorization: `Bearer ${userId}`,
        //   CHECK_WITH_CUSTOM_USER: true,
        // })
        .send(reqBody);
      expect(response.statusCode).toBe(500);
    });
    //Negative POST Case:
    it('Invalid Format', async () => {
      let usersRoute: UsersRoute = new UsersRoute();
      const app: App = new App([usersRoute]);
      const workbook = XLSX.readFile('./file.xltm');
      let reqBody: any = { workbook };
      let response: request.Response = await request(app.getServer())
        .post(`/api/courses${usersRoute.path}`)
        // .set({
        //   Authorization: `Bearer ${userId}`,
        //   CHECK_WITH_CUSTOM_USER: true,
        // })
        .send(reqBody);
      expect(response.statusCode).toBe(500);
    });
  });
});
