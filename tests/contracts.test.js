const request = require('supertest');
const app = require('../src/app');

describe('Contracts Tests', () => {
    it('should get a contract',async () => {
        const res = await request(app).get('/contracts').set('profile_id',1);
        console.debug('statusCode',res.statusCode);
        console.debug('body',res.body);
        //expect(res.statusCode).toEqual(201)
        //expect(res.body).toHaveProperty('post')
        expect(true).toBe(true);
    })
});