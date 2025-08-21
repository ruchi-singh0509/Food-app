import express from 'express';
import monitor from '../utils/monitoring.js';
import { logger } from '../config/logger.js';

/**
 * @swagger
 * tags:
 *   name: Monitoring
 *   description: System monitoring and health check API
 */

const router = express.Router();

/**
 * @swagger
 * /api/monitoring/metrics:
 *   get:
 *     summary: Get system metrics
 *     tags: [Monitoring]
 *     description: Retrieve system performance metrics including uptime, memory usage, CPU load, and request statistics
 *     responses:
 *       200:
 *         description: System metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Metrics'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get system metrics
router.get('/metrics', (req, res) => {
  try {
    const metrics = monitor.getMetrics();
    res.json({
      status: 'success',
      data: metrics
    });
  } catch (error) {
    logger.error('Error retrieving metrics', { error });
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve metrics'
    });
  }
});

/**
 * @swagger
 * /api/monitoring/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Monitoring]
 *     description: Check if the service is running properly
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-01-01T00:00:00.000Z
 *                 uptime:
 *                   type: number
 *                   example: 3600
 */
// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;