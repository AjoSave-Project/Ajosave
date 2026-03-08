const Wallet = require('../models/Wallets');
const Transaction = require('../models/Transactions');
const axios = require('axios');
const {
  NotFoundError,
  ValidationError,
  asyncErrorHandler
} = require('../middlewares/errorHandler');

/**
 * Get Current User's Wallet
 * 
 * @route   GET /api/wallets/me
 * @desc    Get authenticated user's wallet
 * @access  Private
 */
const getMyWallet = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  console.log(`💰 Fetching wallet for user: ${userId}`);

  try {
    let wallet = await Wallet.findOne({ userId });

    // If wallet doesn't exist, create it
    if (!wallet) {
      console.log(`💰 Creating wallet for user: ${userId}`);
      wallet = new Wallet({
        userId,
        totalBalance: 0,
        availableBalance: 0,
        lockedBalance: 0,
        totalPayouts: 0,
        totalContributions: 0,
        totalWithdrawals: 0
      });
      await wallet.save();
      console.log(`✅ Wallet created for user: ${userId}`);
    }

    res.status(200).json({
      success: true,
      message: 'Wallet retrieved successfully',
      data: { wallet },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to fetch wallet for user ${userId}:`, error.message);
    throw error;
  }
});

/**
 * Verify Bank Account with Paystack
 * 
 * @route   POST /api/wallets/verify-account
 * @desc    Verify bank account details using Paystack
 * @access  Private
 */
const verifyBankAccount = asyncErrorHandler(async (req, res) => {
  const { accountNumber, bankCode } = req.body;

  console.log(`🔍 Verifying account: ${accountNumber} with bank: ${bankCode}`);

  try {
    // Call Paystack API to resolve account
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    if (!response.data.status) {
      throw new ValidationError('Unable to verify account. Please check details.');
    }

    console.log(`✅ Account verified:`, response.data.data.account_name);

    res.status(200).json({
      success: true,
      message: 'Account verified successfully',
      data: {
        accountName: response.data.data.account_name,
        accountNumber: response.data.data.account_number
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Account verification failed:`, error.message);
    
    if (error.response?.data) {
      throw new ValidationError(error.response.data.message || 'Account verification failed');
    }
    
    throw error;
  }
});

/**
 * Add Bank Account
 * 
 * @route   POST /api/wallets/add-bank-account
 * @desc    Add and verify bank account, create Paystack recipient
 * @access  Private
 */
const addBankAccount = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { accountNumber, accountName, bankCode, bankName } = req.body;

  console.log(`💳 Adding bank account for user: ${userId}`);

  try {
    // Get or create wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({ userId });
      await wallet.save();
    }

    // Check if account already exists
    const existingAccount = wallet.linkedBankAccounts.find(
      acc => acc.accountNumber === accountNumber && acc.bankCode === bankCode
    );

    if (existingAccount) {
      throw new ValidationError('This bank account is already added');
    }

    // Create Paystack recipient for transfers
    console.log('🔧 Creating Paystack recipient...');
    
    const recipientResponse = await axios.post(
      'https://api.paystack.co/transferrecipient',
      {
        type: 'nuban',
        name: accountName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: 'NGN'
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!recipientResponse.data.status) {
      throw new ValidationError('Failed to create recipient on Paystack');
    }

    const recipientCode = recipientResponse.data.data.recipient_code;
    console.log(`✅ Paystack recipient created: ${recipientCode}`);

    // Add bank account to wallet
    const isPrimary = wallet.linkedBankAccounts.length === 0;

    const newAccount = {
      accountNumber,
      accountName,
      bankCode,
      bankName,
      recipientCode, // Store Paystack recipient code
      isPrimary,
      isVerified: true,
      addedAt: new Date()
    };

    wallet.linkedBankAccounts.push(newAccount);
    await wallet.save();

    console.log(`✅ Bank account added successfully`);

    res.status(201).json({
      success: true,
      message: 'Bank account added successfully',
      data: {
        bankAccount: newAccount
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to add bank account:`, error.message);
    
    if (error.response?.data) {
      throw new ValidationError(error.response.data.message || 'Failed to add bank account');
    }
    
    throw error;
  }
});

/**
 * Get Bank Accounts
 * 
 * @route   GET /api/wallets/bank-accounts
 * @desc    Get user's linked bank accounts
 * @access  Private
 */
const getBankAccounts = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  console.log(`📋 Fetching bank accounts for user: ${userId}`);

  try {
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(200).json({
        success: true,
        message: 'No bank accounts found',
        data: {
          bankAccounts: []
        },
        timestamp: new Date().toISOString()
      });
    }

    // Don't send recipient codes to frontend (security)
    const bankAccounts = wallet.linkedBankAccounts.map(acc => ({
      _id: acc._id,
      accountNumber: acc.accountNumber,
      accountName: acc.accountName,
      bankName: acc.bankName,
      isPrimary: acc.isPrimary,
      isVerified: acc.isVerified,
      addedAt: acc.addedAt
    }));

    res.status(200).json({
      success: true,
      message: 'Bank accounts retrieved successfully',
      data: {
        bankAccounts
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to fetch bank accounts:`, error.message);
    throw error;
  }
});

/**
 * Set Primary Bank Account
 *
 * @route   PATCH /api/wallets/bank-accounts/:accountId/set-primary
 * @desc    Set a bank account as the primary account
 * @access  Private
 */
const setPrimaryBankAccount = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { accountId } = req.params;

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw new NotFoundError('Wallet not found');

  const account = wallet.linkedBankAccounts.id(accountId);
  if (!account) throw new NotFoundError('Bank account not found');

  wallet.linkedBankAccounts.forEach(acc => { acc.isPrimary = false; });
  account.isPrimary = true;
  await wallet.save();

  res.status(200).json({
    success: true,
    message: 'Primary account updated',
    data: { accountId },
    timestamp: new Date().toISOString()
  });
});

/**
 * Initialize Wallet Funding via Paystack
 *
 * @route   POST /api/wallets/fund/initialize
 * @desc    Initialize a Paystack transaction to fund the wallet
 * @access  Private
 */
const initializeFunding = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { amount, email } = req.body;

  if (!amount || amount < 100) throw new ValidationError('Minimum funding amount is ₦100');
  if (!email) throw new ValidationError('Email is required');

  const amountInKobo = Math.round(amount * 100);

  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    {
      email,
      amount: amountInKobo,
      metadata: { userId: userId.toString(), type: 'fund_wallet' }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.data.status) throw new ValidationError('Failed to initialize payment');

  res.status(200).json({
    success: true,
    message: 'Payment initialized',
    data: {
      authorizationUrl: response.data.data.authorization_url,
      accessCode: response.data.data.access_code,
      reference: response.data.data.reference
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * Verify Wallet Funding via Paystack
 *
 * @route   POST /api/wallets/fund/verify
 * @desc    Verify Paystack payment and credit wallet
 * @access  Private
 */
const verifyFunding = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { reference } = req.body;

  console.log(`💳 verifyFunding called — userId: ${userId}, reference: ${reference}`);

  if (!reference) throw new ValidationError('Payment reference is required');

  // Check for duplicate
  const existing = await Transaction.findOne({ 'paymentDetails.processorReference': reference });
  if (existing) {
    if (existing.status === 'completed') {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified',
        data: { transaction: existing },
        timestamp: new Date().toISOString()
      });
    }
    throw new ValidationError('Duplicate payment reference');
  }

  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
  );

  console.log(`💳 Paystack verify response — status: ${response.data.status}, txStatus: ${response.data.data?.status}`);

  if (!response.data.status || response.data.data.status !== 'success') {
    throw new ValidationError('Payment verification failed or payment not successful');
  }

  const paystackData = response.data.data;
  const amountNaira = paystackData.amount / 100;

  // Credit wallet
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = new Wallet({ userId, totalBalance: 0, availableBalance: 0, lockedBalance: 0 });
  }
  wallet.availableBalance += amountNaira;
  await wallet.save();

  // Record transaction
  const transaction = new Transaction({
    userId,
    transactionId: Transaction.generateTransactionId(),
    type: 'fund_wallet',
    amount: amountNaira,
    status: 'completed',
    description: 'Wallet funded via Paystack',
    paymentMethod: 'card',
    paymentDetails: { processorReference: reference },
    completedAt: new Date()
  });
  await transaction.save();

  res.status(200).json({
    success: true,
    message: `Wallet funded with ₦${amountNaira.toLocaleString()}`,
    data: {
      transaction,
      wallet: { availableBalance: wallet.availableBalance, totalBalance: wallet.totalBalance }
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * Withdraw funds to linked bank account
 *
 * @route   POST /api/wallets/withdraw
 * @access  Private
 */
const withdraw = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { bankAccountId, amount } = req.body;

  if (!amount || amount <= 0) throw new ValidationError('Amount must be positive');
  if (!bankAccountId) throw new ValidationError('Bank account is required');

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw new NotFoundError('Wallet not found');

  if (wallet.availableBalance < amount) {
    throw new ValidationError(`Insufficient balance. Available: ₦${wallet.availableBalance.toLocaleString()}`);
  }

  const account = wallet.linkedBankAccounts.id(bankAccountId);
  if (!account) throw new NotFoundError('Bank account not found');

  wallet.availableBalance -= Number(amount);
  wallet.totalWithdrawals = (wallet.totalWithdrawals || 0) + Number(amount);
  await wallet.save();

  const transaction = new Transaction({
    userId,
    transactionId: Transaction.generateTransactionId(),
    type: 'withdrawal',
    amount: Number(amount),
    status: 'completed',
    description: `Withdrawal to ${account.bankName} ****${account.accountNumber.slice(-4)}`,
    paymentMethod: 'bank_transfer',
    paymentDetails: { bankName: account.bankName },
    completedAt: new Date()
  });
  await transaction.save();

  res.status(200).json({
    success: true,
    message: 'Withdrawal initiated successfully',
    data: {
      transaction,
      wallet: { availableBalance: wallet.availableBalance, totalBalance: wallet.totalBalance }
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * Save auto-withdrawal settings
 *
 * @route   POST /api/wallets/auto-withdrawal
 * @access  Private
 */
const saveAutoWithdrawal = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const { bankAccount, percentage, minAmount, enabled } = req.body;

  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = new Wallet({ userId });
  }

  wallet.autoWithdrawal = {
    enabled: !!enabled,
    bankAccount: bankAccount || wallet.autoWithdrawal?.bankAccount,
    percentage: percentage ?? wallet.autoWithdrawal?.percentage ?? 100,
    minAmount: minAmount ?? wallet.autoWithdrawal?.minAmount ?? 1000
  };
  await wallet.save();

  res.status(200).json({
    success: true,
    message: 'Auto-withdrawal settings saved',
    data: { autoWithdrawal: wallet.autoWithdrawal },
    timestamp: new Date().toISOString()
  });
});

module.exports = {
  getMyWallet,
  verifyBankAccount,
  addBankAccount,
  getBankAccounts,
  setPrimaryBankAccount,
  initializeFunding,
  verifyFunding,
  withdraw,
  saveAutoWithdrawal
};