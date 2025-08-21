import { MongoClient } from 'mongodb';
import config from '../config.js';

/**
 * Migration: 1.0 - Initial Schema
 * 
 * This migration ensures the initial schema is properly set up
 * with all required collections and indexes.
 */
export async function up() {
  const client = await MongoClient.connect(config.mongodb.url, config.mongodb.options);
  const db = client.db();
  
  try {
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Users collection
    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      // Create indexes
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ username: 1 });
      console.log('Created users collection with indexes');
    }
    
    // Food items collection
    if (!collectionNames.includes('fooditems')) {
      await db.createCollection('fooditems');
      // Create indexes
      await db.collection('fooditems').createIndex({ name: 1 });
      await db.collection('fooditems').createIndex({ category: 1 });
      console.log('Created fooditems collection with indexes');
    }
    
    // Orders collection
    if (!collectionNames.includes('orders')) {
      await db.createCollection('orders');
      // Create indexes
      await db.collection('orders').createIndex({ userId: 1 });
      await db.collection('orders').createIndex({ status: 1 });
      await db.collection('orders').createIndex({ createdAt: 1 });
      console.log('Created orders collection with indexes');
    }
    
    // Carts collection
    if (!collectionNames.includes('carts')) {
      await db.createCollection('carts');
      // Create indexes
      await db.collection('carts').createIndex({ userId: 1 }, { unique: true });
      console.log('Created carts collection with indexes');
    }
    
    console.log('Migration 1.0 completed successfully');
  } catch (error) {
    console.error('Migration 1.0 failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

export async function down() {
  // This is a base migration, down would remove all data
  // Implement with caution if needed
  console.log('Down migration for 1.0 is not implemented for safety reasons');
}