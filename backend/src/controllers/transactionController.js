// backend/src/controllers/transactionController.js - UPDATED

const Transaction = require('../models/Transactions');
const Wallet = require('../models/Wallets');
const Group = require('../models/Groups');
const mongoose = require('mongoose');
const { asyncErrorHandler, ValidationError, NotFoundError } = require('../middlewares/errorHandler');

/**
 * Get Transactions Handler
 * 
 * @route   GET /api/transactions
 * @desc    Get user's transactions with optional filters
 * @access  Private
 */
const getTransactions = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { type, groupId, status, limit = 50, skip = 0 } = req.query;

  console.log(`📊 Getting transactions for user: ${userId}`);

  try {
    // Build query
    const query = { userId };
    
    if (type) query.type = type;
    if (groupId) query.groupId = groupId;
    if (status) query.status = status;

    // Fetch transactions
    const transactions = await Transaction.find(query)
      .populate('groupId', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Transaction.countDocuments(query);

    console.log(`✅ Found ${transactions.length} transactions`);

    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        transactions,
        count: transactions.length,
        total,
        hasMore: total > (parseInt(skip) + transactions.length)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`❌ Failed to get transactions:`, error.message);
    throw error;
  }
});

/**
 * Create Contribution Transaction Handler
 * 
 * @route   POST /api/transactions/contribution
 * @desc    Process a contribution payment (after Paystack verification)
 * @access  Private
 */
const createContribution = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { groupId, reference, amount } = req.body;

  console.log(`💰 Processing contribution:`, { userId, groupId, amount, reference });

  try {
    // 1. Verify group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      throw new NotFoundError('Group not found');
    }

    if (!group.members.includes(userId)) {
      throw new ValidationError('You are not a member of this group');
    }

    // 2. Verify amount matches group contribution (use tolerance for float comparison)
    if (Math.abs(Number(amount) - group.contributionAmount) > 0.01) {
      throw new ValidationError(`Amount does not match group contribution amount. Expected: ${group.contributionAmount}, Got: ${amount}`);
    }

    // 3. Check for duplicate transaction (same reference)
    const existingTxn = await Transaction.findOne({ 
      'metadata.paystack_reference': reference 
    });
    
    if (existingTxn) {
      console.warn('⚠️ Duplicate transaction detected:', reference);
      return res.status(200).json({
        success: true,
        message: 'Transaction already processed',
        data: {
          transaction: existingTxn
        }
      });
    }

    // 4. Get user's wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      console.log('💰 Creating wallet for user:', userId);
      wallet = new Wallet({
        userId,
        totalBalance: 0,
        availableBalance: 0,
        lockedBalance: 0
      });
      await wallet.save();
    }

    // 5. Generate unique transaction ID
    const transactionId = Transaction.generateTransactionId();

    // 6. Create transaction record
    const transaction = new Transaction({
      userId,
      groupId,
      transactionId,
      type: 'contribution',
      amount,
      status: 'completed',
      description: `Contribution to ${group.name}`,
      paymentMethod: 'card',
      metadata: {
        paystack_reference: reference,
        group_name: group.name,
        frequency: group.frequency
      },
      completedAt: new Date()
    });

    await transaction.save();
    console.log('✅ Transaction created:', transactionId);

    // 7. Update wallet
    wallet.totalContributions += amount;
    await wallet.save();
    console.log('✅ Wallet updated - Total contributions:', wallet.totalContributions);

    // 8. Update group pool
    group.totalPool += amount;
    
    // 9. Update member's contribution count in membersList
    const memberIndex = group.membersList.findIndex(
      m => m.userId.toString() === userId.toString()
    );
    
    if (memberIndex !== -1) {
      group.membersList[memberIndex].contributionsMade += 1;
      console.log(`✅ Member contribution count updated: ${group.membersList[memberIndex].contributionsMade}`);
    }

    await group.save();
    console.log('✅ Group updated - Total pool:', group.totalPool);

    // 10. Return success response
    res.status(201).json({
      success: true,
      message: 'Contribution processed successfully',
      data: {
        transaction,
        wallet: {
          totalContributions: wallet.totalContributions,
          availableBalance: wallet.availableBalance
        },
        group: {
          totalPool: group.totalPool,
          name: group.name
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Contribution processing failed:`, error.message);
    throw error;
  }
});

/**
 * Get Transaction by ID Handler
 * 
 * @route   GET /api/transactions/:id
 * @desc    Get a specific transaction by ID
 * @access  Private
 */
const getTransactionById = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const transactionId = req.params.id;

  console.log(`🔍 Getting transaction ${transactionId} for user: ${userId}`);

  try {
    const transaction = await Transaction.findById(transactionId)
      .populate('groupId', 'name contributionAmount frequency')
      .populate('userId', 'firstName lastName email');

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    // Verify user owns this transaction
    if (transaction.userId._id.toString() !== userId.toString()) {
      throw new ValidationError('Access denied to this transaction');
    }

    console.log('✅ Transaction found:', transaction.transactionId);

    res.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: {
        transaction
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to get transaction:`, error.message);
    throw error;
  }
});

/**
 * Get Transaction Statistics Handler
 * 
 * @route   GET /api/transactions/stats
 * @desc    Get user's transaction statistics
 * @access  Private
 */
const getTransactionStats = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  console.log(`📊 Getting transaction stats for user: ${userId}`);

  try {
    // Aggregate statistics
    const stats = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format stats
    const formattedStats = {
      contributions: {
        total: 0,
        count: 0
      },
      payouts: {
        total: 0,
        count: 0
      },
      withdrawals: {
        total: 0,
        count: 0
      }
    };

    stats.forEach(stat => {
      if (stat._id === 'contribution') {
        formattedStats.contributions = {
          total: stat.total,
          count: stat.count
        };
      } else if (stat._id === 'payout') {
        formattedStats.payouts = {
          total: stat.total,
          count: stat.count
        };
      } else if (stat._id === 'withdrawal') {
        formattedStats.withdrawals = {
          total: stat.total,
          count: stat.count
        };
      }
    });

    console.log('✅ Transaction stats calculated');

    res.status(200).json({
      success: true,
      message: 'Transaction statistics retrieved successfully',
      data: {
        stats: formattedStats
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to get transaction stats:`, error.message);
    throw error;
  }
});

/**
 * Create Wallet Contribution Handler
 *
 * @route   POST /api/transactions/contribution/wallet
 * @desc    Pay group contribution directly from wallet balance
 * @access  Private
 */
const createWalletContribution = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { groupId, amount } = req.body;

  console.log(`💰 Wallet contribution:`, { userId, groupId, amount });

  const group = await Group.findById(groupId);
  if (!group) throw new NotFoundError('Group not found');

  if (!group.members.some(m => m.toString() === userId.toString())) {
    throw new ValidationError('You are not a member of this group');
  }

  if (Math.abs(Number(amount) - group.contributionAmount) > 0.01) {
    throw new ValidationError(`Amount does not match group contribution. Expected: ${group.contributionAmount}`);
  }

  let wallet = await Wallet.findOne({ userId });
  if (!wallet) throw new NotFoundError('Wallet not found');

  if (wallet.availableBalance < amount) {
    throw new ValidationError(`Insufficient wallet balance. Available: ₦${wallet.availableBalance.toLocaleString()}`);
  }

  // Deduct from wallet
  wallet.availableBalance -= Number(amount);
  wallet.totalContributions += Number(amount);
  await wallet.save();

  // Record transaction
  const transaction = new Transaction({
    userId,
    groupId,
    transactionId: Transaction.generateTransactionId(),
    type: 'contribution',
    amount: Number(amount),
    status: 'completed',
    description: `Contribution to ${group.name}`,
    paymentMethod: 'wallet',
    metadata: { group_name: group.name, frequency: group.frequency },
    completedAt: new Date()
  });
  await transaction.save();

  // Update group pool and member contribution count
  group.totalPool += Number(amount);
  const memberIndex = group.membersList?.findIndex(
    m => m.userId.toString() === userId.toString()
  );
  if (memberIndex !== undefined && memberIndex !== -1) {
    group.membersList[memberIndex].contributionsMade += 1;
  }
  await group.save();

  console.log(`✅ Wallet contribution processed: ${transaction.transactionId}`);

  res.status(201).json({
    success: true,
    message: 'Contribution processed successfully',
    data: {
      transaction,
      wallet: {
        availableBalance: wallet.availableBalance,
        totalContributions: wallet.totalContributions
      },
      group: { totalPool: group.totalPool, name: group.name }
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * Export transactions as CSV
 *
 * @route   GET /api/transactions/export
 * @access  Private
 */
const exportCSV = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  const transactions = await Transaction.find({ userId })
    .populate('groupId', 'name')
    .sort({ createdAt: -1 });

  const escape = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headers = ['Transaction ID', 'Type', 'Amount', 'Status', 'Description', 'Group', 'Payment Method', 'Date'];
  const rows = transactions.map(tx => [
    escape(tx.transactionId),
    escape(tx.type),
    escape(tx.amount),
    escape(tx.status),
    escape(tx.description),
    escape(tx.groupId?.name || ''),
    escape(tx.paymentMethod),
    escape(tx.createdAt ? new Date(tx.createdAt).toISOString() : '')
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const userName = req.user.firstName ? `${req.user.firstName}_${req.user.lastName}` : 'user';
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `transactions_${userName}_${dateStr}.csv`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(csv);
});

/**
 * Claim payout for the current turn recipient
 *
 * @route   POST /api/transactions/payout
 * @access  Private
 */
const claimPayout = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { groupId } = req.body;

  if (!groupId) throw new ValidationError('groupId is required');

  const group = await Group.findById(groupId);
  if (!group) throw new NotFoundError('Group not found');

  if (!group.members.some(m => m.toString() === userId.toString())) {
    throw new ValidationError('You are not a member of this group');
  }

  // Find the member whose status is 'current' — that's the payout recipient
  const recipientEntry = group.membersList.find(
    m => m.userId.toString() === userId.toString() && m.status === 'current'
  );
  if (!recipientEntry) {
    throw new ValidationError('It is not your turn to receive a payout');
  }

  if (!recipientEntry) {
    throw new ValidationError('You are not a member of this group');
  }

  const payoutAmount = group.contributionAmount * group.maxMembers;

  if (group.totalPool < payoutAmount) {
    throw new ValidationError(`Insufficient pool balance. Pool: ₦${group.totalPool.toLocaleString()}, Required: ₦${payoutAmount.toLocaleString()}`);
  }

  // Credit wallet
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = new Wallet({ userId, totalBalance: 0, availableBalance: 0, lockedBalance: 0 });
  }
  wallet.availableBalance += payoutAmount;
  wallet.totalPayouts = (wallet.totalPayouts || 0) + payoutAmount;
  await wallet.save();

  // Record transaction
  const transaction = new Transaction({
    userId,
    groupId,
    transactionId: Transaction.generateTransactionId(),
    type: 'payout',
    amount: payoutAmount,
    status: 'completed',
    description: `Payout from ${group.name}`,
    paymentMethod: 'wallet',
    metadata: { group_name: group.name },
    completedAt: new Date()
  });
  await transaction.save();

  // Deduct from pool
  group.totalPool -= payoutAmount;

  // Mark current member as 'completed', advance turn
  recipientEntry.status = 'completed';
  recipientEntry.turns += 1;

  // Advance currentTurn and set next member to 'current'
  const pendingMembers = group.membersList.filter(m => m.status === 'pending');
  if (pendingMembers.length > 0) {
    pendingMembers[0].status = 'current';
    group.currentTurn += 1;
  } else {
    // All members have received — group cycle complete
    group.status = 'completed';
  }

  await group.save();

  console.log(`✅ Payout claimed: ${transaction.transactionId} — ₦${payoutAmount} to user ${userId}`);

  res.status(200).json({
    success: true,
    message: `Payout of ₦${payoutAmount.toLocaleString()} received successfully`,
    data: {
      transaction,
      wallet: { availableBalance: wallet.availableBalance, totalPayouts: wallet.totalPayouts }
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * Get all transactions for a specific group
 *
 * @route   GET /api/groups/:id/transactions
 * @desc    Get all transactions for a group (any member can view)
 * @access  Private
 */
const getGroupTransactions = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { id: groupId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) throw new NotFoundError('Group not found');

  const isMember = group.members.some(m => m.toString() === userId.toString());
  if (!isMember) throw new ValidationError('You are not a member of this group');

  const transactions = await Transaction.find({ groupId })
    .populate('userId', 'firstName lastName')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: { transactions, count: transactions.length },
    timestamp: new Date().toISOString()
  });
});

// Export all controller functions
module.exports = {
  getTransactions,
  createContribution,
  createWalletContribution,
  getTransactionById,
  getTransactionStats,
  exportCSV,
  claimPayout,
  getGroupTransactions
};