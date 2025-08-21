import { loginUser, registerUser } from '../../controllers/userController.js';
import userModel from '../../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../../models/userModel.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  let req;
  let res;
  
  beforeEach(() => {
    req = {
      body: {},
      cookies: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should return 400 if email is missing', async () => {
      req.body = { password: 'password123' };
      
      await loginUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('required')
      });
    });

    it('should return 400 if password is missing', async () => {
      req.body = { email: 'test@example.com' };
      
      await loginUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('required')
      });
    });

    it('should return 401 if user does not exist', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      userModel.findOne.mockResolvedValue(null);
      
      await loginUser(req, res);
      
      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials'
      });
    });

    it('should return 401 if password is incorrect', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      userModel.findOne.mockResolvedValue({
        _id: 'user_id',
        email: 'test@example.com',
        password: 'hashed_password'
      });
      bcrypt.compare.mockResolvedValue(false);
      
      await loginUser(req, res);
      
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials'
      });
    });

    it('should return token and user data if login is successful', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        _id: 'user_id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password'
      };
      userModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock_token');
      
      await loginUser(req, res);
      
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith('jwt', 'mock_token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'mock_token',
        user: expect.objectContaining({
          id: 'user_id',
          name: 'Test User',
          email: 'test@example.com'
        })
      });
    });
  });

  // Additional tests for registerUser can be added here
});