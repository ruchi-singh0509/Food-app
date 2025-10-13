import { default as monitor, requestMonitoring } from '../../utils/monitoring.js';

describe('System Monitoring', () => {
  test('monitor should be defined', () => {
    expect(monitor).toBeDefined();
  });

  test('monitor should have required methods', () => {
    expect(typeof monitor.start).toBe('function');
    expect(typeof monitor.stop).toBe('function');
    expect(typeof monitor.getMetrics).toBe('function');
    expect(typeof monitor.trackRequest).toBe('function');
  });

  test('monitor should track metrics', () => {
    // Get initial metrics
    const metrics = monitor.getMetrics();
    
    // Check if metrics object has required properties
    expect(metrics).toHaveProperty('uptime');
    expect(metrics).toHaveProperty('memoryUsage');
    expect(metrics).toHaveProperty('cpu');
    expect(metrics).toHaveProperty('requests');
    
    // Track a request
    const initialTotal = metrics.requests.total;
    monitor.trackRequest(100, false);
    
    // Check if request was tracked
    const updatedMetrics = monitor.getMetrics();
    expect(updatedMetrics.requests.total).toBe(initialTotal + 1);
    expect(updatedMetrics.requests.success).toBeGreaterThan(metrics.requests.success);
  });

  test('requestMonitoring middleware should be defined', () => {
    expect(requestMonitoring).toBeDefined();
    expect(typeof requestMonitoring).toBe('function');
  });

  test('requestMonitoring middleware should call next', () => {
    // Mock request, response, and next function
    const req = {};
    const res = {
      on: jest.fn((event, callback) => {
        if (event === 'finish') {
          // Simulate response finish event
          callback();
        }
        return res;
      })
    };
    const next = jest.fn();
    
    // Call middleware
    requestMonitoring(req, res, next);
    
    // Check if next was called
    expect(next).toHaveBeenCalled();
    
    // Check if startTime was added to request
    expect(req.startTime).toBeDefined();
    
    // Check if response.on was called with 'finish'
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });
});