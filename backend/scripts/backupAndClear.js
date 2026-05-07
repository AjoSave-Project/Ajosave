/**
 * Backup and Clear Database Script
 * 
 * Creates a JSON backup of all collections before clearing them.
 * Useful for development when you want to preserve data.
 * 
 * Usage: node scripts/backupAndClear.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import all models
require('../src/models/Users');
require('../src/models/Groups');
require('../src/models/Transactions');
require('../src/models/Wallets');
require('../src/models/Admin');
require('../src/models/Alert');
require('../src/models/AuditLog');
require('../src/models/Lock');
require('../src/models/Messages');
require('../src/models/Settings');
require('../src/models/SupportTicket');

const collections = [
  'users',
  'groups',
  'transactions',
  'wallets',
  'admins',
  'alerts',
  'auditlogs',
  'locks',
  'messages',
  'settings',
  'supporttickets'
];

/**
 * Create backup directory if it doesn't exist
 */
function ensureBackupDir() {
  const backupDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
}

/**
 * Backup all collections to JSON files
 */
async function backupCollections(db) {
  const backupDir = ensureBackupDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `backup-${timestamp}`);
  
  fs.mkdirSync(backupPath, { recursive: true });
  
  console.log(`📦 Creating backup at: ${backupPath}\n`);
  
  const backupSummary = {
    timestamp: new Date().toISOString(),
    database: mongoose.connection.name,
    collections: {}
  };

  for (const collectionName of collections) {
    try {
      const documents = await db.collection(collectionName).find({}).toArray();
      const filePath = path.join(backupPath, `${collectionName}.json`);
      
      fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));
      
      console.log(`   ✅ ${collectionName.padEnd(20)} - ${documents.length} documents backed up`);
      backupSummary.collections[collectionName] = {
        count: documents.length,
        file: `${collectionName}.json`
      };
    } catch (error) {
      console.log(`   ⚠️  ${collectionName.padEnd(20)} - ${error.message}`);
      backupSummary.collections[collectionName] = {
        error: error.message
      };
    }
  }

  // Save backup summary
  const summaryPath = path.join(backupPath, 'backup-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(backupSummary, null, 2));
  
  console.log(`\n📄 Backup summary saved to: backup-summary.json`);
  
  return { backupPath, backupSummary };
}

/**
 * Clear all collections
 */
async function clearCollections(db) {
  console.log('\n🗑️  Clearing all collections...\n');
  
  let totalDeleted = 0;

  for (const collectionName of collections) {
    try {
      const result = await db.collection(collectionName).deleteMany({});
      console.log(`   ✅ ${collectionName.padEnd(20)} - ${result.deletedCount} documents deleted`);
      totalDeleted += result.deletedCount;
    } catch (error) {
      console.log(`   ⚠️  ${collectionName.padEnd(20)} - ${error.message}`);
    }
  }

  return totalDeleted;
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║           BACKUP AND CLEAR DATABASE SCRIPT                     ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('🔄 Connecting to MongoDB...');
    
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in environment variables');
    }

    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}\n`);

    const db = mongoose.connection.db;

    // Step 1: Backup
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('STEP 1: BACKING UP DATABASE');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    const { backupPath, backupSummary } = await backupCollections(db);
    
    const totalBackedUp = Object.values(backupSummary.collections)
      .reduce((sum, col) => sum + (col.count || 0), 0);
    
    console.log(`\n✅ Backup completed: ${totalBackedUp} documents backed up`);

    // Step 2: Clear
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('STEP 2: CLEARING DATABASE');
    console.log('═══════════════════════════════════════════════════════════════');
    
    const totalDeleted = await clearCollections(db);
    
    console.log(`\n✅ Clear completed: ${totalDeleted} documents deleted`);

    // Summary
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    OPERATION SUMMARY                           ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');
    console.log(`║  Backup Location: ${path.basename(backupPath).padEnd(42)} ║`);
    console.log(`║  Documents Backed Up: ${totalBackedUp.toString().padStart(39)} ║`);
    console.log(`║  Documents Deleted: ${totalDeleted.toString().padStart(41)} ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('🎉 Backup and clear operation completed successfully!\n');
    console.log(`💾 To restore from backup, use the files in:`);
    console.log(`   ${backupPath}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('🔌 Connection closed\n');
    }
  }
}

main();
