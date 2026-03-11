# Ajosave Emergency Micro-Loan System

## Overview

The Emergency Micro-Loan System is designed to solve the critical zero-balance edge case: when a user has no money in their wallet or bank account on their contribution day. Instead of allowing them to default (which triggers harsh penalties), Ajosave offers an instant emergency loan based on their credit score.

**Core Philosophy:** Financial inclusion through lending, not punishment. Help users stay in the system while building credit history.

---

## The Problem

### Real-World Scenario

Tunde joined a group 3 months ago. He's been contributing on-time every month. But this month, he had an emergency:
- His car broke down (₦15,000 repair)
- His child got sick (₦8,000 hospital bill)
- He spent his Ajosave wallet money (₦10,000)
- His contribution is due tomorrow
- His bank account is empty

**Without Emergency Loans:**
- Tunde defaults on contribution
- Harsh penalties apply (₦500-₦5,000)
- His credit score drops
- He gets blacklisted
- He can't rejoin any group

**With Emergency Loans:**
- Tunde gets instant ₦10,000 emergency loan
- He makes his contribution on-time
- Loan is auto-repaid from his next payout
- His credit score improves
- He stays in the system

---

## System Design

### Eligibility Criteria

User is eligible for emergency loan if:

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

### Loan Tiers

Based on credit score, users get different loan limits and interest rates:

```
TIER 1: Credit Score 60-69
├─ Loan limit: ₦25,000
├─ Interest rate: 8%
├─ Repayment period: 3 months
└─ Example: Borrow ₦10,000 → Repay ₦10,800 over 3 months

TIER 2: Credit Score 70-79
├─ Loan limit: ₦50,000
├─ Interest rate: 6%
├─ Repayment period: 3 months
└─ Example: Borrow ₦20,000 → Repay ₦21,200 over 3 months

TIER 3: Credit Score 80-89
├─ Loan limit: ₦75,000
├─ Interest rate: 5%
├─ Repayment period: 3 months
└─ Example: Borrow ₦30,000 → Repay ₦31,500 over 3 months

TIER 4: Credit Score 90+
├─ Loan limit: ₦100,000
├─ Interest rate: 5%
├─ Repayment period: 3 months
└─ Example: Borrow ₦50,000 → Repay ₦52,500 over 3 months
```

### Loan Request Flow

```
Step 1: User Tries to Contribute
├─ Contribution due: ₦10,000
├─ Available balance: ₦0
└─ ERROR: Insufficient balance

Step 2: System Offers Emergency Loan
├─ SMS: "You don't have enough balance. Get an instant emergency loan?"
├─ App shows: "Emergency Loan Available"
├─ Loan amount: ₦10,000 (matches contribution)
├─ Interest rate: 6% (based on credit score 75)
├─ Total repay: ₦10,600
├─ Repayment period: 3 months
└─ "Get Loan" button

Step 3: User Accepts Loan
├─ User clicks "Get Loan"
├─ System verifies eligibility (instant)
├─ Loan approved ✅
├─ ₦10,000 added to wallet (Available balance)
└─ SMS: "Emergency loan of ₦10,000 approved!"

Step 4: User Makes Contribution
├─ Available balance: ₦10,000 ✅
├─ User clicks "Make Contribution"
├─ ₦10,000 moves from Available to Locked
├─ Contribution successful ✅
└─ SMS: "Your contribution of ₦10,000 is confirmed"

Step 5: Loan Repayment Begins
├─ Loan status: ACTIVE
├─ Monthly repayment: ₦3,533 (₦10,600 ÷ 3 months)
├─ First payment due: 30 days from loan date
└─ SMS: "Your first loan repayment of ₦3,533 is due in 7 days"

Step 6: User Receives Payout
├─ Group completes
├─ User receives payout: ₦50,000
├─ System auto-deducts loan repayment: ₦3,533
├─ User receives: ₦50,000 - ₦3,533 = ₦46,467
├─ Loan balance: ₦7,067 (remaining 2 months)
└─ SMS: "Payout received! Loan repayment deducted automatically"

Step 7: Loan Completes
├─ After 3 months, all repayments complete
├─ Loan status: PAID
├─ User's credit score improves
└─ SMS: "Your emergency loan is fully paid! Great job!"
```

### Automatic Repayment Mechanism

```
When user receives payout:

1. System calculates loan repayment due
   ├─ Loan balance: ₦7,067
   ├─ Monthly payment: ₦3,533
   └─ Due this month: ₦3,533

2. System deducts from payout
   ├─ Payout amount: ₦50,000
   ├─ Loan repayment: -₦3,533
   ├─ User receives: ₦46,467
   └─ Loan balance: ₦3,534

3. System updates loan status
   ├─ Payments made: 1/3
   ├─ Next payment due: [30 days]
   └─ Status: ACTIVE

4. User sees in wallet
   ├─ Available balance: ₦46,467
   ├─ Locked balance: ₦0
   └─ Active loans: ₦3,534 (remaining)
```

### Manual Repayment Option

Users can also pay off loans early:

```
User clicks "Pay Loan"
├─ Loan balance: ₦3,534
├─ Interest saved if paid early: ₦0 (no early repayment penalty)
├─ Amount to pay: ₦3,534
└─ "Pay Now" button

User pays ₦3,534
├─ Payment processed
├─ Loan status: PAID
├─ Credit score improves
└─ SMS: "Your emergency loan is fully paid!"
```

---

## Loan Default Consequences

### What Happens If User Defaults on Loan Repayment

```
Loan repayment due: ₦3,533
User doesn't pay for 7 days

Day 7 - First Reminder
├─ SMS: "Your loan repayment of ₦3,533 is overdue"
├─ Email: "Loan repayment reminder"
└─ Status: OVERDUE (1-7 days)

Day 14 - Second Reminder
├─ SMS: "Your loan repayment is 14 days overdue"
├─ Email: "Urgent: Loan repayment overdue"
├─ Status: OVERDUE (8-14 days)
└─ Late fee: ₦500 added to balance

Day 30 - Escalation
├─ SMS: "Your loan is 30 days overdue. Action required."
├─ Email: "Final notice: Loan default"
├─ Status: DEFAULT
├─ Late fee: ₦1,000 added to balance
├─ Total owed: ₦3,533 + ₦1,000 = ₦4,533
└─ User flagged as defaulter

Day 60 - Harsh Penalties Apply
├─ Status: CHRONIC_DEFAULT
├─ Loan balance: ₦4,533 + ₦500 = ₦5,033
├─ User blacklisted
├─ Bank account blocked
├─ Credit bureau reported
├─ Debt collection initiated
└─ Cannot rejoin any group
```

**Key Point:** Loan defaults are treated the same as contribution defaults. Same harsh penalties apply.

---

## Data Models

### Emergency Loan Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  groupId: ObjectId, // Group where contribution was due
  loanAmount: Number, // ₦10,000
  interestRate: Number, // 6% (0.06)
  totalRepayAmount: Number, // ₦10,600
  repaymentPeriod: Number, // 3 (months)
  monthlyPayment: Number, // ₦3,533
  
  status: String, // "active", "paid", "overdue", "default", "cancelled"
  
  creditScoreTier: Number, // 1-4
  creditScoreAtLoan: Number, // 75
  
  requestedAt: Date,
  approvedAt: Date,
  disbursedAt: Date, // When money added to wallet
  
  repaymentSchedule: [
    {
      paymentNumber: Number, // 1, 2, 3
      dueDate: Date,
      amount: Number, // ₦3,533
      paidDate: Date,
      paidAmount: Number,
      status: String, // "pending", "paid", "overdue", "default"
      lateFee: Number,
      source: String // "auto_deduction", "manual_payment"
    }
  ],
  
  totalPaid: Number, // ₦0 initially
  remainingBalance: Number, // ₦10,600 initially
  
  defaultedAt: Date,
  defaultReason: String,
  
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceId: String,
    location: String
  }
}
```

### Loan Repayment Transaction Schema

```javascript
{
  _id: ObjectId,
  loanId: ObjectId,
  userId: ObjectId,
  
  type: String, // "loan_disbursement", "loan_repayment", "loan_late_fee"
  
  amount: Number,
  fee: Number, // Late fee if applicable
  totalAmount: Number,
  
  status: String, // "pending", "completed", "failed"
  
  source: String, // "auto_deduction", "manual_payment", "payout_deduction"
  
  payoutId: ObjectId, // If auto-deducted from payout
  
  reference: String, // Ajosave reference
  paymentReference: String, // Paystack reference
  
  createdAt: Date,
  completedAt: Date,
  
  failureReason: String
}
```

### User Loan Status Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  
  activeLoanCount: Number, // How many active loans
  totalLoanAmount: Number, // Total borrowed
  totalRepaid: Number, // Total repaid
  totalDefaulted: Number, // Total defaulted
  
  currentLoans: [
    {
      loanId: ObjectId,
      amount: Number,
      remainingBalance: Number,
      status: String,
      nextPaymentDue: Date
    }
  ],
  
  loanHistory: [
    {
      loanId: ObjectId,
      amount: Number,
      status: String, // "paid", "default"
      completedAt: Date
    }
  ],
  
  lastUpdated: Date
}
```

---

## API Endpoints

### Request Emergency Loan

```
POST /loans/emergency-request

Request Body:
{
  groupId: ObjectId,
  contributionAmount: Number, // ₦10,000
  reason: String // Optional: "emergency", "unexpected_expense", etc.
}

Response (Success):
{
  status: "approved",
  loan: {
    _id: ObjectId,
    amount: ₦10,000,
    interestRate: 6%,
    totalRepay: ₦10,600,
    monthlyPayment: ₦3,533,
    repaymentPeriod: 3,
    disbursedAt: Date,
    status: "active"
  },
  message: "Emergency loan approved and disbursed"
}

Response (Rejected):
{
  status: "rejected",
  reason: "credit_score_too_low",
  message: "Your credit score is below 60. You're not eligible for emergency loans.",
  suggestions: [
    "Improve your credit score by making on-time contributions",
    "Contact support for other options"
  ]
}
```

### Get Loan Details

```
GET /loans/:loanId

Response:
{
  _id: ObjectId,
  amount: ₦10,000,
  interestRate: 6%,
  totalRepay: ₦10,600,
  status: "active",
  repaymentSchedule: [
    {
      paymentNumber: 1,
      dueDate: Date,
      amount: ₦3,533,
      status: "pending"
    },
    {
      paymentNumber: 2,
      dueDate: Date,
      amount: ₦3,533,
      status: "pending"
    },
    {
      paymentNumber: 3,
      dueDate: Date,
      amount: ₦3,534,
      status: "pending"
    }
  ],
  totalPaid: ₦0,
  remainingBalance: ₦10,600,
  nextPaymentDue: Date
}
```

### Get User's Active Loans

```
GET /users/me/loans

Response:
{
  activeLoanCount: 1,
  totalLoanAmount: ₦10,000,
  totalRepaid: ₦0,
  currentLoans: [
    {
      _id: ObjectId,
      amount: ₦10,000,
      remainingBalance: ₦10,600,
      status: "active",
      nextPaymentDue: Date,
      monthlyPayment: ₦3,533
    }
  ]
}
```

### Make Manual Loan Repayment

```
POST /loans/:loanId/repay

Request Body:
{
  amount: ₦3,533
}

Response:
{
  status: "success",
  transaction: {
    _id: ObjectId,
    amount: ₦3,533,
    reference: "AJO-LOAN-REP-001",
    completedAt: Date
  },
  loan: {
    totalPaid: ₦3,533,
    remainingBalance: ₦7,067,
    nextPaymentDue: Date
  }
}
```

### Get Loan History

```
GET /users/me/loans/history

Response:
{
  totalLoans: 2,
  totalBorrowed: ₦20,000,
  totalRepaid: ₦20,000,
  totalDefaulted: ₦0,
  history: [
    {
      _id: ObjectId,
      amount: ₦10,000,
      status: "paid",
      completedAt: Date,
      interestPaid: ₦600
    },
    {
      _id: ObjectId,
      amount: ₦10,000,
      status: "active",
      remainingBalance: ₦7,067,
      nextPaymentDue: Date
    }
  ]
}
```

---

## Integration with Other Systems

### Integration with Punishment System

```
Loan Default = Contribution Default

When loan payment is 30+ days overdue:
├─ User flagged as defaulter
├─ Punishment Level increases
├─ Same harsh penalties apply:
│  ├─ Bank account blocked
│  ├─ Blacklisted
│  ├─ Credit bureau reported
│  └─ Debt collection initiated
└─ Cannot rejoin any group
```

### Integration with Credit Score System

```
Loan Repayment Impact on Credit Score:

On-time repayment:
├─ +5 points per payment
├─ Demonstrates reliability
└─ Builds credit history

Late repayment:
├─ -10 points per late payment
├─ Shows unreliability
└─ Damages credit history

Default:
├─ -50 points
├─ Major credit damage
└─ Takes 6-12 months to recover
```

### Integration with Payout System

```
When user receives group payout:

1. System checks for active loans
2. System calculates loan repayment due
3. System auto-deducts from payout
4. User receives: Payout - Loan Repayment
5. Loan status updated
6. User notified of deduction

Example:
├─ Payout: ₦50,000
├─ Loan repayment due: ₦3,533
├─ User receives: ₦46,467
└─ Loan balance: ₦7,067
```

---

## User Experience

### Mobile App - Emergency Loan Flow

```
Screen 1: Contribution Due
├─ "Your contribution of ₦10,000 is due today"
├─ Available balance: ₦0
├─ "Make Contribution" button (disabled)
└─ "Get Emergency Loan" button

Screen 2: Loan Offer
├─ "Emergency Loan Available"
├─ Loan amount: ₦10,000
├─ Interest rate: 6%
├─ Total to repay: ₦10,600
├─ Monthly payment: ₦3,533
├─ Repayment period: 3 months
├─ "Get Loan" button
└─ "Learn More" link

Screen 3: Loan Approved
├─ ✅ "Loan Approved!"
├─ "₦10,000 has been added to your wallet"
├─ "You can now make your contribution"
└─ "Make Contribution" button

Screen 4: Contribution Made
├─ ✅ "Contribution Successful"
├─ "Your ₦10,000 contribution is confirmed"
├─ "Loan repayment: ₦3,533/month for 3 months"
└─ "View Loan Details" link

Screen 5: Loan Dashboard
├─ Active Loans: 1
├─ Total Borrowed: ₦10,000
├─ Total Repaid: ₦0
├─ Next Payment Due: [Date]
├─ Amount Due: ₦3,533
├─ "Pay Now" button
└─ "View Schedule" link
```

### Web App - Loan Management

```
Loan Dashboard:
├─ Active Loans Section
│  ├─ Loan amount
│  ├─ Interest rate
│  ├─ Repayment schedule
│  ├─ Next payment due
│  └─ "Pay Now" button
│
├─ Loan History Section
│  ├─ Past loans
│  ├─ Status (paid/default)
│  ├─ Total interest paid
│  └─ Completion date
│
└─ Loan Details Modal
   ├─ Full repayment schedule
   ├─ Payment history
   ├─ Interest breakdown
   └─ "Download Statement" button
```

---

## Edge Cases & Handling

### Edge Case 1: User Requests Loan But Becomes Ineligible

```
Scenario: User requests emergency loan
├─ Credit score: 65 ✅ (eligible)
├─ System approves loan
├─ But before disbursement, user defaults on another group
├─ Credit score drops to 55 ❌ (ineligible)

What happens:
├─ Loan is already approved
├─ Loan is still disbursed (commitment made)
├─ User must repay as agreed
└─ Future loans require credit score ≥ 60
```

### Edge Case 2: User Has Multiple Active Loans

```
Scenario: User has 2 active loans
├─ Loan 1: ₦10,000 (₦3,533/month)
├─ Loan 2: ₦5,000 (₦1,667/month)
├─ Total monthly: ₦5,200

User receives payout: ₦50,000
├─ Loan 1 repayment: -₦3,533
├─ Loan 2 repayment: -₦1,667
├─ User receives: ₦50,000 - ₦5,200 = ₦44,800
└─ Both loans updated
```

### Edge Case 3: User Requests Loan But Already Has Active Loan

```
Scenario: User has active loan
├─ Loan 1: ₦10,000 (active)
├─ User tries to request another loan
└─ ERROR: "You already have an active emergency loan"

Solution:
├─ User must pay off current loan first
├─ Or wait for auto-repayment from payout
└─ Then can request new loan
```

### Edge Case 4: Loan Repayment Fails

```
Scenario: Auto-deduction from payout fails
├─ Payout: ₦50,000
├─ Loan repayment: ₦3,533
├─ Paystack API down
├─ Deduction fails

What happens:
├─ Payout still processed: ₦50,000
├─ Loan repayment marked as PENDING
├─ System retries every 1 hour for 24 hours
├─ If still fails, user notified
├─ User can pay manually
└─ Loan status: OVERDUE (if not paid within 7 days)
```

### Edge Case 5: User Wants to Leave Group But Has Active Loan

```
Scenario: User received payout and has active loan
├─ Loan: ₦10,000 (₦3,533/month)
├─ User wants to leave group
└─ ERROR: "You cannot leave while loan is active"

Solution:
├─ User must pay off loan first
├─ Or wait for auto-repayment to complete
├─ Then can leave group
```

---

## Revenue Model

### Interest Income

```
Loan: ₦10,000 at 6% interest
├─ Total repay: ₦10,600
├─ Interest earned: ₦600
└─ Ajosave keeps: ₦600

Monthly volume estimate (at scale):
├─ 1,000 active users
├─ 20% request emergency loans
├─ Average loan: ₦15,000
├─ Average interest rate: 6%
├─ Monthly interest income: ₦18,000
└─ Annual interest income: ₦216,000
```

### Risk Management

```
Loan Default Rate Target: < 5%

If default rate exceeds 5%:
├─ Increase interest rates
├─ Lower loan limits
├─ Increase credit score requirement
└─ Increase late fees
```

---

## Implementation Roadmap

### Phase 1: Core Loan System (Week 1-2)
- [ ] Create loan data models
- [ ] Implement loan eligibility check
- [ ] Implement loan approval logic
- [ ] Implement loan disbursement
- [ ] Create loan API endpoints
- [ ] Write unit tests

### Phase 2: Repayment System (Week 2-3)
- [ ] Implement repayment schedule calculation
- [ ] Implement auto-deduction from payouts
- [ ] Implement manual repayment
- [ ] Implement late fee calculation
- [ ] Create repayment API endpoints
- [ ] Write integration tests

### Phase 3: UI Implementation (Week 3-4)
- [ ] Mobile app - emergency loan offer screen
- [ ] Mobile app - loan dashboard
- [ ] Web app - loan management
- [ ] Notifications for loan events
- [ ] Write component tests

### Phase 4: Integration & Testing (Week 4-5)
- [ ] Integrate with punishment system
- [ ] Integrate with credit score system
- [ ] Integrate with payout system
- [ ] End-to-end testing
- [ ] Security audit
- [ ] Performance testing

### Phase 5: Launch & Monitoring (Week 5+)
- [ ] Deploy to staging
- [ ] Beta testing with 100 users
- [ ] Monitor loan default rates
- [ ] Adjust parameters based on data
- [ ] Deploy to production

---

## Summary

The Emergency Micro-Loan System is a critical feature that:

1. **Solves the zero-balance problem** - Users can contribute even when they have no money
2. **Prevents defaults** - Reduces harsh penalties and blacklisting
3. **Builds credit** - Users build credit history through on-time repayment
4. **Generates revenue** - Interest income from loans
5. **Improves retention** - Users stay in the system instead of being blacklisted
6. **Enables financial inclusion** - Helps users access credit based on Ajosave credit score

This system transforms Ajosave from a pure savings group into a **financial inclusion platform** that helps users build credit and access credit when needed.

