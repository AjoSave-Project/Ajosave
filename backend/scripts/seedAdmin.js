/**
 * Admin User Seed Script
 *
 * Seeds the database with admin user(s) for development/testing.
 *
 * Usage:
 *   node scripts/seedAdmin.js             # Seed admin users (upserts — safe to re-run)
 *   node scripts/seedAdmin.js --list      # List seed admin users without inserting
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../src/models/Users');

// ---------------------------------------------------------------------------
// Seed data - Admin Users
// ---------------------------------------------------------------------------
const SEED_ADMINS = [
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@ajosave.com',
    phoneNumber: '+2349000000001',
    password: 'Admin2025!',
    dateOfBirth: new Date('1985-01-01'), // 18+ years old
    address: '1 Admin Street, Victoria Island, Lagos',
    bvn: '11111111111',
    nin: '11111111111',
    bvnVerified: true,
    ninVerified: true,
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isFaceVerified: true,
    isActive: true,
    role: 'admin', // Super admin with full access
    registrationSource: 'web',
  },
  {
    firstName: 'Moderator',
    lastName: 'User',
    email: 'moderator@ajosave.com',
    phoneNumber: '+2349000000002',
    password: 'Moderator2025!',
    dateOfBirth: new Date('1988-05-15'),
    address: '2 Moderator Lane, Ikoyi, Lagos',
    bvn: '22222222222',
    nin: '22222222222',
    bvnVerified: true,
    ninVerified: true,
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isFaceVerified: true,
    isActive: true,
    role: 'moderator', // Moderator with limited access
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

async function seedAdmins() {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const data of SEED_ADMINS) {
    const existing = await User.findOne({ email: data.email });

    if (existing) {
      // Update role if it's different
      if (existing.role !== data.role) {
        existing.role = data.role;
        await existing.save();
        console.log(`✅  Updated role for: ${data.email} → ${data.role}`);
        updated++;
      } else {
        console.log(`⏭   Admin already exists with correct role — skipping: ${data.email}`);
        skipped++;
      }
      continue;
    }

    // Create via model so pre-save hooks run (password hashing, etc.)
    const user = new User(data);
    await user.save();

    console.log(`✅  Created admin: ${user.firstName} ${user.lastName} <${user.email}> [${user.role}]`);
    created++;
  }

  console.log(`\n📊  Done — ${created} created, ${updated} updated, ${skipped} skipped.`);
  console.log('\n🔐  Admin Credentials:');
  SEED_ADMINS.forEach((admin) => {
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${admin.password}`);
    console.log(`   Role: ${admin.role}`);
    console.log('');
  });
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
(async () => {
  if (listOnly) {
    console.log('\n🌱  Seed admin users:\n');
    SEED_ADMINS.forEach((u) =>
      console.log(`  • ${u.firstName} ${u.lastName} <${u.email}> [${u.role}]`)
    );
    console.log();
    process.exit(0);
  }

  try {
    await connect();
    await seedAdmins();
    await disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
})();
