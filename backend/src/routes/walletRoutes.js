const express = require('express');
const router = express.Router();

const {
  getMyWallet,
  verifyBankAccount,
  addBankAccount,
  getBankAccounts,
  setPrimaryBankAccount,
  initializeFunding,
  verifyFunding
} = require('../controllers/walletController');

const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/me', getMyWallet);
router.get('/bank-accounts', getBankAccounts);
router.post('/verify-account', verifyBankAccount);
router.post('/add-bank-account', addBankAccount);
router.patch('/bank-accounts/:accountId/set-primary', setPrimaryBankAccount);
router.post('/fund/initialize', initializeFunding);
router.post('/fund/verify', verifyFunding);

module.exports = router;
