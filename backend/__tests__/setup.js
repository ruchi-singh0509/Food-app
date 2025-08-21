// Test setup file
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env.test if it exists, otherwise from .env
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

// Mock environment variables for testing if they don't exist
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/food-app-test';
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test-session-secret';

// Function to connect to the test database
export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log('Connected to test database');
    }
  } catch (error) {
    console.error('Error connecting to test database:', error.message);
    process.exit(1);
  }
};

// Function to disconnect from the test database
export const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('Disconnected from test database');
    }
  } catch (error) {
    console.error('Error disconnecting from test database:', error.message);
    process.exit(1);
  }
};

// Function to clear all collections in the test database
export const clearDatabase = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Attempted to clear non-test database! Aborting.');
  }
  
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

// Global setup and teardown hooks
globalThis.beforeAll = async () => {
  await connectDB();
};

globalThis.afterAll = async () => {
  await disconnectDB();
};

globalThis.beforeEach = async () => {
  if (process.env.NODE_ENV === 'test') {
    await clearDatabase();
  }
};