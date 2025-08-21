import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  // MongoDB connection string
  mongodb: {
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/food-app',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
  // Migration collection name
  migrationsCollection: 'migrations',
  
  // Directory where migration files are stored
  migrationsDir: path.resolve(__dirname, './migration-scripts'),
  
  // File pattern to load migration files
  filePattern: /^\.\d+\.(js|cjs|mjs)$/,
  
  // CLI migration collection name
  cli: {
    migrationsDir: path.resolve(__dirname, './migration-scripts'),
  },
  
  // Backup configuration
  backup: {
    // Directory where backups are stored
    dir: path.resolve(__dirname, '../backups'),
    // Backup file naming pattern
    filePattern: 'backup-{timestamp}.gz',
    // Backup frequency in days
    frequency: 1,
    // Number of backups to keep
    keep: 7,
  }
};