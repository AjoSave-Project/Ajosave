const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const turnGuard = require('../middlewares/turnGuard');

const {
  getTransactions,
  createContribution,
  createWalletContribution,
  getTransactionById,
  getTransactionStats,
  exportCSV,
  claimPayout
} = require('../controllers/transactionController');

const { sanitizeInput } = require('../middlewares/validation');

router.use(protect);
router.use(sanitizeInput);

router.get('/', getTransactions);
router.get('/stats', getTransactionStats);
router.get('/export', exportCSV);
router.post('/contribution', turnGuard, createContribution);
router.post('/contribution/wallet', turnGuard, createWalletContribution);
router.post('/payout', claimPayout);
router.get('/:id', getTransactionById);

module.exports = router;
