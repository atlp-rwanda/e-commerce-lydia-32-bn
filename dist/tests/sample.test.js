import request from 'supertest';
import { expect } from 'chai';
import app from '../src/server.js';
<<<<<<< HEAD
after(function () {
    process.exit();
});
describe('Sample unit test for Express Server', () => {
    after(function () {
        process.exit();
    });
=======
describe('Sample unit test for Express Server', () => {
>>>>>>> 801b7973c984fc418df60707b25846b81a95d214
    it('should return welcome message on Get/', async () => {
        const res = await request(app).get('/');
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('welcome to our project');
    });
});
