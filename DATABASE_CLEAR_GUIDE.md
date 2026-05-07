# AjoSave Database Clear Scripts - Complete Guide

## 📦 What's Been Created

I've created a comprehensive set of database clearing scripts for your AjoSave MongoDB database:

### Scripts Created:
1. **`clearDatabase.js`** - Full-featured script with safety controls
2. **`quickClear.js`** - Fast, no-prompt script for development
3. **`backupAndClear.js`** - Creates backup before clearing
4. **Documentation** - Complete README and quick reference

## 🚀 Quick Start

### For Development (Fastest)
```bash
cd backend
npm run db:clear:quick
```

### For Production (Safest)
```bash
cd backend
npm run db:clear
# Follow the prompts
```

### With Backup (Recommended)
```bash
cd backend
npm run db:clear:backup
```

## 📋 All Available Commands

```bash
# Clear all collections (with confirmation)
npm run db:clear

# Quick clear (no prompts - development only)
npm run db:clear:quick

# Backup then clear
npm run db:clear:backup

# Clear specific collections
npm run db:clear:users
npm run db:clear:groups
npm run db:clear:transactions

# Clear all except settings
npm run db:clear:except-settings
```

## 🎯 Script Features

### 1. clearDatabase.js (Safe & Controlled)
- ✅ Interactive confirmation prompts
- ✅ Before/After statistics display
- ✅ Clear all or specific collections
- ✅ Exclude specific collections
- ✅ Detailed operation summary
- ✅ Help documentation (`--help`)

**Example Usage:**
```bash
# Show help
node scripts/clearDatabase.js --help

# Clear all with confirmation
node scripts/clearDatabase.js --all

# Clear specific collection
node scripts/clearDatabase.js --collection=users

# Clear all except settings
node scripts/clearDatabase.js --all --except=settings

# Skip confirmation (dangerous!)
node scripts/clearDatabase.js --all --confirm
```

### 2. quickClear.js (Fast & Simple)
- ⚡ No confirmation prompts
- ⚡ Clears all collections immediately
- ⚡ Simple, clean output
- ⚠️ Development only!

**Example Usage:**
```bash
npm run db:clear:quick
```

### 3. backupAndClear.js (Safe with Backup)
- 💾 Creates JSON backup of all collections
- 💾 Timestamped backup folders
- 💾 Backup summary file
- 🗑️ Then clears all collections

**Example Usage:**
```bash
npm run db:clear:backup
```

Backups are saved to: `backend/scripts/backups/backup-[timestamp]/`

## 📊 Collections Managed

All scripts handle these collections:
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

## 🔒 Safety Features

### Built-in Safety:
1. **Confirmation Prompts** - clearDatabase.js requires explicit confirmation
2. **Statistics Display** - See what will be deleted before proceeding
3. **Selective Clearing** - Clear only what you need
4. **Exclusion Support** - Preserve important collections (like settings)
5. **Backup Option** - backupAndClear.js creates JSON backups
6. **Environment Isolation** - Uses MONGO_URI from .env file

### Best Practices:
- ✅ Always backup production data externally
- ✅ Test in development first
- ✅ Use `--except=settings` to preserve configuration
- ✅ Document why you're clearing data
- ✅ Verify connection string before running
- ❌ Never use quickClear.js in production

## 📖 Example Outputs

### clearDatabase.js Output:
```
╔════════════════════════════════════════════════════════════════╗
║  BEFORE - Database Statistics                                  ║
╠════════════════════════════════════════════════════════════════╣
║  Users                              1250 documents      ║
║  Groups                              342 documents      ║
║  Transactions                       5678 documents      ║
║  TOTAL                              8520 documents      ║
╚════════════════════════════════════════════════════════════════╝

⚠️  This will clear ALL collections in the database
⚠️  THIS OPERATION CANNOT BE UNDONE!

Are you sure you want to proceed? (yes/no): yes

🚀 Starting database clear operation...
✅ Database clear operation completed successfully!
```

### quickClear.js Output:
```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB

🗑️  Clearing all collections...
   ✅ users                - 1250 documents deleted
   ✅ groups               - 342 documents deleted
   
✅ Total deleted: 8520 documents
🎉 Database cleared successfully!
```

### backupAndClear.js Output:
```
╔════════════════════════════════════════════════════════════════╗
║           BACKUP AND CLEAR DATABASE SCRIPT                     ║
╚════════════════════════════════════════════════════════════════╝

STEP 1: BACKING UP DATABASE
📦 Creating backup at: backups/backup-2026-05-07T10-30-45-123Z
   ✅ users                - 1250 documents backed up

STEP 2: CLEARING DATABASE
🗑️  Clearing all collections...
   ✅ users                - 1250 documents deleted

╔════════════════════════════════════════════════════════════════╗
║                    OPERATION SUMMARY                           ║
╠════════════════════════════════════════════════════════════════╣
║  Backup Location: backup-2026-05-07T10-30-45-123Z              ║
║  Documents Backed Up:                                     8520 ║
║  Documents Deleted:                                       8520 ║
╚════════════════════════════════════════════════════════════════╝
```

## 🛠️ Troubleshooting

### "MONGO_URI not found"
```bash
# Check your .env file
cat backend/.env | grep MONGO_URI

# Make sure you're in the backend directory
cd backend
```

### "Connection failed"
```bash
# Verify MongoDB URI is correct
# Check if MongoDB Atlas is accessible
# Verify network connection
```

### "Module not found"
```bash
# Install dependencies
cd backend
npm install
```

## 📁 File Structure

```
backend/
├── scripts/
│   ├── clearDatabase.js       # Main clearing script
│   ├── quickClear.js          # Fast clear script
│   ├── backupAndClear.js      # Backup + clear script
│   ├── backups/               # Backup storage (gitignored)
│   ├── README.md              # Full documentation
│   ├── QUICK_REFERENCE.md     # Quick command reference
│   └── .gitignore             # Ignore backups
├── package.json               # Updated with npm scripts
└── .env                       # Contains MONGO_URI
```

## 🔄 Workflow Examples

### Daily Development Reset:
```bash
npm run db:clear:quick
```

### Before Major Testing:
```bash
npm run db:clear:backup
# Run your tests
# If needed, restore from backups/
```

### Production Maintenance:
```bash
# 1. Create external backup first!
# 2. Then run:
npm run db:clear:except-settings
```

### Clear Specific Data:
```bash
# Clear only user data
npm run db:clear:users

# Clear only transactions
npm run db:clear:transactions
```

## 📚 Additional Resources

- **Full Documentation**: `backend/scripts/README.md`
- **Quick Reference**: `backend/scripts/QUICK_REFERENCE.md`
- **Backup Location**: `backend/scripts/backups/`

## ⚠️ Important Warnings

1. **Irreversible Operation**: Deleted data cannot be recovered (unless backed up)
2. **Production Use**: Always create external backups before clearing production data
3. **Settings Preservation**: Consider using `--except=settings` to keep configuration
4. **Quick Clear**: Never use `quickClear.js` in production environments
5. **Verification**: Always verify you're connected to the correct database

## 🎉 Summary

You now have three powerful scripts for managing your database:

1. **clearDatabase.js** - For controlled, safe clearing with confirmations
2. **quickClear.js** - For fast development resets
3. **backupAndClear.js** - For clearing with automatic backups

All scripts are accessible via convenient npm commands and include comprehensive error handling and user feedback.

---

**Need help?** Check the full documentation in `backend/scripts/README.md`
