// src/config/db.js

/**
 * Database Connection Configuration
 * 
 * This module handles the connection to MongoDB Atlas with proper error
 * handling, retry logic, and connection monitoring.
 */

const mongoose = require('mongoose');
const config = require('./config');

/**
 * Connection State Tracking
 * 
 * Keep track of connection state to avoid multiple connection attempts
 * and provide better error handling.
 */
let isConnected = false;

/**
 * MongoDB Connection Events
 * 
 * Set up event listeners for MongoDB connection events to monitor
 * connection health and handle disconnections gracefully.
 */
const setupConnectionEvents = () => {
  // Connection successful
  mongoose.connection.on('connected', () => {
    console.log('🔗 MongoDB connected successfully');
    isConnected = true;
  });
  
  // Connection error
  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error.message);
    isConnected = false;
  });
  
  // Connection disconnected
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
    isConnected = false;
  });
  
  // Connection reconnected
  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
    isConnected = true;
  });
  
  // Application termination
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed due to application termination');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error.message);
      process.exit(1);
    }
  });
};

/**
 * Connect to MongoDB Database
 * 
 * Establishes connection to MongoDB Atlas with retry logic and
 * comprehensive error handling.
 * 
 * @param {number} retryCount - Current retry attempt (for internal use)
 * @returns {Promise<void>} Promise that resolves when connected
 * @throws {Error} If connection fails after all retry attempts
 */
const connectDB = async (retryCount = 0) => {
  const maxRetries = 3;
  const retryDelay = 5000; // 5 seconds
  
  try {
    // Check if already connected
    if (isConnected && mongoose.connection.readyState === 1) {
      console.log('📋 Database already connected');
      return;
    }
    
    console.log(`🔄 Attempting to connect to MongoDB Atlas... (Attempt ${retryCount + 1}/${maxRetries + 1})`);
    
    // Set up connection events (only once)
    if (retryCount === 0) {
      setupConnectionEvents();
    }
    
    // Connect to MongoDB with configuration options
    await mongoose.connect(config.database.mongoUri, {
      // Modern connection options (compatible with latest Mongoose versions)
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2,  // Minimum number of connections in the pool
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      serverSelectionTimeoutMS: 10000, // How long to try selecting a server
      socketTimeoutMS: 45000, // How long to wait for a response
      heartbeatFrequencyMS: 10000, // How often to check server status
    });
    
    // Verify connection
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      console.log('✅ MongoDB Atlas connected successfully');
      console.log(`📊 Database: ${mongoose.connection.name}`);
      console.log(`🌐 Host: ${mongoose.connection.host}`);
      console.log(`🔢 Port: ${mongoose.connection.port}`);
      
      // Test the connection with a simple operation
      await testConnection();
    } else {
      throw new Error('Connection established but not ready');
    }
    
  } catch (error) {
    console.error(`❌ MongoDB connection failed (Attempt ${retryCount + 1}):`, error.message);
    
    // Retry logic
    if (retryCount < maxRetries) {
      console.log(`⏱️  Retrying in ${retryDelay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return connectDB(retryCount + 1);
    } else {
      // All retry attempts failed
      console.error('💥 All connection attempts failed.');
      throw new Error(`Failed to connect to MongoDB after ${maxRetries + 1} attempts: ${error.message}`);
    }
  }
};

/**
 * Test Database Connection
 * 
 * Performs a simple database operation to verify the connection is working.
 * This helps catch issues that might not be apparent from just connecting.
 * 
 * @returns {Promise<void>} Promise that resolves if test passes
 * @throws {Error} If database test fails
 */
const testConnection = async () => {
  try {
    // Perform a simple operation to test the connection
    await mongoose.connection.db.admin().ping();
    console.log('🏓 Database connection test passed');
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    throw new Error('Database connection test failed');
  }
};

/**
 * Get Connection Status
 * 
 * Returns the current database connection status with detailed information.
 * Useful for health checks and monitoring.
 * 
 * @returns {Object} Connection status information
 */
const getConnectionStatus = () => {
  const readyStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    readyStateText: readyStates[mongoose.connection.readyState],
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
    collections: Object.keys(mongoose.connection.collections),
    connectionUptime: isConnected ? Date.now() - mongoose.connection._readyState : 0
  };
};

/**
 * Disconnect from Database
 * 
 * Gracefully closes the database connection. Useful for testing
 * and application shutdown.
 * 
 * @returns {Promise<void>} Promise that resolves when disconnected
 */
const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      isConnected = false;
      console.log('✅ MongoDB connection closed successfully');
    }
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error.message);
    throw error;
  }
};

/**
 * Database Health Check
 * 
 * Comprehensive health check for the database connection.
 * Returns detailed information about database status.
 * 
 * @returns {Promise<Object>} Database health information
 */
const healthCheck = async () => {
  try {
    const status = getConnectionStatus();
    
    if (!isConnected || mongoose.connection.readyState !== 1) {
      return {
        status: 'unhealthy',
        message: 'Database not connected',
        details: status
      };
    }
    
    // Test database responsiveness
    const startTime = Date.now();
    await mongoose.connection.db.admin().ping();
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      message: 'Database is responsive',
      responseTime: `${responseTime}ms`,
      details: status
    };
    
  } catch (error) {
    return {
      status: 'unhealthy',
      message: 'Database health check failed',
      error: error.message,
      details: getConnectionStatus()
    };
  }
};

// Export database utilities
module.exports = {
  connectDB,
  disconnectDB,
  getConnectionStatus,
  healthCheck,
  testConnection
};