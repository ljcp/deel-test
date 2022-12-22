const request = require('supertest');
const app = require('../src/app');

describe('Concurrency', () => {
    it('multiple requests to GET contracts should work',async () => {
        const contractsRequest = [];
        for (let index = 0; index < 10; index++) {
            contractsRequest.push(request(app).get('/contracts').set('profile_id',1));
        }

        const responses = await Promise.all(contractsRequest);

        responses.map(contract => {
            expect(contract.statusCode).toEqual(200);
        });

    })
    // sqlite only supports one transaction !
    it('multiple requests to pay same job should fail - optimistic locking',async () => {
        const contractsRequest = [];
        for (let index = 0; index < 2; index++) {
            contractsRequest.push(request(app).post('/jobs/1/pay').set('profile_id',1));
        }

        const responses = await Promise.all(contractsRequest);
        expect(responses[0].statusCode).toEqual(200);
        // database is locked
        expect(responses[1].statusCode).toEqual(500);
    })
});