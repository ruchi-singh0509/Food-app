import request from 'supertest';
import express from 'express';
import orderRouter from '../../routes/orderRoute.js';
import { connectDB, disconnectDB, clearDatabase } from '../setup.js';
import orderModel from '../../models/orderModel.js';
import { auth } from '../../middleware/auth.js';

// Mock dependencies
jest.mock('../../models/orderModel.js');
jest.mock('../../middleware/auth.js');

// Create a test app
const app = express();
app.use(express.json());

// Mock auth middleware to simulate authenticated requests
auth.mockImplementation((req, res, next) => {
  req.user = { id: 'test_user_id' };
  req.body.userId = 'test_user_id';
  next();
});

app.use('/api/order', orderRouter);

describe('Order Routes', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    jest.clearAllMocks();
  });

  describe('POST /api/order/place', () => {
    it('should place a new order', async () => {
      const orderData = {
        items: [
          {
            foodId: 'food_id_1',
            name: 'Pizza',
            price: 10.99,
            quantity: 2
          }
        ],
        totalAmount: 21.98,
        shippingAddress: '123 Test St, Test City',
        paymentMethod: 'COD'
      };

      orderModel.prototype.save.mockResolvedValue({
        _id: 'order_id_1',
        userId: 'test_user_id',
        ...orderData,
        status: 'Pending',
        createdAt: new Date()
      });

      const response = await request(app)
        .post('/api/order/place')
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.order).toBeDefined();
      expect(response.body.order.userId).toBe('test_user_id');
      expect(response.body.order.status).toBe('Pending');
      expect(orderModel.prototype.save).toHaveBeenCalled();
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/order/place')
        .send({
          // Missing required fields
          totalAmount: 21.98
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    it('should handle errors when placing an order', async () => {
      const orderData = {
        items: [
          {
            foodId: 'food_id_1',
            name: 'Pizza',
            price: 10.99,
            quantity: 2
          }
        ],
        totalAmount: 21.98,
        shippingAddress: '123 Test St, Test City',
        paymentMethod: 'COD'
      };

      orderModel.prototype.save.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/order/place')
        .send(orderData);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/order/userorders', () => {
    it('should get all orders for the user', async () => {
      const mockOrders = [
        {
          _id: 'order_id_1',
          userId: 'test_user_id',
          items: [
            {
              foodId: 'food_id_1',
              name: 'Pizza',
              price: 10.99,
              quantity: 2
            }
          ],
          totalAmount: 21.98,
          status: 'Delivered',
          createdAt: new Date()
        },
        {
          _id: 'order_id_2',
          userId: 'test_user_id',
          items: [
            {
              foodId: 'food_id_2',
              name: 'Burger',
              price: 8.99,
              quantity: 1
            }
          ],
          totalAmount: 8.99,
          status: 'Pending',
          createdAt: new Date()
        }
      ];

      orderModel.find.mockResolvedValue(mockOrders);

      const response = await request(app).get('/api/order/userorders');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.orders).toHaveLength(2);
      expect(orderModel.find).toHaveBeenCalledWith({ userId: 'test_user_id' });
    });

    it('should return empty array if user has no orders', async () => {
      orderModel.find.mockResolvedValue([]);

      const response = await request(app).get('/api/order/userorders');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.orders).toHaveLength(0);
    });

    it('should handle errors when getting user orders', async () => {
      orderModel.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/order/userorders');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  // Additional tests for other order routes can be added here
  // For example: GET /api/order/list (admin), PUT /api/order/status/:id (admin)
});