# Ajosave Edge Cases & User Management

## Part 1: Edge Cases & Out-of-Ordinary Scenarios

### Edge Case 1: User Has No Money in Wallet or Bank Account (Zero Balance)

**Scenario:** Tunde's contribution is due tomorrow. His bank account is empty AND his Ajosave wallet is empty (₦0 available balance). He had money at the beginning but spent it on emergencies.

**What happens:**

```
Step 1: Tunde gets reminder SMS
├─ "Your contribution of ₦10,000 is due tomorrow"
└─ Tunde checks his wallet: Available ₦0 ❌

Step 2: Tunde clicks "Make Contribution"
├─ System checks: Available balance ₦0
├─ Required: ₦10,000
└─ ERROR: Insufficient balance

Step 3: System Offers Emergency Loan
├─ SMS: "You don't have enough balance. Get an instant emergency loan?"
├─ App shows: "Emergency Loan Available"
├─ Loan amount: ₦10,000 (matches contribution)
├─ Interest rate: 6% (based on credit score 75)
├─ Total repay: ₦10,600
├─ Repayment period: 3 months
└─ "Get Loan" button

Step 4: Tunde Accepts Loan
├─ Tunde clicks "Get Loan"
├─ System verifies eligibility:
│  ├─ Credit score: 75 ✅ (≥60)
│  ├─ No unpaid defaults: ✅
│  ├─ Account age: 6 months ✅ (≥30 days)
│  ├─ KYC verified: ✅
│  └─ Not blacklisted: ✅
├─ Loan approved instantly ✅
├─ ₦10,000 added to wallet (Available balance)
└─ SMS: "Emergency loan of ₦10,000 approved!"

Step 5: Tunde Makes Contribution
├─ Available balance: ₦10,000 ✅
├─ Tunde clicks "Make Contribution"
├─ ₦10,000 moves from Available to Locked
├─ Contribution successful ✅
└─ SMS: "Your contribution of ₦10,000 is confirmed"

Step 6: Loan Repayment Begins
├─ Loan status: ACTIVE
├─ Monthly repayment: ₦3,533 (₦10,600 ÷ 3 months)
├─ First payment due: 30 days from loan date
└─ SMS: "Your first loan repayment of ₦3,533 is due in 7 days"

Step 7: Tunde Receives Payout
├─ Group completes
├─ Tunde receives payout: ₦50,000
├─ System auto-deducts loan repayment: ₦3,533
├─ Tunde receives: ₦50,000 - ₦3,533 = ₦46,467
├─ Loan balance: ₦7,067 (remaining 2 months)
└─ SMS: "Payout received! Loan repayment deducted automatically"

Step 8: Loan Completes
├─ After 3 months, all repayments complete
├─ Loan status: PAID
├─ Tunde's credit score improves
└─ SMS: "Your emergency loan is fully paid! Great job!"

Result:
├─ Tunde's contribution: ✅ ON-TIME (no default)
├─ Tunde's reliability score: 100%
├─ Tunde's credit score: IMPROVED
├─ Tunde stays in system: ✅
└─ No blacklist, no harsh penalties
```

**Key point:** When a user has zero balance, the Emergency Micro-Loan System provides an instant solution. Instead of defaulting and facing harsh penalties, the user gets a loan, makes their contribution on-time, and builds credit through repayment.

**Without Emergency Loans (Old System):**
- Tunde defaults on contribution
- Harsh penalties apply (₦500-₦5,000)
- His credit score drops
- He gets blacklisted
- He can't rejoin any group

**With Emergency Loans (New System):**
- Tunde gets instant ₦10,000 emergency loan
- He makes his contribution on-time
- Loan is auto-repaid from his next payout
- His credit score improves
- He stays in the system

**Eligibility for Emergency Loan:**
```
✅ ELIGIBLE IF:
├─ Credit score ≥ 60
├─ No unpaid defaults in last 6 months
├─ Account age ≥ 30 days
├─ KYC verified
├─ Not already in default
└─ Not already have active emergency loan

❌ NOT ELIGIBLE IF:
├─ Credit score < 60
├─ Has unpaid defaults
├─ Account age < 30 days
├─ KYC not verified
├─ Currently in default
├─ Already has active emergency loan
└─ Blacklisted
```

**Loan Tiers (Based on Credit Score):**
| Credit Score | Loan Limit | Interest Rate |
|---|---|---|
| 60-69 | ₦25,000 | 8% |
| 70-79 | ₦50,000 | 6% |
| 80-89 | ₦75,000 | 5% |
| 90+ | ₦100,000 | 5% |

**See EMERGENCY_LOAN_SYSTEM.md for complete details on the emergency loan system.**

---

### Edge Case 2: User Deposits Money But Contribution is Due Before Deposit Clears

**Scenario:** Amara's contribution is due on the 1st. She deposits ₦10,000 via bank transfer on the 1st at 9 AM, but bank transfers take 30 minutes to clear.

**What happens:**

```
9:00 AM - Amara initiates bank transfer
├─ Amount: ₦10,000
├─ Status: PENDING
└─ Ajosave wallet: ₦0 (not yet received)

9:05 AM - Contribution reminder sent
├─ SMS: "Your contribution of ₦10,000 is due today"
├─ Amara's wallet: ₦0
└─ Amara cannot make contribution yet

9:30 AM - Bank transfer clears
├─ Ajosave receives ₦10,000 from bank
├─ Amara's wallet: ₦10,000 ✅
└─ SMS: "Your deposit of ₦10,000 has been received"

9:35 AM - Amara makes contribution
├─ ₦10,000 moves from Available to Locked
├─ Contribution successful ✅
└─ Status: ON-TIME (within same day)

Result:
├─ Amara's contribution: ✅ ON-TIME
├─ No penalties
└─ No issues
```

**Key point:** Bank transfers can take time. Ajosave gives a grace period on the same day. If you pay before midnight on the due date, you're on-time.

---

### Edge Case 3: User Tries to Contribute But Insufficient Balance

**Scenario:** Kunle's contribution is due, but he only has ₦5,000 in his available balance. He needs ₦10,000.

**What happens:**

```
Kunle clicks "Make Contribution"
├─ System checks: Available balance ₦5,000
├─ Required: ₦10,000
└─ ERROR: Insufficient balance

App shows:
├─ "Insufficient balance"
├─ "You need ₦10,000 but only have ₦5,000"
├─ "Deposit ₦5,000 more to contribute"
└─ "Deposit Now" button

Kunle clicks "Deposit Now"
├─ Redirected to deposit screen
├─ Kunle deposits ₦5,000 via card
├─ Deposit clears immediately
├─ Available balance: ₦10,000 ✅

Kunle clicks "Make Contribution" again
├─ ₦10,000 moves from Available to Locked
├─ Contribution successful ✅
└─ Status: ON-TIME (same day)

Result:
├─ Kunle's contribution: ✅ ON-TIME
├─ No penalties
└─ No issues
```

**Key point:** If you don't have enough money, you can deposit more immediately. Card deposits are instant.

---

### Edge Case 4: User Receives Payout But Doesn't Withdraw

**Scenario:** Chioma received her ₦50,000 payout but doesn't withdraw it to her bank account. She keeps it in her Ajosave wallet.

**What happens:**

```
Month 1 - Chioma receives payout
├─ Available balance: ₦50,000
├─ Locked balance: ₦0
└─ Chioma doesn't withdraw

Month 2 - Contribution due
├─ Chioma needs to contribute ₦10,000
├─ Available balance: ₦50,000 ✅
├─ Chioma clicks "Make Contribution"
├─ ₦10,000 moves from Available to Locked
├─ Available balance: ₦40,000
└─ Locked balance: ₦10,000

Month 3 - Contribution due
├─ Available balance: ₦40,000 ✅
├─ Chioma contributes ₦10,000
├─ Available balance: ₦30,000
└─ Locked balance: ₦20,000

Month 4 - Contribution due
├─ Available balance: ₦30,000 ✅
├─ Chioma contributes ₦10,000
├─ Available balance: ₦20,000
└─ Locked balance: ₦30,000

Month 5 - Contribution due
├─ Available balance: ₦20,000 ✅
├─ Chioma contributes ₦10,000
├─ Available balance: ₦10,000
└─ Locked balance: ₦40,000

After Month 5 - Group completes
├─ Chioma's wallet: ₦10,000 (never withdrew)
├─ Chioma can now withdraw ₦10,000 to bank
└─ Or keep it for next group
```

**Key point:** You can keep your payout in your wallet and use it for future contributions. No need to withdraw immediately.

---

### Edge Case 5: User Joins Multiple Groups Simultaneously

**Scenario:** Zainab joins 3 different groups at the same time, each requiring ₦10,000/month.

**What happens:**

```
Zainab's wallet: ₦50,000 available

Group 1 (Market Women):
├─ Contribution: ₦10,000/month
├─ Turn: 3 (receives in March)
└─ Status: ACTIVE

Group 2 (Office Friends):
├─ Contribution: ₦10,000/month
├─ Turn: 2 (receives in February)
└─ Status: ACTIVE

Group 3 (Church Ajo):
├─ Contribution: ₦10,000/month
├─ Turn: 4 (receives in April)
└─ Status: ACTIVE

Month 1 - All groups require contribution
├─ Group 1: ₦10,000 ✅
├─ Group 2: ₦10,000 ✅
├─ Group 3: ₦10,000 ✅
├─ Total: ₦30,000
├─ Available balance: ₦50,000 - ₦30,000 = ₦20,000
└─ Locked balance: ₦30,000

Month 2 - All groups require contribution
├─ Group 1: ₦10,000 ✅
├─ Group 2: ₦10,000 ✅ (Zainab receives ₦40,000 payout)
├─ Group 3: ₦10,000 ✅
├─ Total contributed: ₦30,000
├─ Total received: ₦40,000
├─ Net: +₦10,000
├─ Available balance: ₦20,000 + ₦40,000 - ₦30,000 = ₦30,000
└─ Locked balance: ₦30,000

Month 3 - All groups require contribution
├─ Group 1: ₦10,000 ✅ (Zainab receives ₦50,000 payout)
├─ Group 2: COMPLETED (no more contributions)
├─ Group 3: ₦10,000 ✅
├─ Total contributed: ₦20,000
├─ Total received: ₦50,000
├─ Net: +₦30,000
├─ Available balance: ₦30,000 + ₦50,000 - ₦20,000 = ₦60,000
└─ Locked balance: ₦20,000

Result:
├─ Zainab is in 3 groups simultaneously
├─ Zainab's wallet grows as she receives payouts
├─ No conflicts or issues
└─ System tracks all groups independently
```

**Key point:** You can be in multiple groups at the same time. The system tracks each group separately and manages your wallet accordingly.

---

### Edge Case 6: User Wants to Leave Group After Receiving Payout

**Scenario:** Kunle received his payout in Month 4 but wants to leave the group before Month 5.

**What happens:**

```
Month 4 - Kunle receives payout
├─ Kunle's locked balance: ₦10,000 (still owes for Month 5)
├─ Kunle wants to leave
└─ System prevents it

Error message:
├─ "You cannot leave the group"
├─ "You still owe ₦10,000 for Month 5"
├─ "You must complete your obligations"
└─ "Contact group admin if you have issues"

Why?
├─ If Kunle leaves, Zainab won't receive her full payout
├─ Zainab would get ₦40,000 instead of ₦50,000
├─ This breaks the group

Solution:
├─ Kunle must contribute ₦10,000 in Month 5
├─ After Month 5, Kunle can leave
├─ Or Kunle can ask group admin to remove him
├─ If removed, he's flagged as defaulter
└─ Harsh penalties apply
```

**Key point:** Once you receive your payout, you MUST complete all remaining contributions. You can't leave early.

---

### Edge Case 7: User Receives Payout But Bank Account is Invalid

**Scenario:** Chioma received her ₦50,000 payout and tries to withdraw to her bank account, but the account number is invalid.

**What happens:**

```
Chioma clicks "Withdraw"
├─ Amount: ₦50,000
├─ Bank account: 1234567890 (invalid)
└─ Fee: ₦100

System verifies bank account
├─ Paystack checks: Account doesn't exist
├─ ERROR: Invalid bank account
└─ Withdrawal BLOCKED

Error message:
├─ "Bank account verification failed"
├─ "The account number is invalid or doesn't exist"
├─ "Please update your bank account details"
└─ "Update Bank Account" button

Chioma clicks "Update Bank Account"
├─ Enters new account number: 9876543210
├─ System verifies with Paystack
├─ Verification successful ✅
└─ Account saved

Chioma clicks "Withdraw" again
├─ Amount: ₦50,000
├─ Bank account: 9876543210 ✅
├─ Fee: ₦100
└─ Withdrawal successful ✅

Money arrives in Chioma's bank account within 1-2 hours
```

**Key point:** Bank account must be verified before withdrawal. If invalid, you must update it.

---

### Edge Case 8: User Tries to Withdraw More Than Available Balance

**Scenario:** Tunde has ₦30,000 available balance but tries to withdraw ₦50,000.

**What happens:**

```
Tunde clicks "Withdraw"
├─ Amount: ₦50,000
├─ Available balance: ₦30,000
└─ ERROR: Insufficient balance

Error message:
├─ "Insufficient balance"
├─ "You have ₦30,000 available"
├─ "You cannot withdraw ₦50,000"
└─ "Maximum withdrawal: ₦30,000"

Tunde adjusts amount
├─ Amount: ₦30,000 ✅
├─ Fee: ₦100
├─ Total deducted: ₦30,100
└─ Withdrawal successful ✅

Tunde's wallet:
├─ Available balance: ₦0
├─ Locked balance: ₦10,000 (still in group)
└─ Total: ₦10,000
```

**Key point:** You can only withdraw what's in your available balance. Locked balance cannot be withdrawn.

---

### Edge Case 9: User Tries to Join Group But Doesn't Have Enough Money

**Scenario:** Amara wants to join a group that requires ₦10,000/month, but she only has ₦5,000 in her wallet.

**What happens:**

```
Amara enters group invite code
├─ Group details shown:
│  ├─ Name: Market Women Ajo
│  ├─ Contribution: ₦10,000/month
│  ├─ Members: 5
│  └─ Your turn: Turn 6 (June)
└─ "Join Group" button

Amara clicks "Join Group"
├─ System checks: Available balance ₦5,000
├─ Required: ₦10,000
└─ ERROR: Insufficient balance

Error message:
├─ "Insufficient balance to join group"
├─ "Group requires ₦10,000/month"
├─ "You have ₦5,000"
├─ "Deposit ₦5,000 more to join"
└─ "Deposit Now" button

Amara clicks "Deposit Now"
├─ Deposits ₦5,000 via card
├─ Available balance: ₦10,000 ✅
└─ Deposit clears immediately

Amara clicks "Join Group" again
├─ System checks: Available balance ₦10,000 ✅
├─ Amara is added to group
├─ Turn: 6 (June)
└─ Status: ACTIVE

Next contribution due: [Next month]
```

**Key point:** You must have enough money in your wallet to join a group. If not, deposit first.

---

### Edge Case 10: User Account Gets Hacked

**Scenario:** Kunle's account is hacked. Someone logs in and tries to withdraw all his money.

**What happens:**

```
Hacker logs in to Kunle's account
├─ Phone number: 08012345678
├─ Password: ••••••••
└─ Login successful (hacker has credentials)

Hacker tries to withdraw ₦50,000
├─ Available balance: ₦50,000
├─ Bank account: Hacker's account (changed)
└─ Withdrawal initiated

System detects suspicious activity
├─ Login from new device
├─ New bank account added
├─ Large withdrawal attempt
├─ Location: Different city
└─ ALERT: Suspicious activity detected

System actions:
├─ Withdrawal BLOCKED
├─ Account LOCKED
├─ SMS sent to Kunle: "Suspicious login detected. Your account is locked"
├─ Email sent to Kunle: "Unauthorized access attempt"
└─ Support team notified

Kunle receives alert
├─ SMS: "Your account was locked due to suspicious activity"
├─ Kunle clicks link in SMS
├─ Verifies identity (OTP)
├─ Account UNLOCKED
└─ Hacker's bank account REMOVED

Kunle's account restored:
├─ Available balance: ₦50,000 ✅ (protected)
├─ Locked balance: ₦10,000 ✅ (protected)
├─ Bank account: Kunle's original account ✅
└─ Status: SECURE
```

**Key point:** Ajosave has fraud detection. Suspicious activity triggers alerts and account locks. Your money is protected.

---

## Part 2: User Management System

### User Lifecycle

```
1. REGISTRATION
   ├─ Phone number
   ├─ Password
   ├─ Full name
   └─ Email (optional)

2. KYC VERIFICATION
   ├─ BVN verification
   ├─ Date of birth
   ├─ Photo ID upload
   └─ Status: VERIFIED or UNVERIFIED

3. ACTIVE USER
   ├─ Can create groups
   ├─ Can join groups
   ├─ Can make contributions
   ├─ Can receive payouts
   └─ Can withdraw money

4. ACCOUNT SUSPENSION (if rules violated)
   ├─ Reason: Fraud, false info, illegal activity
   ├─ Status: SUSPENDED
   ├─ Can withdraw available balance
   └─ Cannot create/join groups

5. ACCOUNT DELETION
   ├─ User requests deletion
   ├─ Personal data deleted within 90 days
   ├─ Transaction records kept 7 years (legal requirement)
   └─ Status: DELETED
```

### User Profile Management

```javascript
{
  _id: ObjectId,
  phone: String, // Unique, verified
  email: String, // Optional
  fullName: String,
  dateOfBirth: Date,
  bvn: String, // Encrypted
  profilePhoto: String, // URL to Cloudinary
  bankAccounts: [
    {
      accountNumber: String, // Encrypted
      bankCode: String,
      accountName: String,
      bankName: String,
      isVerified: Boolean,
      isPrimary: Boolean,
      createdAt: Date
    }
  ],
  kycStatus: String, // "verified", "unverified", "pending"
  kycVerifiedAt: Date,
  accountStatus: String, // "active", "suspended", "deleted"
  createdAt: Date,
  lastLoginAt: Date,
  loginAttempts: Number,
  isLocked: Boolean, // Locked due to suspicious activity
  lockedAt: Date,
  lockedReason: String,
  preferences: {
    notificationChannels: [String], // ["sms", "email", "push"]
    language: String, // "en", "yo", "ig"
    timezone: String
  }
}
```

---

## Part 3: Transaction History Management

### Transaction Types

```
1. DEPOSIT
   ├─ User deposits money to wallet
   ├─ Via: Card, Bank transfer
   ├─ Status: Pending, Completed, Failed
   └─ Fee: 1.5% + ₦100 (Paystack)

2. CONTRIBUTION
   ├─ User contributes to group
   ├─ Money moves from Available to Locked
   ├─ Status: On-time, Late, Missed
   └─ Fee: None

3. PAYOUT
   ├─ User receives group payout
   ├─ Money moves from Locked to Available
   ├─ Status: Pending, Completed
   └─ Fee: None

4. WITHDRAWAL
   ├─ User withdraws to bank account
   ├─ Money moves from Available to Bank
   ├─ Status: Pending, Processing, Completed, Failed
   └─ Fee: ₦100

5. REFUND
   ├─ System refunds money (failed transaction, dispute)
   ├─ Money moves back to Available
   ├─ Status: Completed
   └─ Fee: None

6. PENALTY
   ├─ User charged penalty for default
   ├─ Money deducted from Available
   ├─ Status: Completed
   └─ Fee: ₦500 - ₦5,000 (depends on level)
```

### Transaction Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String, // "deposit", "contribution", "payout", "withdrawal", "refund", "penalty"
  amount: Number,
  fee: Number,
  totalAmount: Number, // amount + fee
  status: String, // "pending", "processing", "completed", "failed"
  statusHistory: [
    {
      status: String,
      timestamp: Date,
      reason: String
    }
  ],
  reference: String, // Ajosave reference
  paymentReference: String, // Paystack reference (if applicable)
  groupId: ObjectId, // If contribution/payout
  fromAccount: String, // For withdrawals
  toAccount: String, // For deposits/withdrawals
  description: String,
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceId: String,
    location: String
  },
  createdAt: Date,
  completedAt: Date,
  failureReason: String
}
```

### Transaction History View

```
User sees in app:

JANUARY 2025
├─ Jan 15 - Deposit ₦10,000 (Card) ✅ COMPLETED
│  ├─ Amount: ₦10,000
│  ├─ Fee: ₦250
│  ├─ Total: ₦10,250
│  └─ Reference: AJO-2025-001
│
├─ Jan 20 - Contribution ₦10,000 (Market Women Ajo) ✅ ON-TIME
│  ├─ Amount: ₦10,000
│  ├─ Group: Market Women Ajo
│  ├─ Status: On-time
│  └─ Reference: AJO-2025-002
│
└─ Jan 25 - Payout ₦50,000 (Market Women Ajo) ✅ COMPLETED
   ├─ Amount: ₦50,000
   ├─ Group: Market Women Ajo
   ├─ Your turn: Turn 1
   └─ Reference: AJO-2025-003

FEBRUARY 2025
├─ Feb 1 - Contribution ₦10,000 (Market Women Ajo) ✅ ON-TIME
│  └─ Reference: AJO-2025-004
│
├─ Feb 5 - Withdrawal ₦50,000 (GTBank) ✅ COMPLETED
│  ├─ Amount: ₦50,000
│  ├─ Fee: ₦100
│  ├─ Total: ₦50,100
│  ├─ Bank: GTBank
│  ├─ Account: 0123456789
│  └─ Reference: AJO-2025-005
│
└─ Feb 10 - Deposit ₦5,000 (Bank Transfer) ⏳ PENDING
   ├─ Amount: ₦5,000
   ├─ Status: Waiting for bank confirmation
   └─ Reference: AJO-2025-006
```

---

## Part 4: Credit History Management

### Credit Score Calculation

```
Ajosave Credit Score (0-100):

Based on:
├─ On-time contribution rate (40%)
│  ├─ 100% on-time: 40 points
│  ├─ 90% on-time: 36 points
│  ├─ 80% on-time: 32 points
│  └─ <80% on-time: <32 points
│
├─ Total amount saved (30%)
│  ├─ ₦100,000+: 30 points
│  ├─ ₦50,000-₦100,000: 20 points
│  ├─ ₦10,000-₦50,000: 10 points
│  └─ <₦10,000: 0 points
│
├─ Number of completed groups (20%)
│  ├─ 5+ groups: 20 points
│  ├─ 3-4 groups: 15 points
│  ├─ 1-2 groups: 10 points
│  └─ 0 groups: 0 points
│
└─ Default history (10%)
   ├─ No defaults: 10 points
   ├─ 1 default (paid): 5 points
   ├─ 2+ defaults (paid): 2 points
   └─ Unpaid defaults: 0 points

Example:
├─ On-time rate: 95% = 38 points
├─ Total saved: ₦75,000 = 20 points
├─ Completed groups: 2 = 10 points
├─ Default history: 1 (paid) = 5 points
└─ TOTAL SCORE: 73/100 (GOOD)
```

### Credit History Report

```
User sees in app:

AJOSAVE CREDIT SCORE: 73/100 (GOOD)

Your Credit Profile:
├─ Account Age: 8 months
├─ Total Saved: ₦75,000
├─ Completed Groups: 2
├─ Active Groups: 1
├─ On-time Rate: 95%
├─ Defaults: 1 (paid)
└─ Last Default: 3 months ago (RESOLVED)

Contribution History:
├─ Total Contributions: ₦50,000
├─ On-time: 48 contributions
├─ Late: 2 contributions
├─ Missed: 0 contributions
└─ On-time Rate: 96%

Payout History:
├─ Total Received: ₦100,000
├─ Completed Payouts: 2
├─ Pending Payouts: 1
└─ Average Payout: ₦50,000

Default History:
├─ Total Defaults: 1
├─ Default Amount: ₦10,000
├─ Default Date: 3 months ago
├─ Status: RESOLVED (PAID)
└─ Penalty Paid: ₦1,500

What This Means:
├─ ✅ You're a reliable saver
├─ ✅ You can join more groups
├─ ✅ You're eligible for loans (future feature)
├─ ✅ Your credit score is improving
└─ ⚠️ Avoid defaults to maintain score
```

### Credit Bureau Integration

```
When user reaches Level 3+ (Chronic Default):

Reported to Credit Bureaus:
├─ Name
├─ BVN
├─ Phone number
├─ Default amount
├─ Date of default
├─ Days late
├─ Status (paid or unpaid)
└─ Ajosave reference

Credit Bureau Impact:
├─ Credit score drops 50-100 points
├─ Cannot get bank loans
├─ Cannot get credit cards
├─ Cannot get mortgages
├─ Cannot get car loans
└─ Lasts 7 years (or until paid)

When user pays:
├─ Ajosave notifies credit bureaus
├─ Status updated to "PAID"
├─ Credit score gradually recovers
├─ Takes 6-12 months to recover fully
└─ After 7 years, record removed
```

### User Credit History Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  creditScore: Number, // 0-100
  scoreHistory: [
    {
      score: Number,
      calculatedAt: Date,
      reason: String // "contribution_on_time", "default_paid", etc.
    }
  ],
  totalSaved: Number,
  totalReceived: Number,
  completedGroups: Number,
  activeGroups: Number,
  onTimeRate: Number, // percentage
  lateRate: Number,
  missedRate: Number,
  totalDefaults: Number,
  paidDefaults: Number,
  unpaidDefaults: Number,
  defaultHistory: [
    {
      groupId: ObjectId,
      amount: Number,
      daysLate: Number,
      defaultDate: Date,
      paidDate: Date,
      status: String // "paid", "unpaid"
    }
  ],
  creditBureauReported: Boolean,
  creditBureauReportDate: Date,
  creditBureauStatus: String, // "reported", "cleared", "pending"
  lastUpdated: Date
}
```

---

## Summary

This document covers:

1. **10 Edge Cases** - Real-world scenarios and how the system handles them
2. **User Management** - User lifecycle, profile management, account security
3. **Transaction History** - All transaction types, tracking, and reporting
4. **Credit History** - Credit score calculation, credit bureau integration, credit reports

All systems are designed to be **transparent, secure, and fair** while preventing fraud and ensuring accountability.


---

## Part 5: Emergency Micro-Loan System (Solution to Edge Case 1)

### Overview

Edge Case 1 (User Has No Money in Bank Account) is solved through the **Emergency Micro-Loan System**. Instead of allowing users to default when they have zero balance, Ajosave offers instant emergency loans based on credit score.

### Quick Summary

When a user has insufficient balance on contribution day:

```
User has ₦0 available balance
├─ Contribution due: ₦10,000
├─ System checks credit score: 75 ✅
├─ System offers emergency loan
├─ Loan approved instantly
├─ ₦10,000 added to wallet
├─ User makes contribution on-time
├─ Loan auto-repaid from next payout
└─ User stays in system (no blacklist)
```

### Key Features

- **Instant Approval:** Loans approved in seconds based on credit score
- **Automatic Repayment:** Loans auto-deducted from group payouts
- **Tiered Limits:** Loan limits and interest rates based on credit score
- **Credit Building:** On-time repayment improves credit score
- **Default Consequences:** Loan defaults treated same as contribution defaults

### Loan Tiers

| Credit Score | Loan Limit | Interest Rate | Monthly Payment (₦10k loan) |
|---|---|---|---|
| 60-69 | ₦25,000 | 8% | ₦3,600 |
| 70-79 | ₦50,000 | 6% | ₦3,533 |
| 80-89 | ₦75,000 | 5% | ₦3,500 |
| 90+ | ₦100,000 | 5% | ₦3,500 |

### Full Documentation

For complete details on the Emergency Micro-Loan System, see: **EMERGENCY_LOAN_SYSTEM.md**

This includes:
- System design and architecture
- Eligibility criteria and loan tiers
- Complete user flow and experience
- API endpoints and data models
- Integration with punishment and credit systems
- Edge cases and handling
- Revenue model and implementation roadmap

