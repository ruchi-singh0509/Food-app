import { logger } from '../config/logger.js';

// Not Found Error Handler
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  logger.error(`404 - Not Found - ${req.originalUrl}`);
  next(error);
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
  // CSRF error handling
  if (err.code === 'EBADCSRFTOKEN') {
    logger.error(`CSRF Attack - ${req.ip} - ${req.originalUrl}`);
    return res.status(403).json({
      status: 'error',
      message: 'Invalid CSRF token. Form tampered with!'
    });
  }
  
  // Set status code
  const statusCode = err.statusCode || 500;
  
  // Log the error
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
      stack: err.stack,
      body: req.body,
      params: req.params,
      query: req.query
    });
  } else {
    logger.warn(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }
  
  // Send response
  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 
      statusCode === 404 ? 'Resource not found' : 'Something went wrong' : 
      err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};