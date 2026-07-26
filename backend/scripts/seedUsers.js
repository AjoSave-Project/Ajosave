/**
 * User Seed Script
 *
 * Seeds the database with initial user(s) for development/testing.
 *
 * Usage:
 *   node scripts/seedUsers.js             # Seed all users (upserts — safe to re-run)
 *   node scripts/seedUsers.js --list      # List seed users without inserting
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../src/models/Users');

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------
const SEED_USERS = [
  {
    firstName: 'Nelson',
    lastName: 'Seed',
    email: 'nelson@ajosave.com',
    phoneNumber: '+2349156219654',
    password: 'Nelson2025!',
    dateOfBirth: new Date('1990-01-15'), // 18+ years old
    address: '12 Ajo Street, Lagos Island, Lagos',
    bvn: '12345678901',
    nin: '98765432101',
    bvnVerified: true,
    ninVerified: true,
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true,
    role: 'user',
    registrationSource: 'web',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const listOnly = args.includes('--list');

async function connect() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error(
      'MongoDB URI not found. Ensure MONGO_URI is set in your .env file.'
    );
  }
  await mongoose.connect(mongoUri);
  console.log('✅  Connected to MongoDB');
}

async function disconnect() {
  await mongoose.connection.close();
  console.log('🔌  Disconnected from MongoDB');
}

async function seedUsers() {
  let created = 0;
  let skipped = 0;

  for (const data of SEED_USERS) {
    const existing = await User.findOne({ email: data.email });

    if (existing) {
      console.log(`⏭   User already exists — skipping: ${data.email}`);
      skipped++;
      continue;
    }

    // Create via model so pre-save hooks run (password hashing, referral code, etc.)
    const user = new User(data);
    await user.save();

    console.log(`✅  Created user: ${user.firstName} ${user.lastName} <${user.email}>`);
    created++;
  }

  console.log(`\n📊  Done — ${created} created, ${skipped} skipped.`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
(async () => {
  if (listOnly) {
    console.log('\n🌱  Seed users:\n');
    SEED_USERS.forEach((u) =>
      console.log(`  • ${u.firstName} ${u.lastName} <${u.email}>`)
    );
    console.log();
    process.exit(0);
  }

  try {
    await connect();
    await seedUsers();
    await disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
})();
