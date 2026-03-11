# Ajosave Punishment System - Design & Requirements

## Executive Summary (For Team Lead)

The traditional Nigerian Ajo system fails because there's **zero accountability**. People join, collect their payout early, and disappear. The group loses money. Trust collapses. **Ajosave's punishment system is designed to make fraud expensive and impossible.**

**Core Strategy:** Use KYC data (BVN, bank account) to create **permanent, irreversible consequences** for defaults. Make it so costly to default that people won't even try.

**The Goal:** 
- Deter fraud before it happens (harsh penalties)
- Catch fraudsters who do default (blacklisting, bank blocking)
- Protect honest group members (enforcement through partnerships)
- Create accountability that traditional Ajo never had

---

## Core Philosophy

**"Make Fraud More Expensive Than Honesty"**

The system is designed to:
1. **Prevent** the "collect and disappear" fraud (lock funds until all contributions complete)
2. **Deter** defaults (harsh penalties that scale with severity)
3. **Catch** defaulters (use KYC data to track them)
4. **Punish** severely (blacklisting, bank account blocking, credit damage)
5. **Enforce** through partnerships (bank integration to block accounts)

---

## System Architecture

### The Fraud Prevention Strategy

**Problem:** People join, collect payout, disappear.

**Solution:** 
1. **Lock funds** - Payout money is locked in escrow until member completes all remaining contributions
2. **Verify identity** - KYC (BVN) required before joining ANY group
3. **Track defaults** - Every default is recorded permanently
4. **Escalate harshly** - Penalties increase exponentially
5. **Enforce through banks** - Partner with banks to block accounts of chronic defaulters

---

## Punishment Levels (Harsh & Escalating)

### Level 0: Good Standing ✅
**What it means:** You've paid all contributions on time.

**What you can do:**
- ✅ Create groups
- ✅ Join groups
- ✅ Withdraw money
- ✅ Receive payouts
- ✅ Reliability score: 100

**What happens if you default:** Move to Level 1

---

### Level 1: First Default (1-3 days late) 🚩
**What it means:** You missed your first payment. This is your only warning.

**Immediate consequences:**
- 🚨 SMS alert: "ALERT: You're 1 day late on ₦[amount]. Pay within 24 hours or face penalties"
- 📱 In-app warning: "PAYMENT OVERDUE - Pay immediately"
- 👥 Group members see: "[Name] is LATE - ₦[amount] overdue"
- ⏱️ 24-hour grace period to pay without penalty

**If you pay within 24 hours:**
- ✅ Back to Level 0
- ✅ No penalty
- ✅ No record (clean slate)

**If you don't pay within 24 hours:**
- ❌ Move to Level 2
- 💰 Penalty: ₦500 (5% of contribution or ₦500, whichever is higher)
- 📝 Default recorded permanently in your profile

---

### Level 2: Serious Default (4-14 days late) 🚨
**What it means:** You've ignored the warning. You're now a defaulter.

**Immediate consequences:**
- 🚨 SMS escalation: "URGENT: You're [days] days late on ₦[amount]. Your account is flagged. Pay immediately or face account restrictions"
- 📧 Email escalation: "Your account has been flagged as DEFAULTER"
- 👥 Group members see: "[Name] [Phone] is DEFAULTER - ₦[amount] overdue - [Days] days late"
- ❌ **Cannot join new groups** (can stay in current group)
- ❌ **Cannot create new groups**
- 💰 Penalty: ₦1,000 + 10% of contribution amount
- 📝 Added to Ajosave internal blacklist (visible to all group admins)

**If you pay:**
- ✅ Back to Level 0
- ✅ Penalty is deducted from your wallet
- ✅ Default record remains (for history)
- ✅ Can join/create groups again

**If you don't pay:**
- ❌ Move to Level 3 after 14 days

---

### Level 3: Chronic Default (15-30 days late) 🔴
**What it means:** You're deliberately not paying. Serious enforcement begins.

**Immediate consequences:**
- 🚨 SMS final notice: "FINAL NOTICE: You're [days] days late on ₦[amount]. Your account will be reported to credit bureaus and banks. Pay immediately"
- 📧 Email final notice: "Your account is being reported to credit bureaus and financial institutions"
- 👥 **Public listing on Ajosave:** Your name, phone, BVN status, and default amount visible to ALL users
- ❌ **Cannot join new groups**
- ❌ **Cannot create new groups**
- ❌ **Cannot withdraw funds** (locked for debt recovery)
- 💰 Penalty: ₦2,000 + 15% of contribution amount
- 📝 Reported to credit bureaus (with user consent from signup)
- 🏦 Reported to partner banks (account flagging begins)
- 📝 Added to national defaulter database (if partnership exists)

**If you pay:**
- ✅ Back to Level 0
- ✅ Penalty is deducted
- ✅ Public listing removed
- ✅ Withdrawals unlocked
- ✅ Credit bureaus notified you've paid
- ✅ Banks notified to unblock account

**If you don't pay:**
- ❌ Move to Level 4 after 30 days

---

### Level 4: Permanent Blacklist (30+ days late) 🔒
**What it means:** You're a fraud. You're done on this platform.

**Permanent consequences:**
- 🚨 SMS: "Your account has been permanently blacklisted. Your bank account may be blocked. Contact support if you want to pay"
- 📧 Email: "Your account is permanently blacklisted for fraud"
- 👥 **Permanent public listing:** Name, phone, BVN, default amount, date of default visible to ALL users
- ❌ **Account permanently disabled** (cannot create/join groups)
- ❌ **Cannot withdraw funds** (permanently locked)
- 💰 Penalty: ₦5,000 + 20% of contribution amount
- 🏦 **Bank account blocked** (through partner bank integration)
- 📝 Reported to all credit bureaus
- 📝 Reported to debt collection agencies
- 📝 Added to national fraud database
- 🚫 Blacklisted from ALL Ajosave groups (permanent)

**If you pay:**
- ✅ Account unlocked
- ✅ Back to Level 0
- ✅ Public listing removed
- ✅ Bank account unblocked
- ✅ Credit bureaus notified
- ✅ Can rejoin platform

**If you don't pay:**
- ❌ Debt collection agencies pursue you
- ❌ Your credit score is destroyed
- ❌ Your bank account remains blocked
- ❌ You cannot use any financial services

---

### Level 5: Dispute/Investigation ⚖️
**What it means:** You claim you paid but we have no record. Let's investigate.

**What happens:**
- 🔒 Account frozen pending investigation
- ✅ All restrictions suspended during investigation
- 📋 Admin reviews evidence (bank receipts, transaction IDs, etc.)
- ⏱️ Investigation takes 3-7 business days
- 📱 You can submit proof of payment

**If you're right (you did pay):**
- ✅ All flags removed immediately
- ✅ Apology issued
- ✅ Any penalties refunded
- ✅ Credit bureaus notified you're cleared
- ✅ Bank account unblocked

**If you're wrong (you didn't pay):**
- ❌ Back to your previous level
- ❌ Investigation fee: ₦500 (deducted from wallet)

---

## Fraud Prevention Mechanisms

### 1. Payout Escrow (Prevents "Collect and Disappear")

**How it works:**
```
Group has 5 members, each contributes ₦10,000/month for 5 months

Month 1:
├─ All 5 members contribute ₦10,000
├─ Total: ₦50,000
├─ Member 1 receives ₦50,000 (their turn)
├─ BUT: ₦50,000 is LOCKED in escrow
├─ Member 1 can only withdraw AFTER they complete remaining 4 months of contributions
└─ If Member 1 defaults, ₦50,000 is used to cover the debt

Month 2:
├─ Member 1 must contribute ₦10,000 (or face penalties)
├─ If they pay: ₦10,000 goes to Member 2
├─ If they don't pay: ₦10,000 is deducted from their escrow balance
└─ Escrow balance: ₦40,000 (locked until they complete all contributions)
```

**Result:** People can't collect and disappear. Their payout is held hostage until they complete their obligations.

### 2. KYC Verification (Prevents Fake Accounts)

**Required before joining ANY group:**
- ✅ Full name (verified against BVN)
- ✅ Phone number (verified via OTP)
- ✅ BVN (verified with NIMC/CBN)
- ✅ Bank account (verified with Paystack)
- ✅ Photo ID (stored securely)

**Result:** No fake accounts. No anonymous fraud. Every person is traceable.

### 3. Permanent Blacklist (Prevents Re-joining)

**Once blacklisted:**
- ❌ Cannot create new account with same phone
- ❌ Cannot create new account with same BVN
- ❌ Cannot create new account with same bank account
- ❌ System flags any attempt to rejoin

**Result:** Fraudsters can't just create a new account and repeat the scam.

### 4. Bank Account Blocking (Prevents Withdrawal)

**Through bank partnerships:**
- 🏦 Partner banks receive list of blacklisted BVNs
- 🏦 When blacklisted person tries to withdraw, bank blocks the transaction
- 🏦 Bank notifies Ajosave of attempted withdrawal
- 🏦 Account remains blocked until debt is paid

**Result:** Even if they have money in their wallet, they can't access it.

### 5. Credit Bureau Reporting (Prevents Future Credit)

**Reported to credit bureaus:**
- 📊 Default amount
- 📊 Date of default
- 📊 Days late
- 📊 Status (paid or unpaid)

**Result:** Their credit score is destroyed. They can't get loans, credit cards, or mortgages.

### 6. Debt Collection Agency Reporting (Enforces Payment)

**Reported to debt collection agencies:**
- 💼 Name, phone, BVN
- 💼 Default amount
- 💼 Date of default
- 💼 Ajosave contact for payment

**Result:** Debt collectors pursue them. They face legal action if they don't pay.

---

## Detailed Workflow

### What Happens When Someone Misses a Payment

```
Day 1 (Payment Due)
├─ Contribution is due
├─ System checks: Did they pay?
└─ If NO → Move to Day 2

Day 2-3 (Grace Period)
├─ SMS reminder sent
├─ In-app warning shown
├─ Group members notified
├─ 24-hour grace period to pay without penalty
└─ If they pay → Back to Level 0 ✅

Day 4-14 (Level 2: Serious Default)
├─ SMS escalation sent
├─ Email escalation sent
├─ Cannot join/create new groups
├─ Added to internal blacklist
├─ Penalty: ₦1,000 + 10% of contribution
├─ Public listing begins
└─ If they pay → Back to Level 0 ✅

Day 15-30 (Level 3: Chronic Default)
├─ SMS final notice sent
├─ Email final notice sent
├─ Public listing on platform
├─ Reported to credit bureaus
├─ Reported to partner banks
├─ Cannot withdraw funds
├─ Penalty: ₦2,000 + 15% of contribution
└─ If they pay → Back to Level 0 ✅

Day 30+ (Level 4: Permanent Blacklist)
├─ SMS notification sent
├─ Email notification sent
├─ Account permanently disabled
├─ Bank account blocked
├─ Reported to debt collection agencies
├─ Penalty: ₦5,000 + 20% of contribution
├─ Public listing permanent
└─ If they pay → Account unlocked ✅

At ANY Point
├─ User can dispute the default
├─ Account frozen pending investigation
├─ Admin reviews evidence
└─ If valid → Cleared immediately ✅
```

---

## Data Model

### User Punishment Status Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  bvn: String, // Encrypted
  bankAccount: String, // Encrypted
  currentLevel: Number, // 0-4
  levelHistory: [
    {
      level: Number,
      changedAt: Date,
      reason: String, // "payment_received", "days_late_threshold", "dispute_resolved"
      daysLate: Number,
      groupId: ObjectId
    }
  ],
  defaultedGroups: [
    {
      groupId: ObjectId,
      groupName: String,
      dueDate: Date,
      daysLate: Number,
      amount: Number,
      status: String, // "pending", "paid", "disputed"
      defaultDate: Date,
      paidDate: Date
    }
  ],
  totalDefaults: Number, // Count of all defaults
  totalDefaultAmount: Number, // Total amount owed across all defaults
  totalPenalties: Number, // Total penalties paid
  penalties: [
    {
      amount: Number,
      reason: String, // "level_2_default", "level_3_default", "level_4_default"
      appliedAt: Date,
      paidAt: Date,
      groupId: ObjectId
    }
  ],
  disputes: [
    {
      _id: ObjectId,
      groupId: ObjectId,
      reason: String,
      evidence: [String], // URLs to uploaded documents
      status: String, // "pending", "approved", "rejected"
      submittedAt: Date,
      resolvedAt: Date,
      resolution: String
    }
  ],
  creditBureauReported: Boolean,
  creditBureauReportDate: Date,
  creditBureauStatus: String, // "reported", "cleared", "pending"
  debtCollectionReported: Boolean,
  debtCollectionReportDate: Date,
  bankBlockStatus: String, // "active", "inactive", "pending"
  bankBlockedAt: Date,
  bankUnblockedAt: Date,
  isBlacklisted: Boolean,
  blacklistedAt: Date,
  blacklistReason: String,
  canRejoin: Boolean, // false if permanently blacklisted
  lastNotificationSent: Date,
  notificationChannels: [String], // ["sms", "email", "push"]
  publicListingActive: Boolean,
  publicListingStartDate: Date,
  publicListingEndDate: Date
}
```

---

## Notification Templates

### Level 1: First Default (1-3 days)
**SMS:**
```
ALERT: You're 1 day late on ₦[amount] to [Group Name]. 
Pay within 24 hours to avoid penalties and account restrictions.
Pay now: [link]
```

**Email:**
```
Subject: URGENT: Payment Overdue - 24 Hour Grace Period

Hi [Name],

Your contribution of ₦[amount] to [Group Name] is now 1 day overdue.

You have 24 hours to pay without penalties.

After 24 hours:
- Your account will be flagged
- You cannot join new groups
- Penalties will apply (₦500 + 10% of contribution)

Pay now: [link]

This is your only warning.
```

### Level 2: Serious Default (4-14 days)
**SMS:**
```
URGENT: You're [days] days late on ₦[amount]. Your account is FLAGGED. 
Cannot join new groups. Penalty: ₦[penalty]. Pay immediately: [link]
```

**Email:**
```
Subject: ACCOUNT FLAGGED - You're a Defaulter

Hi [Name],

You're [days] days late on your contribution of ₦[amount].

Your account is now flagged as DEFAULTER:
- Cannot join new groups
- Cannot create new groups
- Added to internal blacklist
- Visible to all group admins
- Penalty: ₦[penalty] (₦1,000 + 10% of contribution)

Pay immediately: [link]

Urgent support: support@ajosave.com
```

### Level 3: Chronic Default (15-30 days)
**SMS:**
```
FINAL NOTICE: You're [days] days late on ₦[amount]. 
Your account will be reported to credit bureaus and banks. 
Pay immediately: [link]
```

**Email:**
```
Subject: FINAL NOTICE - Account Being Reported to Credit Bureaus

Hi [Name],

You're [days] days late on your contribution of ₦[amount].

Your account is being reported:
- Credit bureaus (damages your credit score)
- Partner banks (your account may be blocked)
- National fraud database
- Public listing on Ajosave (name, phone, amount visible to all users)

Consequences:
- Cannot get loans or credit cards
- Bank account may be blocked
- Cannot withdraw funds
- Permanent blacklist if not paid within 30 days

This is your FINAL warning. Pay immediately: [link]

Urgent support: support@ajosave.com
```

### Level 4: Permanent Blacklist (30+ days)
**SMS:**
```
Your account is PERMANENTLY BLACKLISTED. Your bank account is BLOCKED. 
Debt collectors will contact you. Pay ₦[amount] + ₦[penalty] to unlock: [link]
```

**Email:**
```
Subject: CRITICAL - Account Permanently Blacklisted

Hi [Name],

You're [days] days late on your contribution of ₦[amount].

Your account is now PERMANENTLY BLACKLISTED:
- Account disabled (cannot create/join groups)
- Bank account BLOCKED
- Reported to debt collection agencies
- Reported to all credit bureaus
- Public listing permanent (name, phone, BVN, amount visible to all users)
- Cannot withdraw funds

Consequences:
- Debt collectors will pursue you
- Your credit score is destroyed
- You cannot get any financial services
- Legal action may be taken

To unlock your account, pay ₦[amount] + ₦[penalty]: [link]

This is not a warning. This is enforcement.

Support: support@ajosave.com
```

---

## Implementation Checklist

### Backend Tasks
- [ ] Create harsh punishment status schema
- [ ] Implement automatic level calculation (1-3 days, 4-14 days, 15-30 days, 30+ days)
- [ ] Implement payout escrow system (lock funds until all contributions complete)
- [ ] Create notification sending system (SMS, email, push)
- [ ] Implement group member visibility rules (show name, phone, default amount)
- [ ] Create dispute submission and review system
- [ ] Implement credit bureau reporting API integration
- [ ] Implement bank account blocking API integration
- [ ] Create permanent blacklist system
- [ ] Implement penalty calculation (escalating: ₦500 → ₦1,000 → ₦2,000 → ₦5,000)
- [ ] Create admin dashboard for monitoring defaults
- [ ] Implement audit logging for all punishment actions
- [ ] Implement webhook for payment confirmation
- [ ] Create public listing system (visible to all users)
- [ ] Implement BVN/phone/bank account duplicate detection

### Frontend Tasks (Web)
- [ ] Display user's current punishment level prominently
- [ ] Show "FLAGGED", "DEFAULTER", "BLACKLISTED" badges
- [ ] Display restrictions based on level
- [ ] Create dispute submission form
- [ ] Show notification history
- [ ] Display payment history with penalties
- [ ] Create admin view for managing defaults
- [ ] Display public listing of defaulters (if user is admin)
- [ ] Show escrow balance and remaining obligations

### Frontend Tasks (Mobile)
- [ ] Display user's current punishment level prominently
- [ ] Show badges and restrictions
- [ ] Create dispute submission form
- [ ] Show push notifications
- [ ] Display payment history with penalties
- [ ] Create admin view for managing defaults
- [ ] Display escrow balance and remaining obligations

### Testing Tasks
- [ ] Test automatic level escalation (1-3 days, 4-14 days, etc.)
- [ ] Test notification sending (SMS, email, push)
- [ ] Test group visibility rules
- [ ] Test dispute resolution
- [ ] Test payment clearing
- [ ] Test credit bureau reporting
- [ ] Test bank account blocking
- [ ] Test payout escrow system
- [ ] Test penalty calculation
- [ ] Test edge cases (multiple groups, concurrent defaults)
- [ ] Test BVN duplicate detection
- [ ] Test permanent blacklist

### Bank Partnership Tasks
- [ ] Integrate with partner bank APIs for account blocking
- [ ] Create BVN blacklist feed to banks
- [ ] Implement webhook for bank notifications
- [ ] Create payment confirmation from banks
- [ ] Test account blocking/unblocking

### Credit Bureau Integration Tasks
- [ ] Integrate with credit bureau APIs
- [ ] Create default reporting feed
- [ ] Implement payment clearing notification
- [ ] Test credit bureau reporting

---

## FAQ for Team Lead

**Q: What if someone pays after being blacklisted?**
A: Account is immediately unlocked. Bank account is unblocked. Public listing is removed. Credit bureaus are notified they've paid. They're back to Level 0.

**Q: What if someone disputes a default and wins?**
A: All flags are removed immediately. Penalties are refunded. Credit bureaus are notified they're cleared. Bank account is unblocked. They're back to Level 0.

**Q: Can someone create a new account with a different phone number?**
A: No. The system checks BVN and bank account. If they're blacklisted, any account with the same BVN or bank account is automatically flagged.

**Q: What if someone is in Level 4 and pays?**
A: They go back to Level 0 immediately. All restrictions removed. Public listing removed. Bank account unblocked. Credit bureaus notified.

**Q: What if someone has multiple groups and defaults in one?**
A: Each group is tracked separately. But if they reach Level 3+, they can't join ANY new groups. Level 4 blacklist applies across ALL groups.

**Q: Is this legal in Nigeria?**
A: Yes, with proper consent. Users agree to this in the Terms of Service. Credit bureau reporting requires explicit consent. Bank account blocking requires explicit consent. Debt collection requires explicit consent.

**Q: What if someone claims they paid but we have no record?**
A: They can submit a dispute with proof (bank receipt, transaction ID). Admin verifies. If valid, they're cleared immediately and penalties are refunded.

**Q: How does the payout escrow work?**
A: When someone receives their payout, the money is locked in escrow. They can only withdraw it after they complete all remaining contributions. If they default, the escrow money is used to cover the debt.

**Q: What if someone defaults in one group but is on-time in another?**
A: Each group is independent. But if they reach Level 3+, they can't join new groups. Level 4 blacklist prevents them from joining ANY group.

**Q: How do we prevent someone from just not paying and accepting the consequences?**
A: Multiple enforcement mechanisms:
1. Payout escrow (their money is locked)
2. Bank account blocking (they can't access their money)
3. Credit bureau reporting (damages their credit score)
4. Debt collection agencies (pursue them legally)
5. Public listing (social shame)
6. Permanent blacklist (can't use the platform)

---

## Success Metrics

- 99%+ on-time contribution rate (harsh penalties deter defaults)
- <1% of users reach Level 3+
- <0.1% of users reach Level 4
- 100% of Level 4 users eventually pay (through enforcement)
- Zero "collect and disappear" fraud (payout escrow prevents it)
- 99%+ accuracy in level calculation
- Zero false positives (people wrongly flagged)
- 95%+ dispute resolution within 7 days

---

## Conclusion

The punishment system is designed to be **harsh, irreversible, and effective**. It deters fraud through severe consequences, prevents "collect and disappear" through payout escrow, and enforces payment through bank partnerships and credit bureau reporting. The goal is to make fraud so expensive that people won't even try.
