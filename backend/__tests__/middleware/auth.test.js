import { auth } from '../../middleware/auth.js';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
      cookies: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', async () => {
    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining('token')
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should use token from cookies if available', async () => {
    req.cookies.jwt = 'valid_token';
    jwt.verify.mockReturnValue({ id: 'user_id' });

    await auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid_token', process.env.JWT_SECRET);
    expect(req.user).toEqual({ id: 'user_id' });
    expect(req.body.userId).toBe('user_id');
    expect(next).toHaveBeenCalled();
  });

  it('should use token from Authorization header if cookie not available', async () => {
    req.headers.authorization = 'Bearer valid_token';
    jwt.verify.mockReturnValue({ id: 'user_id' });

    await auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid_token', process.env.JWT_SECRET);
    expect(req.user).toEqual({ id: 'user_id' });
    expect(req.body.userId).toBe('user_id');
    expect(next).toHaveBeenCalled();
  });

  it('should use token from headers.token if other methods not available', async () => {
    req.headers.token = 'valid_token';
    jwt.verify.mockReturnValue({ id: 'user_id' });

    await auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid_token', process.env.JWT_SECRET);
    expect(req.user).toEqual({ id: 'user_id' });
    expect(req.body.userId).toBe('user_id');
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    req.headers.token = 'invalid_token';
    jwt.verify.mockImplementation(() => {
      const error = new Error('Invalid token');
      error.name = 'JsonWebTokenError';
      throw error;
    });

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid token'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is expired', async () => {
    req.headers.token = 'expired_token';
    jwt.verify.mockImplementation(() => {
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';
      throw error;
    });

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining('expired')
    });
    expect(next).not.toHaveBeenCalled();
  });
});