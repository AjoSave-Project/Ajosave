# Database Scripts

This directory contains utility scripts for managing the AjoSave database.

## 📋 Available Scripts

### 1. Clear Database Script (`clearDatabase.js`)

A comprehensive script with safety features for clearing database collections.

**Features:**
- ✅ Interactive confirmation prompts
- ✅ Before/After statistics
- ✅ Clear all or specific collections
- ✅ Exclude specific collections
- ✅ Detailed operation summary

**Usage:**

```bash
# Clear all collections (with confirmation)
npm run db:clear
# or
node scripts/clearDatabase.js --all

# Clear specific collection
npm run db:clear:users
# or
node scripts/clearDatabase.js --collection=users

# Clear all except settings
npm run db:clear:except-settings
# or
node scripts/clearDatabase.js --all --except=settings

# Skip confirmation (use with caution!)
node scripts/clearDatabase.js --all --confirm

# Show help
node scripts/clearDatabase.js --help
```

**Available Collections:**
- `users` - User accounts
- `groups` - Savings groups
- `transactions` - Transaction records
- `wallets` - User wallets
- `admins` - Admin accounts
- `alerts` - System alerts
- `auditlogs` - Audit trail
- `locks` - Lock records
- `messages` - Messages
- `settings` - System settings
- `supporttickets` - Support tickets

### 2. Quick Clear Script (`quickClear.js`)

A fast, no-prompt script for development environments.

**Features:**
- ⚡ No confirmation prompts
- ⚡ Clears all collections immediately
- ⚡ Simple output

**Usage:**

```bash
# Quick clear (no prompts)
npm run db:clear:quick
# or
node scripts/quickClear.js
```

⚠️ **Warning:** This script clears ALL collections without confirmation. Use only in development!

## 🎯 Common Use Cases

### Development Reset
```bash
# Quick reset during development
npm run db:clear:quick
```

### Production-Safe Clear
```bash
# Clear all data but keep settings
npm run db:clear:except-settings
```

### Clear Specific Data
```bash
# Clear only user data
npm run db:clear:users

# Clear only transactions
npm run db:clear:transactions

# Clear only groups
npm run db:clear:groups
```

### Testing
```bash
# Clear before running tests
node scripts/clearDatabase.js --all --confirm
```

## 🔒 Safety Features

### clearDatabase.js Safety Features:
1. **Confirmation Prompts** - Requires explicit user confirmation
2. **Statistics Display** - Shows before/after document counts
3. **Selective Clearing** - Clear specific collections only
4. **Exclusion Support** - Preserve important collections
5. **Operation Summary** - Detailed report of what was deleted

### Environment Variables Required:
- `MONGO_URI` - MongoDB connection string (from .env file)

## 📊 Example Output

### Clear Database Script
```
╔════════════════════════════════════════════════════════════════╗
║  BEFORE - Database Statistics                                  ║
╠════════════════════════════════════════════════════════════════╣
║  Users                              1250 documents      ║
║  Groups                              342 documents      ║
║  Transactions                       5678 documents      ║
║  Wallets                            1250 documents      ║
║  ...                                                           ║
╠════════════════════════════════════════════════════════════════╣
║  TOTAL                              8520 documents      ║
╚════════════════════════════════════════════════════════════════╝

⚠️  This will clear ALL collections in the database
⚠️  THIS OPERATION CANNOT BE UNDONE!

Are you sure you want to proceed? (yes/no): yes

🚀 Starting database clear operation...

🗑️  Clearing users...
   ✅ Deleted 1250 documents
🗑️  Clearing groups...
   ✅ Deleted 342 documents
...

✅ Database clear operation completed successfully!
```

### Quick Clear Script
```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB
📊 Database: ajosave

🗑️  Clearing all collections...

   ✅ users                - 1250 documents deleted
   ✅ groups               - 342 documents deleted
   ✅ transactions         - 5678 documents deleted
   ...

✅ Total deleted: 8520 documents
🎉 Database cleared successfully!
```

## ⚠️ Important Notes

1. **Backup First**: Always backup your database before clearing in production
2. **Environment**: These scripts use the `MONGO_URI` from your `.env` file
3. **Irreversible**: Deleted data cannot be recovered
4. **Settings**: Consider using `--except=settings` to preserve system configuration
5. **Development Only**: Use `quickClear.js` only in development environments

## 🚨 Production Warning

**NEVER** run these scripts on production databases without:
1. ✅ Complete database backup
2. ✅ Team approval
3. ✅ Maintenance window scheduled
4. ✅ Recovery plan in place

## 🛠️ Troubleshooting

### Connection Issues
```bash
# Check your .env file has MONGO_URI
cat .env | grep MONGO_URI

# Test connection
node -e "require('dotenv').config(); console.log(process.env.MONGO_URI)"
```

### Permission Issues
```bash
# Ensure scripts are executable
chmod +x scripts/*.js
```

### Module Not Found
```bash
# Install dependencies
npm install
```

## 📝 Adding New Collections

When adding new collections to the application:

1. Add the model import in both scripts:
```javascript
const NewModel = require('../src/models/NewModel');
```

2. Add to collections object in `clearDatabase.js`:
```javascript
const collections = {
  // ... existing collections
  newcollection: 'newcollection'
};
```

3. Add to collections array in `quickClear.js`:
```javascript
const collections = [
  // ... existing collections
  'newcollection'
];
```

4. Update this README with the new collection name

## 🤝 Contributing

When modifying these scripts:
- Maintain backward compatibility
- Add appropriate error handling
- Update this README
- Test in development environment first
