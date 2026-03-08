const express = require('express');
const router = express.Router();

const {
  getMyWallet,
  verifyBankAccount,
  addBankAccount,
  getBankAccounts,
  setPrimaryBankAccount,
  initializeFunding,
  verifyFunding,
  withdraw,
  saveAutoWithdrawal
} = require('../controllers/walletController');

const { createLock, getLocks, unlock } = require('../controllers/lockController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/me', getMyWallet);
router.get('/bank-accounts', getBankAccounts);
router.post('/verify-account', verifyBankAccount);
router.post('/add-bank-account', addBankAccount);
router.patch('/bank-accounts/:accountId/set-primary', setPrimaryBankAccount);
router.post('/fund/initialize', initializeFunding);
router.post('/fund/verify', verifyFunding);
router.post('/withdraw', withdraw);
router.post('/auto-withdrawal', saveAutoWithdrawal);
router.post('/locks', createLock);
router.get('/locks', getLocks);
router.post('/locks/:lockId/unlock', unlock);

module.exports = router;
