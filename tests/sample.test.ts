import request from 'supertest';
import { expect } from 'chai';
import app from '../src/server.js';

  after(function() {
  process.exit();
});
  

describe('Sample unit test for Express Server', () => {
  
  it('should return welcome message on Get/', async () => {
    const res = await request(app).get('/');
    expect(res.status).to.equal(200);
    expect(res.text).to.equal('welcome to our project');
  });
});
