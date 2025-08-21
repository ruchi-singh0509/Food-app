import morgan from 'morgan';
import { stream } from '../config/logger.js';

// Create custom Morgan token for request body
morgan.token('body', (req) => {
  const body = { ...req.body };
  
  // Remove sensitive information
  if (body.password) body.password = '***';
  if (body.token) body.token = '***';
  if (body.creditCard) body.creditCard = '***';
  
  return JSON.stringify(body);
});

// Define different formats for different environments
const getFormat = (env) => {
  switch (env) {
    case 'production':
      // Minimal logging for production
      return ':remote-addr - :method :url :status :response-time ms - :res[content-length]';
    case 'development':
      // Detailed logging for development
      return ':method :url :status :response-time ms - :res[content-length] :body';
    default:
      // Default format
      return 'combined';
  }
};

// Create middleware
const requestLogger = morgan(getFormat(process.env.NODE_ENV), { stream });

export default requestLogger;