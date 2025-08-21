#!/usr/bin/env node

/**
 * Log rotation script
 * 
 * This script can be run manually or as a scheduled task to rotate log files
 * when they reach a certain size or age.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  logDir: path.join(__dirname, '..', 'logs'),
  maxSize: 10 * 1024 * 1024, // 10MB
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  keepRotated: 5, // Keep 5 rotated files
  compress: true // Compress rotated files
};

// Ensure log directory exists
if (!fs.existsSync(config.logDir)) {
  fs.mkdirSync(config.logDir, { recursive: true });
  console.log(`Created log directory: ${config.logDir}`);
}

// Get all log files
const logFiles = fs.readdirSync(config.logDir)
  .filter(file => file.endsWith('.log'))
  .map(file => path.join(config.logDir, file));

console.log(`Found ${logFiles.length} log files`);

// Process each log file
logFiles.forEach(filePath => {
  try {
    const stats = fs.statSync(filePath);
    const fileName = path.basename(filePath);
    const now = new Date();
    
    // Check if file needs rotation (by size or age)
    if (stats.size > config.maxSize || (now - stats.mtime) > config.maxAge) {
      console.log(`Rotating ${fileName} (${(stats.size / 1024 / 1024).toFixed(2)}MB, ${Math.floor((now - stats.mtime) / (24 * 60 * 60 * 1000))} days old)`);
      
      // Create rotation filename with timestamp
      const timestamp = now.toISOString().replace(/[:.]/g, '-');
      const rotatedName = `${path.basename(fileName, '.log')}.${timestamp}.log`;
      const rotatedPath = path.join(config.logDir, rotatedName);
      
      // Rename current log file to rotated name
      fs.renameSync(filePath, rotatedPath);
      
      // Create new empty log file
      fs.writeFileSync(filePath, '');
      
      // Compress rotated file if configured
      if (config.compress) {
        const gzippedPath = `${rotatedPath}.gz`;
        const readStream = fs.createReadStream(rotatedPath);
        const writeStream = fs.createWriteStream(gzippedPath);
        const gzip = zlib.createGzip();
        
        readStream.pipe(gzip).pipe(writeStream);
        
        writeStream.on('finish', () => {
          // Remove uncompressed rotated file
          fs.unlinkSync(rotatedPath);
          console.log(`Compressed ${rotatedName} to ${path.basename(gzippedPath)}`);
          
          // Clean up old rotated files
          cleanupOldRotatedFiles(path.basename(fileName, '.log'));
        });
      } else {
        // Clean up old rotated files
        cleanupOldRotatedFiles(path.basename(fileName, '.log'));
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

// Clean up old rotated files, keeping only the most recent ones
function cleanupOldRotatedFiles(baseFileName) {
  const extension = config.compress ? '.log.gz' : '.log';
  const pattern = new RegExp(`^${baseFileName}\..*${extension.replace('.', '\\.')}$`);
  
  const rotatedFiles = fs.readdirSync(config.logDir)
    .filter(file => pattern.test(file))
    .map(file => ({
      name: file,
      path: path.join(config.logDir, file),
      time: fs.statSync(path.join(config.logDir, file)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time); // Sort by time, newest first
  
  // Remove old files beyond the keep limit
  if (rotatedFiles.length > config.keepRotated) {
    rotatedFiles.slice(config.keepRotated).forEach(file => {
      fs.unlinkSync(file.path);
      console.log(`Removed old log file: ${file.name}`);
    });
  }
}

console.log('Log rotation completed');