# Database Management Documentation

## Overview

This document outlines the database migration strategy and backup procedures implemented for the Food-app project. These tools help maintain database schema consistency across environments and ensure data safety through regular backups.

## Migration Strategy

The project uses `mongoose-migrate-2` to manage database schema migrations. This approach allows for:

- Version-controlled database schema changes
- Consistent database structure across all environments
- Safe application of changes with up/down migration support
- Tracking of applied migrations

### Migration Directory Structure

```
backend/
├── migrations/
│   ├── config.js                    # Migration configuration
│   └── migration-scripts/           # Migration script files
│       └── 1.0-initial-schema.js    # Initial schema migration
```

### Migration Commands

The following npm scripts are available for managing migrations:

```bash
# Create a new migration file
npm run migrate:create <migration-name>

# Apply pending migrations
npm run migrate:up

# Revert the most recent migration
npm run migrate:down

# Check migration status
npm run migrate:status
```

### Creating a New Migration

1. Run `npm run migrate:create <migration-name>` to create a new migration file
2. Edit the generated file to implement the `up()` and `down()` functions
3. The `up()` function should apply the schema changes
4. The `down()` function should revert the changes made by `up()`

### Example Migration

```javascript
export async function up() {
  const client = await MongoClient.connect(config.mongodb.url);
  const db = client.db();
  
  try {
    // Add a new field to users collection
    await db.collection('users').updateMany(
      {},
      { $set: { newField: 'default value' } }
    );
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

export async function down() {
  const client = await MongoClient.connect(config.mongodb.url);
  const db = client.db();
  
  try {
    // Remove the field added in the up migration
    await db.collection('users').updateMany(
      {},
      { $unset: { newField: '' } }
    );
    
    console.log('Down migration completed successfully');
  } catch (error) {
    console.error('Down migration failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}
```

## Backup Procedures

The project includes automated database backup functionality using MongoDB's native tools.

### Backup Configuration

Backup settings are defined in `migrations/config.js`:

```javascript
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
```

### Backup Commands

```bash
# Create a database backup
npm run db:backup

# Restore from a backup file
npm run db:restore <backup-file-path>
```

### Automated Backups

To set up automated daily backups, add a cron job or scheduled task:

#### Linux/macOS (Cron)

```bash
# Add to crontab (run 'crontab -e')
0 2 * * * cd /path/to/food-app/backend && npm run db:backup
```

#### Windows (Task Scheduler)

1. Open Task Scheduler
2. Create a new task
3. Set trigger to run daily at 2:00 AM
4. Add action: Start a program
5. Program/script: `npm`
6. Arguments: `run db:backup`
7. Start in: `C:\path\to\food-app\backend`

### Backup Retention

The backup script automatically manages backup retention:

- Keeps the most recent 7 backups (configurable)
- Automatically deletes older backups
- Uses compressed format to minimize storage requirements

### Backup Verification

It's recommended to periodically verify backups by performing a test restore:

```bash
# Restore to a test database
MONGO_URI=mongodb://localhost:27017/food-app-test npm run db:restore backups/backup-file.gz
```

## Disaster Recovery

In case of data loss or corruption, follow these steps:

1. Stop the application to prevent further data changes
2. Identify the most recent valid backup
3. Restore the database using the backup file:
   ```bash
   npm run db:restore backups/backup-file.gz
   ```
4. Verify the restored data
5. Restart the application

## Best Practices

1. **Always test migrations** in a development or staging environment before applying to production
2. **Create backups before** running migrations on production
3. **Keep migration files small** and focused on specific changes
4. **Include both up and down migrations** for all schema changes
5. **Document complex migrations** with comments
6. **Verify backup integrity** regularly
7. **Store backups in multiple locations** (local and cloud storage)