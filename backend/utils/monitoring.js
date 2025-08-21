import { logger } from '../config/logger.js';
import os from 'os';

// Basic system monitoring
class SystemMonitor {
  constructor() {
    this.startTime = Date.now();
    this.intervalId = null;
    this.metrics = {
      uptime: 0,
      memoryUsage: {
        total: 0,
        free: 0,
        processUsage: 0
      },
      cpu: {
        loadAvg: [0, 0, 0],
        cores: os.cpus().length
      },
      requests: {
        total: 0,
        success: 0,
        error: 0,
        avgResponseTime: 0
      }
    };
    this.responseTimeSamples = [];
  }

  // Start monitoring
  start(interval = 300000) { // Default: log every 5 minutes
    if (this.intervalId) {
      return;
    }

    // Initial log
    this.logMetrics();

    // Set up interval for regular logging
    this.intervalId = setInterval(() => {
      this.logMetrics();
    }, interval);

    logger.info('System monitoring started');
  }

  // Stop monitoring
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info('System monitoring stopped');
    }
  }

  // Update metrics
  updateMetrics() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const processMemory = process.memoryUsage();

    this.metrics.uptime = Math.floor((Date.now() - this.startTime) / 1000); // in seconds
    this.metrics.memoryUsage = {
      total: totalMem,
      free: freeMem,
      used: totalMem - freeMem,
      usedPercentage: ((totalMem - freeMem) / totalMem * 100).toFixed(2),
      processUsage: processMemory.heapUsed,
      processUsageFormatted: (processMemory.heapUsed / 1024 / 1024).toFixed(2) + ' MB'
    };
    this.metrics.cpu.loadAvg = os.loadavg();

    // Calculate average response time if we have samples
    if (this.responseTimeSamples.length > 0) {
      const sum = this.responseTimeSamples.reduce((a, b) => a + b, 0);
      this.metrics.requests.avgResponseTime = (sum / this.responseTimeSamples.length).toFixed(2);
      // Reset samples after calculation
      this.responseTimeSamples = [];
    }

    return this.metrics;
  }

  // Log current metrics
  logMetrics() {
    const metrics = this.updateMetrics();
    logger.info('System metrics', { metrics });
    return metrics;
  }

  // Track request completion
  trackRequest(responseTime, isError = false) {
    this.metrics.requests.total += 1;
    
    if (isError) {
      this.metrics.requests.error += 1;
    } else {
      this.metrics.requests.success += 1;
    }

    // Add response time to samples for averaging
    if (responseTime) {
      this.responseTimeSamples.push(responseTime);
    }
  }

  // Get current metrics
  getMetrics() {
    return this.updateMetrics();
  }
}

// Create singleton instance
const monitor = new SystemMonitor();

// Middleware to track request metrics
export const requestMonitoring = (req, res, next) => {
  // Add start time to request
  req.startTime = Date.now();

  // Track response
  res.on('finish', () => {
    const responseTime = Date.now() - req.startTime;
    const isError = res.statusCode >= 400;
    
    // Track in monitor
    monitor.trackRequest(responseTime, isError);
  });

  next();
};

// Export monitor instance
export default monitor;