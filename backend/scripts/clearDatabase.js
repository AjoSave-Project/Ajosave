/**
 * Clear Database Script
 * 
 * This script provides utilities to clear all or specific collections
 * from the MongoDB database. Use with caution in production!
 * 
 * Usage:
 *   node scripts/clearDatabase.js --all              # Clear all collections
 *   node scripts/clearDatabase.js --collection users # Clear specific collection
 *   node scripts/clearDatabase.js --except settings  # Clear all except specified
 *   node scripts/clearDatabase.js --confirm          # Skip confirmation prompt
 */

const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

// Import all models to ensure they're registered
const User = require('../src/models/Users');
const Group = require('../src/models/Groups');
const Transaction = require('../src/models/Transactions');
const Wallet = require('../src/models/Wallets');
const Admin = require('../src/models/Admin');
const Alert = require('../src/models/Alert');
const AuditLog = require('../src/models/AuditLog');
const Lock = require('../src/models/Lock');
const Message = require('../src/models/Messages');
const Settings = require('../src/models/Settings');
const SupportTicket = require('../src/models/SupportTicket');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  all: args.includes('--all'),
  collection: args.find(arg => arg.startsWith('--collection='))?.split('=')[1],
  except: args.find(arg => arg.startsWith('--except='))?.split('=')[1],
  confirm: args.includes('--confirm'),
  help: args.includes('--help') || args.includes('-h')
};

// Collection mapping
const collections = {
  users: 'users',
  groups: 'groups',
  transactions: 'transactions',
  wallets: 'wallets',
  admins: 'admins',
  alerts: 'alerts',
  auditlogs: 'auditlogs',
  locks: 'locks',
  messages: 'messages',
  settings: 'settings',
  supporttickets: 'supporttickets'
};

/**
 * Display help information
 */
function showHelp() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║              DATABASE CLEAR SCRIPT - HELP                      ║
╚════════════════════════════════════════════════════════════════╝

Usage:
  node scripts/clearDatabase.js [options]

Options:
  --all                    Clear all collections
  --collection=<name>      Clear specific collection
  --except=<name>          Clear all collections except specified
  --confirm                Skip confirmation prompt (use with caution!)
  --help, -h               Show this help message

Examples:
  # Clear all collections (with confirmation)
  node scripts/clearDatabase.js --all

  # Clear only users collection
  node scripts/clearDatabase.js --collection=users

  # Clear all except settings
  node scripts/clearDatabase.js --all --except=settings

  # Clear all without confirmation (dangerous!)
  node scripts/clearDatabase.js --all --confirm

Available Collections:
  ${Object.keys(collections).join(', ')}

⚠️  WARNING: This operation cannot be undone!
    Always backup your data before clearing collections.
  `);
}

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in environment variables');
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}\n`);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

/**
 * Get user confirmation
 */
async function getUserConfirmation(message) {
  if (options.confirm) {
    return true;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Get collection statistics
 */
async function getCollectionStats() {
  const stats = {};
  const db = mongoose.connection.db;
  
  for (const [name, collectionName] of Object.entries(collections)) {
    try {
      const count = await db.collection(collectionName).countDocuments();
      stats[name] = count;
    } catch (error) {
      stats[name] = 0;
    }
  }
  
  return stats;
}

/**
 * Display collection statistics
 */
function displayStats(stats, title = 'Current Database Statistics') {
  console.log(`\n╔════════════════════════════════════════════════════════════════╗`);
  console.log(`║  ${title.padEnd(60)} ║`);
  console.log(`╠════════════════════════════════════════════════════════════════╣`);
  
  let totalDocs = 0;
  for (const [name, count] of Object.entries(stats)) {
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    const countStr = count.toString().padStart(8);
    console.log(`║  ${displayName.padEnd(30)} ${countStr} documents      ║`);
    totalDocs += count;
  }
  
  console.log(`╠════════════════════════════════════════════════════════════════╣`);
  console.log(`║  ${'TOTAL'.padEnd(30)} ${totalDocs.toString().padStart(8)} documents      ║`);
  console.log(`╚════════════════════════════════════════════════════════════════╝\n`);
}

/**
 * Clear specific collection
 */
async function clearCollection(collectionName) {
  try {
    const db = mongoose.connection.db;
    const result = await db.collection(collectionName).deleteMany({});
    return result.deletedCount;
  } catch (error) {
    console.error(`❌ Error clearing ${collectionName}:`, error.message);
    return 0;
  }
}

/**
 * Clear all collections
 */
async function clearAllCollections(exceptCollection = null) {
  const results = {};
  
  for (const [name, collectionName] of Object.entries(collections)) {
    if (exceptCollection && name === exceptCollection) {
      console.log(`⏭️  Skipping ${name} (excluded)`);
      results[name] = 'skipped';
      continue;
    }
    
    console.log(`🗑️  Clearing ${name}...`);
    const deletedCount = await clearCollection(collectionName);
    results[name] = deletedCount;
    console.log(`   ✅ Deleted ${deletedCount} documents`);
  }
  
  return results;
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Show help if requested
    if (options.help) {
      showHelp();
      process.exit(0);
    }

    // Validate options
    if (!options.all && !options.collection) {
      console.error('❌ Error: Please specify --all or --collection=<name>');
      console.log('   Use --help for more information\n');
      process.exit(1);
    }

    // Connect to database
    await connectDB();

    // Get and display current statistics
    const beforeStats = await getCollectionStats();
    displayStats(beforeStats, 'BEFORE - Database Statistics');

    // Determine what to clear
    let confirmMessage = '';
    if (options.all) {
      if (options.except) {
        confirmMessage = `⚠️  This will clear ALL collections EXCEPT '${options.except}'`;
      } else {
        confirmMessage = '⚠️  This will clear ALL collections in the database';
      }
    } else if (options.collection) {
      if (!collections[options.collection]) {
        console.error(`❌ Error: Unknown collection '${options.collection}'`);
        console.log(`   Available collections: ${Object.keys(collections).join(', ')}\n`);
        process.exit(1);
      }
      confirmMessage = `⚠️  This will clear the '${options.collection}' collection`;
    }

    // Get confirmation
    console.log(`\n${confirmMessage}`);
    console.log('⚠️  THIS OPERATION CANNOT BE UNDONE!\n');
    
    const confirmed = await getUserConfirmation('Are you sure you want to proceed?');
    
    if (!confirmed) {
      console.log('\n❌ Operation cancelled by user\n');
      process.exit(0);
    }

    console.log('\n🚀 Starting database clear operation...\n');

    // Perform clear operation
    let results;
    if (options.all) {
      results = await clearAllCollections(options.except);
    } else if (options.collection) {
      const collectionName = collections[options.collection];
      const deletedCount = await clearCollection(collectionName);
      results = { [options.collection]: deletedCount };
      console.log(`✅ Deleted ${deletedCount} documents from ${options.collection}`);
    }

    // Get and display final statistics
    const afterStats = await getCollectionStats();
    displayStats(afterStats, 'AFTER - Database Statistics');

    // Display summary
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    OPERATION SUMMARY                           ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');
    
    let totalDeleted = 0;
    for (const [name, count] of Object.entries(results)) {
      if (count === 'skipped') {
        console.log(`║  ${name.padEnd(30)} SKIPPED                      ║`);
      } else {
        console.log(`║  ${name.padEnd(30)} ${count.toString().padStart(8)} deleted       ║`);
        totalDeleted += count;
      }
    }
    
    console.log('╠════════════════════════════════════════════════════════════════╣');
    console.log(`║  ${'TOTAL DELETED'.padEnd(30)} ${totalDeleted.toString().padStart(8)} documents      ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('✅ Database clear operation completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error during database clear operation:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Close database connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed\n');
    }
  }
}

// Run the script
main();
