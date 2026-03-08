const Lock = require('../models/Lock');
const Wallet = require('../models/Wallets');
const Transaction = require('../models/Transactions');
const { asyncErrorHandler, ValidationError, NotFoundError, AppError } = require('../middlewares/errorHandler');

/**
 * Create a wallet lock
 * @route POST /api/wallets/locks
 */
const createLock = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { amount, label, releaseType, releaseDate } = req.body;

  if (!amount || amount <= 0) throw new ValidationError('Amount must be positive');
  if (!releaseType || !['date', 'manual'].includes(releaseType)) {
    throw new ValidationError('releaseType must be "date" or "manual"');
  }
  if (releaseType === 'date' && !releaseDate) {
    throw new ValidationError('releaseDate is required for date-based locks');
  }

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw new NotFoundError('Wallet not found');

  if (wallet.availableBalance < Number(amount)) {
    throw new ValidationError(`Insufficient balance. Available: ₦${wallet.availableBalance.toLocaleString()}`);
  }

  // Atomically move funds
  try {
    await wallet.lockFunds(Number(amount));
  } catch (fundErr) {
    console.error('❌ lockFunds error:', fundErr.message, fundErr.errors || '');
    throw fundErr;
  }

  let lock;
  try {
    lock = new Lock({
      userId,
      amount: Number(amount),
      label: label || undefined,
      releaseType,
      releaseDate: releaseType === 'date' ? new Date(releaseDate) : undefined,
      status: 'active'
    });
    await lock.save();
  } catch (lockErr) {
    console.error('❌ Lock save error:', lockErr.message, JSON.stringify(lockErr.errors || {}));
    // Rollback wallet funds
    try { await wallet.unlockFunds(Number(amount)); } catch (rollbackErr) {
      console.error('❌ Rollback failed:', rollbackErr.message);
    }
    throw lockErr;
  }

  try {
    const transaction = new Transaction({
      userId,
      transactionId: Transaction.generateTransactionId(),
      type: 'lock',
      amount: Number(amount),
      status: 'completed',
      description: label ? `Locked: ${label}` : 'Funds locked',
      paymentMethod: 'wallet',
      completedAt: new Date()
    });
    await transaction.save();
  } catch (txErr) {
    console.error('❌ Lock transaction save error:', txErr.message, txErr.errors || '');
    // Don't fail the lock itself — funds are already moved
  }

  res.status(201).json({
    success: true,
    message: 'Funds locked successfully',
    data: {
      lock,
      wallet: { availableBalance: wallet.availableBalance, lockedBalance: wallet.lockedBalance }
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * Get user's active locks
 * @route GET /api/wallets/locks
 */
const getLocks = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const locks = await Lock.find({ userId, status: 'active' }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Locks retrieved successfully',
    data: { locks },
    timestamp: new Date().toISOString()
  });
});

/**
 * Manually unlock a lock
 * @route POST /api/wallets/locks/:lockId/unlock
 */
const unlock = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { lockId } = req.params;

  const lock = await Lock.findOne({ _id: lockId, userId, status: 'active' });
  if (!lock) throw new NotFoundError('Lock not found or already released');

  if (lock.releaseType === 'date' && lock.releaseDate > new Date()) {
    const releaseStr = lock.releaseDate.toLocaleDateString();
    const err = new Error(`This lock cannot be released until ${releaseStr}`);
    err.statusCode = 403;
    err.isOperational = true;
    throw err;
  }

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw new NotFoundError('Wallet not found');

  await wallet.unlockFunds(lock.amount);

  lock.status = 'released';
  lock.releasedAt = new Date();
  await lock.save();

  try {
    const transaction = new Transaction({
      userId,
      transactionId: Transaction.generateTransactionId(),
      type: 'unlock',
      amount: lock.amount,
      status: 'completed',
      description: lock.label ? `Unlocked: ${lock.label}` : 'Funds unlocked',
      paymentMethod: 'wallet',
      completedAt: new Date()
    });
    await transaction.save();
  } catch (txErr) {
    console.error('❌ Unlock transaction save error:', txErr.message, txErr.errors || '');
  }

  res.status(200).json({
    success: true,
    message: 'Funds unlocked successfully',
    data: {
      lock,
      wallet: { availableBalance: wallet.availableBalance, lockedBalance: wallet.lockedBalance }
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = { createLock, getLocks, unlock };
