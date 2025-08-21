import request from 'supertest';
import express from 'express';
import userRouter from '../../routes/userRoute.js';
import { connectDB, disconnectDB, clearDatabase } from '../setup.js';
import userModel from '../../models/userModel.js';
import bcrypt from 'bcrypt';

// Mock dependencies
jest.mock('../../models/userModel.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/user', userRouter);

describe('User Routes', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    jest.clearAllMocks();
  });

  describe('POST /api/user/register', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should return 400 if email is invalid', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Password123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('valid email');
    });

    it('should return 400 if password is too weak', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'weak'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('password');
    });

    it('should return 409 if email already exists', async () => {
      userModel.findOne.mockResolvedValue({ email: 'test@example.com' });

      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should register a new user successfully', async () => {
      userModel.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_password');
      userModel.prototype.save.mockResolvedValue({
        _id: 'user_id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password'
      });

      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });

  describe('POST /api/user/login', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should return 401 if user does not exist', async () => {
      userModel.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should return 401 if password is incorrect', async () => {
      userModel.findOne.mockResolvedValue({
        _id: 'user_id',
        email: 'test@example.com',
        password: 'hashed_password'
      });
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should login user successfully', async () => {
      userModel.findOne.mockResolvedValue({
        _id: 'user_id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password'
      });
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });
});