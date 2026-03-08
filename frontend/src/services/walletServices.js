// frontend/src/services/walletServices.js

import { api } from './api';

const getMyWallet = async () => {
  return api.get('/wallets/me');
};

const getWalletTransactions = async (params = {}) => {
  return api.get('/transactions', params);
};

const getBankAccounts = async () => {
  return api.get('/wallets/bank-accounts');
};

const setPrimaryBankAccount = async (accountId) => {
  return api.patch(`/wallets/bank-accounts/${accountId}/set-primary`);
};

const withdraw = async (bankAccountId, amount) => {
  return api.post('/wallets/withdraw', { bankAccountId, amount });
};

const saveAutoWithdrawal = async (settings) => {
  return api.post('/wallets/auto-withdrawal', settings);
};

const initializeFunding = async (amount, email) => {
  return api.post('/wallets/fund/initialize', { amount, email });
};

const verifyFunding = async (reference) => {
  return api.post('/wallets/fund/verify', { reference });
};

const createLock = async (amount, label, releaseType, releaseDate) => {
  return api.post('/wallets/locks', { amount, label, releaseType, releaseDate });
};

const getLocks = async () => {
  return api.get('/wallets/locks');
};

const unlock = async (lockId) => {
  return api.post(`/wallets/locks/${lockId}/unlock`);
};

const walletService = {
  getMyWallet,
  getWalletTransactions,
  getBankAccounts,
  setPrimaryBankAccount,
  withdraw,
  saveAutoWithdrawal,
  initializeFunding,
  verifyFunding,
  createLock,
  getLocks,
  unlock
};

export default walletService;
