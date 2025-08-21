import { logger } from '../config/logger.js';
import monitor from '../utils/monitoring.js';

// Test logging at different levels
logger.error('This is an ERROR level message');
logger.warn('This is a WARN level message');
logger.info('This is an INFO level message');
logger.debug('This is a DEBUG level message');

// Test monitoring
monitor.start(5000); // Start monitoring with 5 second interval

// Simulate some requests
for (let i = 0; i < 10; i++) {
  // Simulate successful requests
  monitor.trackRequest(Math.floor(Math.random() * 100), false);
  
  // Simulate error requests (20% chance)
  if (Math.random() < 0.2) {
    monitor.trackRequest(Math.floor(Math.random() * 200), true);
  }
}

// Get and log metrics
const metrics = monitor.getMetrics();
logger.info('Current system metrics', { metrics });

console.log('Logging test complete. Check the logs directory for output.');
console.log('Metrics:', JSON.stringify(metrics, null, 2));

// Stop monitoring after 10 seconds
setTimeout(() => {
  monitor.stop();
  console.log('Monitoring stopped.');
  process.exit(0);
}, 10000);