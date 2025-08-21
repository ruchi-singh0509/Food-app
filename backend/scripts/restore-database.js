import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import migration config
import config from '../migrations/config.js';

// Check if backup file is provided as argument
const backupFile = process.argv[2];
if (!backupFile) {
  console.error('Error: Backup file path is required');
  console.error('Usage: node restore-database.js <backup-file-path>');
  process.exit(1);
}

// Resolve backup file path
const backupPath = path.resolve(process.cwd(), backupFile);

// Check if backup file exists
if (!fs.existsSync(backupPath)) {
  console.error(`Error: Backup file not found: ${backupPath}`);
  process.exit(1);
}

// Parse MongoDB URI
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/food-app';

// Execute mongorestore command
console.log(`Restoring database from backup: ${backupPath}`);
console.log(`Target database: ${mongoUri}`);

const mongorestore = spawn('mongorestore', [
  `--uri=${mongoUri}`,
  `--archive=${backupPath}`,
  '--gzip',
  '--drop' // Drop existing collections before restoring
]);

mongorestore.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

mongorestore.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

mongorestore.on('close', (code) => {
  if (code === 0) {
    console.log('Database restore completed successfully');
  } else {
    console.error(`mongorestore process exited with code ${code}`);
  }
});