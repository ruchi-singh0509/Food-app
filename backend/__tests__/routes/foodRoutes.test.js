import request from 'supertest';
import express from 'express';
import foodRouter from '../../routes/foodRoute.js';
import { connectDB, disconnectDB, clearDatabase } from '../setup.js';
import foodModel from '../../models/foodModel.js';

// Mock dependencies
jest.mock('../../models/foodModel.js');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/food', foodRouter);

describe('Food Routes', () => {
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

  describe('GET /api/food', () => {
    it('should return all food items', async () => {
      const mockFoodItems = [
        { _id: '1', name: 'Pizza', price: 10.99, category: 'Main Course', image: 'pizza.jpg' },
        { _id: '2', name: 'Burger', price: 8.99, category: 'Main Course', image: 'burger.jpg' }
      ];
      
      foodModel.find.mockResolvedValue(mockFoodItems);

      const response = await request(app).get('/api/food');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.foods).toHaveLength(2);
      expect(response.body.foods[0].name).toBe('Pizza');
      expect(response.body.foods[1].name).toBe('Burger');
    });

    it('should handle errors when fetching food items', async () => {
      foodModel.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/food');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/food/:id', () => {
    it('should return a specific food item by ID', async () => {
      const mockFoodItem = { 
        _id: '1', 
        name: 'Pizza', 
        price: 10.99, 
        category: 'Main Course', 
        image: 'pizza.jpg',
        description: 'Delicious pizza with cheese and tomato sauce'
      };
      
      foodModel.findById.mockResolvedValue(mockFoodItem);

      const response = await request(app).get('/api/food/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.food.name).toBe('Pizza');
      expect(response.body.food.price).toBe(10.99);
    });

    it('should return 404 if food item is not found', async () => {
      foodModel.findById.mockResolvedValue(null);

      const response = await request(app).get('/api/food/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should handle errors when fetching a food item', async () => {
      foodModel.findById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/food/1');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  // Additional tests for POST, PUT, DELETE endpoints can be added here
});