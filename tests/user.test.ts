import * as chai from 'chai';
import { expect } from 'chai';
import request from 'supertest';
import nodemailer from 'nodemailer';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import app from '../src/server.js'; // Adjust the path to your app
import { UserService } from '../src/services/registeruser.service.js';

chai.use(sinonChai);

after(function() {
    process.exit();
  });

describe('User Controller', () => {
  let sandbox: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    const mockTransporter = {
      sendMail: sinon.stub().resolves({ response: 'Mock email sent' }),
    };  
    sandbox.stub(nodemailer, 'createTransport').returns(mockTransporter);
  });

  afterEach(() => {
    sandbox.restore();
  });



  describe('Create user', () => {
    it('should create a new user and send verification email', async () => {
      const user = { firstname: 'John', othername: 'Doe', email: 'JohnDoe@example.com', password: 'hashedpassword' };
      sandbox.stub(UserService, 'createUser').resolves(user);
      const sendVerificationTokenStub = sandbox.stub(UserService, 'sendVerificationToken').resolves();
  
      const res = await request(app)
        .post('/api/register')
        .send({ email: user.email, password: user.password, firstname: user.firstname });
  
        expect(sendVerificationTokenStub).to.have.been.calledOnce;
        expect(sendVerificationTokenStub).to.have.been.calledWithExactly('JohnDoe@example.com', 'Email Verification', sinon.match.string);
  
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'Signup was successful, Verification Email sent');
      expect(res.body).to.have.property('token');
    });
  });

  describe('Verify user account', () => {
    it('should verify the user', async () => {
      const user = { id: 1, email: 'test@example.com', firstname: 'John', isverified: false };
      sandbox.stub(UserService, 'getUserById').resolves(user);
      sandbox.stub(UserService, 'updateUser').resolves({ ...user, isverified: true });
      

      const res = await request(app)
        .post('/api/verify')
        .send({ userId: 1 });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'User verified successfully');
    });
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

  describe('Get all users', () => {
    it('should get all users', async () => {
      const users = [{ id: 1, email: 'test@example.com', firstname: 'John' }];
      sandbox.stub(UserService, 'getAllUsers').resolves(users);

      const res = await request(app).get('/api/users');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Users Retrieved succesfully');
      expect(res.body).to.have.property('users').eql(users);
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
