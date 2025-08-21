# Monitoring and Logging System

This document describes the monitoring and logging system implemented for the Food App backend.

## Overview

The monitoring and logging system provides comprehensive visibility into the application's behavior, performance, and errors. It consists of the following components:

1. **Logging System**: Using Winston and Morgan for structured logging
2. **Error Handling**: Centralized error handling with detailed error information
3. **System Monitoring**: Real-time tracking of system metrics
4. **API Endpoints**: Exposing health and metrics information
5. **Log Rotation**: Automated log file management

## Logging System

### Winston Logger

Winston is used as the primary logging library, configured in `config/logger.js`. It provides:

- Multiple log levels (error, warn, info, debug)
- Structured JSON logging in production
- Human-readable colorized logs in development
- File-based logging with separate files for errors and combined logs
- Exception and rejection handling

### Morgan HTTP Logger

Morgan is used for HTTP request logging, configured in `middleware/requestLogger.js`. It provides:

- Detailed request logging with customizable formats
- Different log formats for development and production environments
- Integration with Winston for consistent log storage
- Sanitization of sensitive information in request bodies

## Error Handling

Centralized error handling is implemented in `middleware/errorMiddleware.js`, providing:

- Consistent error response format
- Detailed error logging for server errors
- Sanitized error messages in production
- Special handling for CSRF and 404 errors

## System Monitoring

The system monitoring utility in `utils/monitoring.js` tracks:

- Server uptime
- Memory usage (total, free, process)
- CPU load
- Request metrics (total, success, error, average response time)

## API Endpoints

Monitoring endpoints are available at:

- `/api/monitoring/health` - Basic health check endpoint
- `/api/monitoring/metrics` - Detailed system metrics

## Log Rotation

A log rotation script is provided in `scripts/log-rotation.js` to manage log files:

- Rotates logs based on size or age
- Compresses rotated logs
- Maintains a configurable number of historical logs
- Can be run manually or as a scheduled task

## Usage

### Logging

To use the logger in your code:

```javascript
import { logger } from '../config/logger.js';

// Different log levels
logger.error('This is an error message', { additionalData: 'value' });
logger.warn('This is a warning message');
logger.info('This is an info message');
logger.debug('This is a debug message');
```

### Monitoring

The monitoring system starts automatically with the server. You can access metrics via the API endpoint or programmatically:

```javascript
import monitor from '../utils/monitoring.js';

// Get current metrics
const metrics = monitor.getMetrics();
```

### Log Rotation

Run the log rotation script manually:

```bash
node backend/scripts/log-rotation.js
```

Or set up a scheduled task (cron job) to run it periodically.

## Configuration

Logging and monitoring can be configured through environment variables:

- `NODE_ENV` - Set to 'production' for production-optimized logging
- `LOG_LEVEL` - Set the minimum log level (error, warn, info, debug)

## Log Files

Logs are stored in the `backend/logs` directory:

- `error.log` - Error-level logs only
- `combined.log` - All logs
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

## Best Practices

1. Use appropriate log levels
2. Include contextual information in log messages
3. Don't log sensitive information
4. Use structured logging (objects) for complex data
5. Monitor the size of log files
6. Set up alerts for error conditions