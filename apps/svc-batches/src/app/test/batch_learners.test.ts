import { config } from 'dotenv';
config({ path: ".env.development.local" })
import request from 'supertest';
import App from '../../serverApp';
import BatchlearnersRoute from '@routes/batch_learners.route'


describe("testing the batch_learners route", () => {

    describe(`[GetAll] /api/users`, () => {
        it("getting all batch_learners details", async () => {
            let batchlearnersRoute: BatchlearnersRoute = new BatchlearnersRoute();
            const app: App = new App([batchlearnersRoute]);
            let response: request.Response = await request(app.getServer())
                .get(`/api/users${batchlearnersRoute.path}`)

            expect(response.statusCode).toBe(200)
        })

        it("internal error", async () => {
            let batchlearnersRoute: BatchlearnersRoute = new BatchlearnersRoute();
            const app: App = new App([batchlearnersRoute]);
            let response: request.Response = await request(app.getServer())
                .get(`/api/users${batchlearnersRoute.path}`)

            expect(response.statusCode).toBe(500)
        })
    })

})
