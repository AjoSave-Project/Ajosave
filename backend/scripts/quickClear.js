/**
 * Quick Clear Database Script
 * 
 * A simplified version that clears all collections immediately
 * without prompts. Use for development only!
 * 
 * Usage: node scripts/quickClear.js
 */

const mongoose = require('mongoose');
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

async function quickClear() {
  try {
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

    console.log('🗑️  Clearing all collections...\n');
    
    let totalDeleted = 0;
    const db = mongoose.connection.db;

    for (const collectionName of collections) {
      try {
        const result = await db.collection(collectionName).deleteMany({});
        console.log(`   ✅ ${collectionName.padEnd(20)} - ${result.deletedCount} documents deleted`);
        totalDeleted += result.deletedCount;
      } catch (error) {
        console.log(`   ⚠️  ${collectionName.padEnd(20)} - ${error.message}`);
      }
    }

    console.log(`\n✅ Total deleted: ${totalDeleted} documents`);
    console.log('🎉 Database cleared successfully!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('🔌 Connection closed\n');
    }
  }
}

quickClear();
