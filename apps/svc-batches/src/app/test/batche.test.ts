import { config } from 'dotenv';
config({ path: '.env.development.local' });
import request from 'supertest';
import App from '../../../../svc-users/src/serverApp';
import BatchesRoute from '@routes/batches.route';
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjYzOTE2MTQwLCJzdWIiOiI3ODYzMjA0ZC01MmVlLTRlNWYtODk1ZC0yYTUzOWQ1MTA4M2MiLCJlbWFpbCI6InByYXNhYXRoOThAeW9wbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJzZXNzaW9uX2lkIjoiY2I4OWVjNDctMTI2Ni00Zjc3LWFhMWUtYjczY2YwYzIwOWQwIn0.L0tdUn22vCyaap2DL4gIm6F62uOe7sqLfmGQnHMjlHk';
const userId = 720043;
const url = '/api/users/batches';
let currentlyCreatedId: number;
// const status = 1;
let updateBody: any;

const reqBody = [{
    name: "SampleBatch",
    // client_id: 4,
    learners: [720152],
    description: "so stupid idiots",
    started_at: "2022-12-25",
    tracks_assigned: [10]
}, {
        name: "SampleBatchhee",
        client_id: "uio",
        // learners: [720152],
        description: "so stupid cringe idiots",
        started_at: "2022-12-25",
        tracks_assigned: [10]
    }]

const requestBody = {
    name: "SampleOneBatch",
    // client_id: 4,
    // description: "so stupid idiots",
    // started_at: "2022-12-25",
    // tracks_assigned: [10, 12]
}

describe('testing the batch route', () => {

    // describe(`[POST] ${url}`, () => {
    //     it('creating batch', async () => {
    //         const batchRoute: BatchesRoute = new BatchesRoute();
    //         console.log("aaaaaaaa")
    //         const app: App = new App([batchRoute]);
    //         console.log("xxxxxxxxxxx")
    //         const response: request.Response = await request(app.getServer())
    //             .post(`/api/users${batchRoute.path}`)
    //             .set({
    //                 Authorization: `Bearer ${userId}`,
    //                 CHECK_WITH_CUSTOM_USER: true,
    //             })
    //             .send(reqBody[0]);
    //         expect(response.statusCode).toBe(201);
    //         currentlyCreatedId = response.body.data.id;
    //         console.log('current id ', currentlyCreatedId);
    //         updateBody = { id: currentlyCreatedId };
    //     });

    //     it('validation error in creating batch', async () => {
    //         const batchRoute: BatchesRoute = new BatchesRoute();
    //         const app: App = new App([batchRoute]);
    //         const response: request.Response = await request(app.getServer())
    //             .post(`/api/users${batchRoute.path}`)
    //             .set({
    //                 Authorization: `Bearer ${userId}`,
    //                 CHECK_WITH_CUSTOM_USER: true,
    //             })
    //             .send(reqBody[1]);
    //         expect(response.statusCode).toBe(400);
    //         // expect(response.error);
    //     });

    //     it('internal error in creating batch', async () => {
    //         const batchRoute: BatchesRoute = new BatchesRoute();
    //         const app: App = new App([batchRoute]);
    //         const response: request.Response = await request(app.getServer())
    //             .post(`/api/users${batchRoute.path}yu`)
    //             .set({
    //                 Authorization: `Bearer ${userId}`,
    //                 CHECK_WITH_CUSTOM_USER: true,
    //             })
    //             .send(reqBody[0]);
    //         expect(response.statusCode).toBe(500);
    //     });
    // });


    describe(`[GetAll] ${url}`, () => {
        it('getting all batches', async () => {
            const batchRoute: BatchesRoute = new BatchesRoute();
            const app: App = new App([batchRoute]);
            const response: request.Response = await request(app.getServer())
                .get(`/api/users${batchRoute.path}`)
                .set({
                    Authorization: `Bearer ${userId}`,
                    CHECK_WITH_CUSTOM_USER: true,
                });
            console.log("response", response._body.data);
            expect(response.statusCode).toBe(200);
            expect(typeof response._body.data).toBe("object");
        });

        it('internal error', async () => {
            const batchRoute: BatchesRoute = new BatchesRoute();
            const app: App = new App([batchRoute]);
            const response: request.Response = await request(app.getServer())
                .get(`/api/users${batchRoute.path}/all`)
                .set({
                    Authorization: `Bearer ${userId}`,
                    CHECK_WITH_CUSTOM_USER: true,
                });
            expect(response.statusCode).toBe(500);
        });
    });

    // describe(`[Get] ${url}/:id`, () => {
    //     it('get batch by id', async () => {
    //         const batchRoute: BatchesRoute = new BatchesRoute();
    //         const app: App = new App([batchRoute]);
    //         const response: request.Response = await request(app.getServer())
    //             .get(`/api/users${batchRoute.path}/${currentlyCreatedId}`)
    //             .set({
    //                 Authorization: `Bearer ${userId}`,
    //                 CHECK_WITH_CUSTOM_USER: true,
    //             });
    //         expect(response.statusCode).toBe(200);
    //         expect(response.body.data.id).toBe(currentlyCreatedId);
    //         expect(typeof response._body.data).toBe("object");
    //     });

    //     it('non-existing batch', async () => {
    //         const batchRoute: BatchesRoute = new BatchesRoute();
    //         const app: App = new App([batchRoute]);
    //         const response: request.Response = await request(app.getServer())
    //             .get(`/api/users${batchRoute.path}/${currentlyCreatedId + 100}`)
    //             .set({
    //                 Authorization: `Bearer ${userId}`,
    //                 CHECK_WITH_CUSTOM_USER: true,
    //             });
    //         expect(response.statusCode).toBe(404);
    //         expect(response._body.data).toBe(null);
    //     });
    // });

    // describe(`[Put] ${url}/:id`, () => {
    //     it('updating batch by id', async () => {
    //         console.log('current id in put ', updateBody.id);

    //         const batchRoute: BatchesRoute = new BatchesRoute();
    //         const app: App = new App([batchRoute]);
    //         const response: request.Response = await request(app.getServer())
    //             .put(`/api/users${batchRoute.path}/${updateBody.id}`)
    //             .set({
    //                 Authorization: `Bearer ${userId}`,
    //                 CHECK_WITH_CUSTOM_USER: true,
    //             })
    //             .send(requestBody);
    //         expect(response.statusCode).toBe(200);
    //         expect(response.body.data.id).toBe(updateBody.id);
    //     });
    //     it('non-existing batch', async () => {
    //         const batchRoute: BatchesRoute = new BatchesRoute();
    //         const app: App = new App([batchRoute]);
    //         const response: request.Response = await request(app.getServer())
    //             .put(`/api/users${batchRoute.path}/${updateBody.id + 100}`)
    //             .set({
    //                 Authorization: `Bearer ${userId}`,
    //                 CHECK_WITH_CUSTOM_USER: true,
    //             })
    //             .send(requestBody);
    //         expect(response.statusCode).toBe(404);
    //         expect(response._body.data).toBe(null);
    //     });

    //     it('validation error in updating batch', async () => {                     //could be a data validation error
    //         const batchRoute: BatchesRoute = new BatchesRoute();
    //         const app: App = new App([batchRoute]);
    //         const response: request.Response = await request(app.getServer())
    //             .put(`/api/users${batchRoute.path}/${updateBody.id}`)
    //             .set({
    //                 Authorization: `Bearer ${userId}`,
    //                 CHECK_WITH_CUSTOM_USER: true,
    //             })
    //             .send(reqBody[1]);
    //         expect(response.statusCode).toBe(400);
    //         // expect(response.error);
    //     });

    //     it('internal error in updating batch', async () => {                      //could be a db validation error or something
    //         const batchRoute: BatchesRoute = new BatchesRoute();
    //         const app: App = new App([batchRoute]);
    //         const response: request.Response = await request(app.getServer())
    //             .put(`/api/users${batchRoute.path}/${updateBody.id}ays`)
    //             .set({
    //                 Authorization: `Bearer ${userId}`,
    //                 CHECK_WITH_CUSTOM_USER: true,
    //             })
    //             .send(reqBody[0]);
    //         expect(response.statusCode).toBe(500);
    //     });

    // });

    // describe(`[Delete] ${url}/:id`, () => {

    //     it("deleting batch by id", async () => {
    //         const batchRoute: BatchesRoute = new BatchesRoute();
    //         const app: App = new App([batchRoute]);
    //         const response: request.Response = await request(app.getServer())
    //             .delete(`/api/users${batchRoute.path}/${currentlyCreatedId}`)
    //             .set({ Authorization: `Bearer ${userId}`, CHECK_WITH_CUSTOM_USER: true })

    //         expect(response.statusCode).toBe(200)
    //         expect(response.body.data.id).toBe(currentlyCreatedId)
    //     })

    //     it("non-existing batch", async () => {
    //         const batchRoute: BatchesRoute = new BatchesRoute();
    //         const app: App = new App([batchRoute]);
    //         const response: request.Response = await request(app.getServer())
    //             .delete(`/api/users${batchRoute.path}/${currentlyCreatedId}`)
    //             .set({ Authorization: `Bearer ${userId}`, CHECK_WITH_CUSTOM_USER: true })
    //         expect(response.statusCode).toBe(404)
    //     })
    // })

});

