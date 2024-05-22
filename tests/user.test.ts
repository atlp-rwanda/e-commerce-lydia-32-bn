import * as chai from 'chai';
import { expect } from 'chai';
import request from 'supertest';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import app from '../src/server.js'; 
import { UserService } from '../src/services/registeruser.service.js';

chai.use(sinonChai);

after(function() {
    process.exit();
  });

describe('User Controller', () => {
  let sandbox: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });


  describe('Get user by Id', () => {
    it('should get user by id', async () => {
      const user = { id: 1, email: 'test@example.com', firstname: 'John' };
      sandbox.stub(UserService, 'getUserById').resolves(user);

      const res = await request(app).get('/api/users/:id');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'User Retrieved succesfully');
      expect(res.body).to.have.property('user').eql(user);
    });
  });


  describe('Update user by Id', () => {
    it('should update user by id', async () => {
      const user = { id: 1, email: 'test@example.com', firstname: 'John' };
      const updatedUser = { ...user, firstname: 'Jane' };
      sandbox.stub(UserService, 'updateUser').resolves(updatedUser);

      const res = await request(app)
        .put('/api/users/update/:id')
        .send({ firstname: 'Jane' });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'User updated successfully');
      expect(res.body).to.have.property('user').eql(updatedUser);
    });
  });

  describe('Delete user by Id', () => {
    it('should delete user by id', async () => {
      sandbox.stub(UserService, 'deleteUser').resolves(true);

      const res = await request(app).delete('/api/users/delete/:id');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'User deleted successfully');
    });
  });
});
