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

// Create backup directory if it doesn't exist
if (!fs.existsSync(config.backup.dir)) {
  fs.mkdirSync(config.backup.dir, { recursive: true });
}

// Generate backup filename with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFilename = config.backup.filePattern.replace('{timestamp}', timestamp);
const backupPath = path.join(config.backup.dir, backupFilename);

// Parse MongoDB URI to get database name
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/food-app';
const dbName = mongoUri.split('/').pop().split('?')[0];

// Execute mongodump command
const mongodump = spawn('mongodump', [
  `--uri=${mongoUri}`,
  `--archive=${backupPath}`,
  '--gzip'
]);

mongodump.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

mongodump.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

mongodump.on('close', (code) => {
  if (code === 0) {
    console.log(`Database backup completed successfully: ${backupPath}`);
    // Clean up old backups
    cleanupOldBackups();
  } else {
    console.error(`mongodump process exited with code ${code}`);
  }
});

// Function to clean up old backups
function cleanupOldBackups() {
  fs.readdir(config.backup.dir, (err, files) => {
    if (err) {
      console.error('Error reading backup directory:', err);
      return;
    }
    
    // Filter for backup files and sort by creation time (oldest first)
    const backupFiles = files
      .filter(file => file.startsWith('backup-') && file.endsWith('.gz'))
      .map(file => ({
        name: file,
        path: path.join(config.backup.dir, file),
        time: fs.statSync(path.join(config.backup.dir, file)).mtime.getTime()
      }))
      .sort((a, b) => a.time - b.time);
    
    // If we have more backups than the keep limit, delete the oldest ones
    if (backupFiles.length > config.backup.keep) {
      const filesToDelete = backupFiles.slice(0, backupFiles.length - config.backup.keep);
      filesToDelete.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) {
            console.error(`Error deleting old backup ${file.name}:`, err);
          } else {
            console.log(`Deleted old backup: ${file.name}`);
          }
        });
      });
    }
  });
}