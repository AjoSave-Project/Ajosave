# Implementation Plan: Web-Mobile Feature Parity

## Overview

Implements 16 requirements across backend, web frontend, and mobile frontend. Backend gets new Lock model, lockController, turnGuard middleware, withdraw/auto-withdrawal/CSV-export endpoints. Web wallet page gets real API data, filters, bank section, fund wallet, withdraw, export, auto-withdrawal, lock funds. Web pay screen gets payment method toggle and turn indicator. Mobile groups screen gets due-now badge, progress bar, invitation card, credibility badge. Mobile home screen gets upcoming contributions alert. Both platforms get lock funds UI.

## Tasks

- [x] 1. Backend — Extend Transaction type enum and create Lock model
  - [x] 1.1 Extend Transaction type enum to include 'lock' and 'unlock'
    - Modify `backend/src/models/Transactions.js` enum values
    - _Requirements: 16.12_
  - [x] 1.2 Create Lock model at `backend/src/models/Lock.js`
    - Fields: userId, amount, label, releaseType (date|manual), releaseDate, status (active|released), createdAt, releasedAt
    - _Requirements: 16.4, 16.7, 16.8, 16.9, 16.10_

- [x] 2. Backend — New wallet endpoints (withdraw, auto-withdrawal, lock/unlock)
  - [x] 2.1 Add `withdraw` handler to `backend/src/controllers/walletController.js`
    - Validate amount <= availableBalance, deduct, create withdrawal transaction, return updated wallet
    - _Requirements: 7.5_
  - [x] 2.2 Add `saveAutoWithdrawal` handler to walletController
    - Persist autoWithdrawal settings on wallet document
    - _Requirements: 9.2_
  - [x] 2.3 Create `backend/src/controllers/lockController.js`
    - `createLock`: validate amount, call wallet.lockFunds(), create Lock record and 'lock' transaction
    - `getLocks`: return user's active locks
    - `unlock`: check releaseType/releaseDate, call wallet.unlockFunds(), update lock status, create 'unlock' transaction
    - _Requirements: 16.4, 16.5, 16.7, 16.8, 16.9, 16.10, 16.11, 16.12_
  - [ ]* 2.4 Write unit tests for lockController edge cases
    - amount > availableBalance → 400; date-locked early unlock → 403; manual unlock → succeeds
    - _Requirements: 16.5, 16.9_

- [x] 3. Backend — Turn guard middleware and CSV export
  - [x] 3.1 Create `backend/src/middlewares/turnGuard.js`
    - Load group by req.body.groupId, find membersList entry for req.user._id, reject with 403 if status !== 'current'
    - _Requirements: 15.1, 15.2, 15.6_
  - [x] 3.2 Add `exportCSV` handler to `backend/src/controllers/transactionController.js`
    - Query all user transactions, format as CSV, set Content-Disposition header
    - _Requirements: 8.2_
  - [ ]* 3.3 Write unit test for turnGuard
    - status === 'current' → passes; other status → 403 with message
    - _Requirements: 15.1, 15.2_

- [x] 4. Backend — Wire new routes
  - [x] 4.1 Add new routes to `backend/src/routes/walletRoutes.js`
    - POST /withdraw, POST /auto-withdrawal, POST /locks, GET /locks, POST /locks/:lockId/unlock
    - Apply turnGuard to contribution routes in transactionRoutes.js
    - _Requirements: 7.5, 9.2, 15.6, 16.10_
  - [x] 4.2 Add GET /transactions/export route to `backend/src/routes/transactionRoutes.js`
    - _Requirements: 8.2_

- [x] 5. Backend — Lock release cron job
  - [x] 5.1 Create `backend/src/services/lockReleaseCron.js` using node-cron
    - Run hourly, find expired date-locks, call unlockFunds + create unlock transaction per lock
    - Register cron in server.js
    - _Requirements: 16.7_

- [x] 6. Checkpoint — Backend complete
  - Ensure all backend routes respond correctly, ask the user if questions arise.

- [x] 7. Web — Extend walletServices and api
  - [x] 7.1 Add new methods to `frontend/src/services/walletServices.js`
    - withdraw(bankAccountId, amount), saveAutoWithdrawal(settings), createLock(amount, label, releaseType, releaseDate), getLocks(), unlock(lockId)
    - _Requirements: 7.2, 9.1, 16.3, 16.6, 16.8_
  - [x] 7.2 Add `getBlob` method to `frontend/src/services/api.js` for CSV download
    - Returns raw Response for blob handling
    - _Requirements: 8.1, 8.3_

- [x] 8. Web — Wallet page real data + filters + bank section
  - [x] 8.1 Replace hardcoded mock data in `frontend/src/pages/Wallet.jsx` with real API calls
    - Fetch wallet from GET /api/wallets/me, transactions from GET /api/transactions
    - Show loading spinner and error state with retry
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  - [x] 8.2 Add Transaction_Filters (All / Contribution / Payout / Withdrawal) above transaction list
    - Client-side filter on fetched transactions array
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  - [x] 8.3 Add Bank_Account_Section fetching from GET /api/wallets/bank-accounts
    - Show bank name, masked account number, account holder name, Primary badge
    - "Add Bank Account" link, "Set as Primary" action calling PATCH endpoint
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 9. Web — Wallet page actions (withdraw, export, auto-withdrawal, fund wallet, lock funds)
  - [x] 9.1 Wire Withdraw button to POST /api/wallets/withdraw
    - Modal with bank account selector and amount input; validate amount <= availableBalance
    - Refresh wallet and transactions on success
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6_
  - [x] 9.2 Wire Export button to GET /api/transactions/export
    - Trigger browser file download with filename containing user name and date
    - _Requirements: 8.1, 8.3, 8.4_
  - [x] 9.3 Wire Auto-Withdrawal modal to POST /api/wallets/auto-withdrawal
    - Fetch real bank accounts for selector; pre-populate from wallet.autoWithdrawal
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  - [x] 9.4 Wire Fund Wallet button to POST /api/wallets/fund/initialize + verify
    - Use Paystack inline popup (window.PaystackPop); refresh wallet on success
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_
  - [x] 9.5 Add Lock Funds section to Wallet page
    - "Lock Funds" button opens modal with amount, label, releaseType (date|manual), releaseDate
    - List active locks with label, amount, release condition; Unlock button for manual locks
    - _Requirements: 16.1, 16.3, 16.4, 16.5, 16.6, 16.8, 16.9_

- [x] 10. Web — Pay screen payment method toggle and turn indicator
  - [x] 10.1 Add Payment_Method_Toggle (Wallet / Card) to `frontend/src/pages/Payment.jsx`
    - Wallet method calls POST /api/transactions/contribution/wallet
    - Show wallet balance; disable pay button if insufficient balance
    - _Requirements: 14.1, 14.2, 14.4, 14.5_
  - [x] 10.2 Add turn indicator to each group card on Pay screen
    - Show "Your Turn" badge if user's membersList entry has status === 'current'
    - Disable pay button and show message when not user's turn
    - _Requirements: 15.3, 15.4, 15.5_

- [x] 11. Checkpoint — Web frontend complete
  - Ensure all web pages load real data and actions work, ask the user if questions arise.

- [x] 12. Mobile — Groups screen enhancements
  - [x] 12.1 Add Due Now badge to group cards in `mobile/app/(tabs)/groups.tsx`
    - Red badge when nextContribution < now
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 12.2 Add Progress Bar to group cards
    - Show currentTurn/maxMembers fill and label
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 12.3 Add Invitation Card to group cards
    - Show invitationCode with Copy (Clipboard) and Share (Share.share) buttons
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 12.4 Add Credibility Badge to group cards
    - Show credibilityScore% only when defined and non-null
    - _Requirements: 5.1, 5.2_

- [x] 13. Mobile — Home screen upcoming contributions alert
  - [x] 13.1 Add Upcoming_Contributions_Alert to `mobile/app/(tabs)/home.tsx`
    - Show banner when ≥1 active group has nextContribution within 7 days
    - List up to 3 groups with name, amount, formatted date
    - "Make Payment" link navigates to Pay tab
    - Hide banner when no upcoming groups
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 14. Mobile — Pay screen turn indicator
  - [x] 14.1 Add turn indicator to group cards in `mobile/app/(tabs)/pay.tsx`
    - Show "Your Turn" badge when user's membersList entry has status === 'current'
    - Disable pay button and show message when not user's turn
    - _Requirements: 15.3, 15.5_

- [x] 15. Mobile — Wallet lock funds UI
  - [x] 15.1 Add lock service methods to `mobile/services/walletService.ts`
    - createLock, getLocks, unlock
    - _Requirements: 16.2, 16.3, 16.4, 16.8_
  - [x] 15.2 Add locks state to `mobile/contexts/WalletContext.tsx`
    - locks state, fetchLocks action
    - _Requirements: 16.6_
  - [x] 15.3 Add Lock Funds UI to `mobile/app/(tabs)/wallet.tsx`
    - "Lock Funds" button opens modal with amount, label, releaseType, releaseDate
    - List active locks; Unlock button for manual locks
    - _Requirements: 16.2, 16.3, 16.4, 16.5, 16.6, 16.8, 16.9_

- [x] 16. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The turn guard is applied as middleware on both contribution endpoints
- Lock/unlock operations use existing wallet.lockFunds() / wallet.unlockFunds() instance methods
