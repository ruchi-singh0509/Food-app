import { logger, stream } from '../../config/logger.js';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

// Get logs directory
const logsDir = join(__dirname, '../../logs');

describe('Logger Configuration', () => {
  beforeAll(() => {
    // Ensure logs directory exists
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }
  });

  test('logger should be defined', () => {
    expect(logger).toBeDefined();
  });

  test('logger should have the correct transports', () => {
    // Winston logger should have at least 3 transports (2 file transports + console in test)
    expect(logger.transports.length).toBeGreaterThanOrEqual(3);
  });

  test('stream should be defined and have write method', () => {
    expect(stream).toBeDefined();
    expect(typeof stream.write).toBe('function');
  });

  test('logger should write to log file', () => {
    // Write a test log message
    const testMessage = `Test log message ${Date.now()}`;
    logger.info(testMessage);

    // Check if combined.log exists and contains the test message
    // Note: This is an asynchronous operation, so we need to wait a bit
    setTimeout(() => {
      const logFile = join(logsDir, 'combined.log');
      expect(existsSync(logFile)).toBe(true);

      const logContent = readFileSync(logFile, 'utf8');
      expect(logContent).toContain(testMessage);
    }, 100);
  });
});