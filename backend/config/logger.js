import winston from 'winston';
import 'dotenv/config.js';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message} ${info.stack || ''}`
  )
);

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: logFormat,
  defaultMeta: { service: 'food-app-backend' },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: parseInt(process.env.LOG_MAX_SIZE, 10) || 5242880, // Default: 5MB
      maxFiles: parseInt(process.env.LOG_MAX_FILES, 10) || 5,
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: parseInt(process.env.LOG_MAX_SIZE, 10) || 5242880, // Default: 5MB
      maxFiles: parseInt(process.env.LOG_MAX_FILES, 10) || 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: 'logs/exceptions.log',
      maxsize: parseInt(process.env.LOG_MAX_SIZE, 10) || 5242880,
      maxFiles: parseInt(process.env.LOG_MAX_FILES, 10) || 5,
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: 'logs/rejections.log',
      maxsize: parseInt(process.env.LOG_MAX_SIZE, 10) || 5242880,
      maxFiles: parseInt(process.env.LOG_MAX_FILES, 10) || 5,
    })
  ],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

// Create a stream object for Morgan integration
const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export { logger, stream };