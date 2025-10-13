import { createClient } from 'redis';
import { logger } from './logger.js';

// Create Redis client with limited reconnection attempts
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      // Stop trying to reconnect after 5 attempts
      if (retries >= 5) {
        logger.warn('Redis connection failed after 5 attempts. Disabling Redis.');
        return false;
      }
      // Exponential backoff with max delay of 5 seconds
      const delay = Math.min(Math.pow(2, retries) * 100, 5000);
      logger.info(`Redis reconnecting in ${delay}ms... (attempt ${retries + 1}/5)`);
      return delay;
    }
  }
});

let redisAvailable = false;

// Redis error handling
redisClient.on('error', (err) => {
  redisAvailable = false;
  logger.error('Redis Client Error', { error: err.message });
});

redisClient.on('connect', () => {
  redisAvailable = true;
  logger.info('Redis Client Connected');
});

redisClient.on('reconnecting', () => {
  redisAvailable = false;
  logger.info('Redis Client Reconnecting');
});

// Connect to Redis
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    return redisClient;
  } catch (error) {
    logger.error('Redis connection error', { error: error.message });
    throw error;
  }
};

// Cache middleware
const cache = (duration) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests or if Redis is not available
    if (req.method !== 'GET' || !redisAvailable) {
      return next();
    }

    // Create a unique key based on the request URL
    const key = `cache:${req.originalUrl || req.url}`;

    try {
      // Try to get cached response
      const cachedResponse = await redisClient.get(key);

      if (cachedResponse) {
        // If cache hit, send cached response
        const parsedResponse = JSON.parse(cachedResponse);
        logger.debug(`Cache hit for ${key}`);
        return res.json(parsedResponse);
      }

      // If cache miss, store original res.json method
      const originalJson = res.json;

      // Override res.json method to cache the response
      res.json = function (data) {
        // Store the response in Redis cache only if Redis is available
        if (redisAvailable) {
          redisClient.setEx(key, duration, JSON.stringify(data)).catch(err => {
            logger.error('Failed to cache response', { error: err.message, key });
          });
          logger.debug(`Cache set for ${key}, expires in ${duration}s`);
        }

        // Call the original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Redis cache error', { error: error.message, key });
      next();
    }
  };
};

// Clear cache by pattern
const clearCache = async (pattern) => {
  try {
    if (!pattern) {
      logger.warn('No pattern provided for cache clearing');
      return;
    }

    // Use SCAN to find keys matching the pattern
    let cursor = 0;
    let keys = [];

    do {
      const result = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100
      });

      cursor = result.cursor;
      keys = keys.concat(result.keys);
    } while (cursor !== 0);

    // Delete all found keys
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`Cleared ${keys.length} cache keys matching pattern: ${pattern}`);
    } else {
      logger.info(`No cache keys found matching pattern: ${pattern}`);
    }
  } catch (error) {
    logger.error('Error clearing cache', { error: error.message, pattern });
  }
};

export { redisClient, connectRedis, cache, clearCache };