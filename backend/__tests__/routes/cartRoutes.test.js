import request from 'supertest';
import express from 'express';
import cartRouter from '../../routes/cartRoute.js';
import { connectDB, disconnectDB, clearDatabase } from '../setup.js';
import cartModel from '../../models/cartModel.js';
import { auth } from '../../middleware/auth.js';

// Mock dependencies
jest.mock('../../models/cartModel.js');
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

app.use('/api/cart', cartRouter);

describe('Cart Routes', () => {
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

  describe('POST /api/cart/add', () => {
    it('should add an item to the cart', async () => {
      const mockCartItem = {
        userId: 'test_user_id',
        foodId: 'food_id_1',
        quantity: 2
      };

      // Mock findOne to return null (cart doesn't exist yet)
      cartModel.findOne.mockResolvedValue(null);
      
      // Mock save for new cart
      cartModel.prototype.save.mockResolvedValue({
        userId: 'test_user_id',
        items: [{
          foodId: 'food_id_1',
          quantity: 2
        }]
      });

      const response = await request(app)
        .post('/api/cart/add')
        .send({
          foodId: 'food_id_1',
          quantity: 2
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('added');
      expect(cartModel.prototype.save).toHaveBeenCalled();
    });

    it('should update quantity if item already exists in cart', async () => {
      // Mock existing cart with the item
      const existingCart = {
        userId: 'test_user_id',
        items: [{
          foodId: 'food_id_1',
          quantity: 1
        }],
        save: jest.fn().mockResolvedValue({
          userId: 'test_user_id',
          items: [{
            foodId: 'food_id_1',
            quantity: 3 // Updated quantity
          }]
        })
      };

      cartModel.findOne.mockResolvedValue(existingCart);

      const response = await request(app)
        .post('/api/cart/add')
        .send({
          foodId: 'food_id_1',
          quantity: 2
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('updated');
      expect(existingCart.save).toHaveBeenCalled();
    });

    it('should handle errors when adding to cart', async () => {
      cartModel.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/cart/add')
        .send({
          foodId: 'food_id_1',
          quantity: 2
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/cart/get', () => {
    it('should get the user\'s cart', async () => {
      const mockCart = {
        userId: 'test_user_id',
        items: [
          {
            foodId: 'food_id_1',
            quantity: 2,
            food: {
              name: 'Pizza',
              price: 10.99,
              image: 'pizza.jpg'
            }
          }
        ]
      };

      cartModel.findOne.mockResolvedValue(mockCart);

      const response = await request(app).get('/api/cart/get');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.cart).toBeDefined();
      expect(response.body.cart.items).toHaveLength(1);
    });

    it('should return empty cart if user has no cart', async () => {
      cartModel.findOne.mockResolvedValue(null);

      const response = await request(app).get('/api/cart/get');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.cart).toBeNull();
    });

    it('should handle errors when getting cart', async () => {
      cartModel.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/cart/get');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/cart/remove', () => {
    it('should remove an item from the cart', async () => {
      // Mock existing cart with the item
      const existingCart = {
        userId: 'test_user_id',
        items: [
          {
            foodId: 'food_id_1',
            quantity: 2
          },
          {
            foodId: 'food_id_2',
            quantity: 1
          }
        ],
        save: jest.fn().mockResolvedValue({
          userId: 'test_user_id',
          items: [
            {
              foodId: 'food_id_2',
              quantity: 1
            }
          ]
        })
      };

      cartModel.findOne.mockResolvedValue(existingCart);

      const response = await request(app)
        .post('/api/cart/remove')
        .send({
          foodId: 'food_id_1'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('removed');
      expect(existingCart.save).toHaveBeenCalled();
    });

    it('should return 404 if cart not found', async () => {
      cartModel.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/cart/remove')
        .send({
          foodId: 'food_id_1'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should handle errors when removing from cart', async () => {
      cartModel.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/cart/remove')
        .send({
          foodId: 'food_id_1'
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });
});