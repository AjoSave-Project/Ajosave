# Ajosave Rotation System - User Guide

## What is the Rotation System?

The rotation system is the **heart of Ajosave**. It's how the app automatically manages who pays when and who receives money when. Think of it like a queue at a bank—everyone takes turns, and the system keeps track of whose turn it is.

In traditional Ajo, someone (usually the group leader) manually tracks who paid, who didn't, and whose turn it is to receive money. This is where fraud happens. **Ajosave automates all of this**, so there's no room for cheating.

---

## How It Works (Simple Example)

Let's say you and 4 friends create a savings group:

**Group Details:**
- Group name: "Market Women Ajo"
- Members: Chioma, Tunde, Amara, Kunle, Zainab (5 people)
- Contribution amount: ₦10,000 per person
- Contribution frequency: Monthly (1st of every month)
- Total pool per cycle: ₦50,000 (5 people × ₦10,000)

**How the rotation works:**

### **Month 1 (January)**
```
Contribution Due: January 1st

Who pays:
├─ Chioma: ₦10,000 ✅
├─ Tunde: ₦10,000 ✅
├─ Amara: ₦10,000 ✅
├─ Kunle: ₦10,000 ✅
└─ Zainab: ₦10,000 ✅

Total collected: ₦50,000

Who receives (Turn 1):
└─ Chioma receives ₦50,000 ✅

Remaining members' turns:
├─ Turn 2: Tunde (February)
├─ Turn 3: Amara (March)
├─ Turn 4: Kunle (April)
└─ Turn 5: Zainab (May)
```

**What happens in the app:**
1. On January 1st, all 5 members get a reminder: "Your contribution of ₦10,000 is due today"
2. Each member clicks "Make Contribution" in the app
3. ₦10,000 moves from their "Available Balance" to "Locked Balance"
4. The app collects all ₦50,000
5. Chioma (Turn 1) receives ₦50,000 in her wallet
6. All members see: "Chioma received ₦50,000 on January 1st"
7. The system automatically moves to Turn 2

### **Month 2 (February)**
```
Contribution Due: February 1st

Who pays:
├─ Chioma: ₦10,000 ✅ (still in the group)
├─ Tunde: ₦10,000 ✅
├─ Amara: ₦10,000 ✅
├─ Kunle: ₦10,000 ✅
└─ Zainab: ₦10,000 ✅

Total collected: ₦50,000

Who receives (Turn 2):
└─ Tunde receives ₦50,000 ✅

Remaining members' turns:
├─ Turn 3: Amara (March)
├─ Turn 4: Kunle (April)
└─ Turn 5: Zainab (May)
```

**Key point:** Chioma already received her payout in Month 1, but she STILL has to contribute in Month 2. This is what prevents the "collect and disappear" fraud.

### **Month 3-5 (March, April, May)**
Same pattern continues. Each month:
1. Everyone contributes ₦10,000
2. One person receives ₦50,000
3. Turn automatically moves to the next person

### **After Month 5 (June)**
```
All 5 members have received their payouts:
├─ Chioma: Received ₦50,000 in January
├─ Tunde: Received ₦50,000 in February
├─ Amara: Received ₦50,000 in March
├─ Kunle: Received ₦50,000 in April
└─ Zainab: Received ₦50,000 in May

Group Status: COMPLETED ✅

What happens next:
├─ Group can restart (everyone contributes again for another 5 months)
├─ Group can disband (everyone withdraws their money)
└─ New members can join (if group restarts)
```

---

## From a User's Perspective

### **What You See in the App**

#### **1. Group Overview Screen**
```
Market Women Ajo
├─ Status: ACTIVE
├─ Members: 5
├─ Contribution: ₦10,000/month
├─ Next Contribution Due: January 1st
├─ Your Turn: Turn 1 (January)
├─ Days Until Your Payout: 0 days (You're next!)
└─ Group Progress: 1/5 cycles complete
```

#### **2. Contribution Schedule (Timeline)**
```
Turn 1: Chioma ✅ RECEIVED (January 1st)
Turn 2: Tunde ⏳ CURRENT (February 1st - waiting for contributions)
Turn 3: Amara ⏳ PENDING (March 1st)
Turn 4: Kunle ⏳ PENDING (April 1st)
Turn 5: Zainab ⏳ PENDING (May 1st)
```

#### **3. Member List with Status**
```
Chioma (Admin)
├─ Status: ✅ PAID (January)
├─ Reliability: 100%
└─ Payout Received: ₦50,000

Tunde
├─ Status: ⏳ WAITING (Due February 1st)
├─ Reliability: 100%
└─ Payout Pending: ₦50,000

Amara
├─ Status: ⏳ WAITING (Due March 1st)
├─ Reliability: 100%
└─ Payout Pending: ₦50,000

Kunle
├─ Status: ⏳ WAITING (Due April 1st)
├─ Reliability: 100%
└─ Payout Pending: ₦50,000

Zainab
├─ Status: ⏳ WAITING (Due May 1st)
├─ Reliability: 100%
└─ Payout Pending: ₦50,000
```

#### **4. Your Wallet During the Group**
```
Available Balance: ₦0
├─ Reason: You contributed ₦10,000 to the group

Locked Balance: ₦50,000
├─ Reason: You received your payout (waiting to withdraw)

Total Balance: ₦50,000
```

---

## Key Concepts

### **1. Contribution Cycle**
A contribution cycle is **one complete round** where everyone contributes once and one person receives the payout.

**Example:**
- Cycle 1: January (everyone contributes, Chioma receives)
- Cycle 2: February (everyone contributes, Tunde receives)
- Cycle 3: March (everyone contributes, Amara receives)
- etc.

### **2. Turn Order**
The turn order is the **sequence** in which members receive their payouts.

**How it's determined:**
- When you join a group, you're assigned a turn number based on when you joined
- First person to join = Turn 1
- Second person to join = Turn 2
- etc.

**Example:**
```
Chioma joined first → Turn 1 (receives in January)
Tunde joined second → Turn 2 (receives in February)
Amara joined third → Turn 3 (receives in March)
Kunle joined fourth → Turn 4 (receives in April)
Zainab joined fifth → Turn 5 (receives in May)
```

### **3. Available vs. Locked Balance**

**Available Balance:**
- Money you can withdraw to your bank account anytime
- Money NOT committed to any group
- Example: ₦5,000 you deposited but haven't used yet

**Locked Balance:**
- Money you've committed to a group
- Money you CANNOT withdraw until you receive your payout
- Example: ₦10,000 you contributed to the group

**Why locked?**
- Prevents people from taking their money and running
- Ensures everyone completes their obligations
- Protects the group

### **4. Payout**
A payout is when you **receive money** from the group.

**How it works:**
1. Everyone in the group contributes their ₦10,000
2. The app collects all ₦50,000
3. The person whose turn it is receives ₦50,000
4. Their ₦50,000 moves from "Locked Balance" to "Available Balance"
5. They can now withdraw it to their bank account

**Example:**
```
Before Payout:
├─ Available Balance: ₦0
└─ Locked Balance: ₦50,000

After Payout (you received):
├─ Available Balance: ₦50,000
└─ Locked Balance: ₦0
```

---

## Timeline Example (Real Scenario)

Let's follow Tunde's journey in the "Market Women Ajo" group:

### **January 1st - Contribution Due**
```
Tunde's Wallet:
├─ Available: ₦15,000 (money he deposited)
└─ Locked: ₦0

Tunde gets SMS: "Your contribution of ₦10,000 is due today"

Tunde clicks "Make Contribution"
├─ ₦10,000 moves from Available to Locked
├─ Tunde's Available: ₦5,000
└─ Tunde's Locked: ₦10,000

Chioma receives ₦50,000 (her turn)
```

### **January 2nd - Chioma Received Payout**
```
Tunde sees in app:
├─ "Chioma received ₦50,000 on January 1st"
├─ "Your turn: Turn 2 (February 1st)"
└─ "Days until your payout: 31 days"

Tunde's Wallet:
├─ Available: ₦5,000
└─ Locked: ₦10,000
```

### **February 1st - Tunde's Turn to Receive**
```
Tunde gets SMS: "Your contribution of ₦10,000 is due today"

Tunde clicks "Make Contribution"
├─ ₦10,000 moves from Available to Locked
├─ But wait... Tunde only has ₦5,000 available!
└─ Tunde needs to deposit ₦5,000 more first

Tunde deposits ₦5,000 via card
├─ Available: ₦5,000 (new deposit)
└─ Total Available: ₦10,000

Tunde clicks "Make Contribution"
├─ ₦10,000 moves from Available to Locked
├─ Tunde's Available: ₦0
└─ Tunde's Locked: ₦20,000

Everyone contributed ✅
Tunde receives ₦50,000 (his turn!)
├─ Tunde's Available: ₦50,000
└─ Tunde's Locked: ₦10,000 (still owes for March, April, May)

Tunde gets SMS: "You received ₦50,000! You can now withdraw to your bank account"
```

### **February 2nd - Tunde Withdraws**
```
Tunde clicks "Withdraw"
├─ Amount: ₦50,000
├─ Bank Account: Tunde's GTBank account
├─ Fee: ₦100
└─ Total Deducted: ₦50,100

Tunde's Wallet:
├─ Available: ₦0 (he withdrew everything)
└─ Locked: ₦10,000 (still committed to group)

Money arrives in Tunde's bank account within 1-2 hours
```

### **March 1st - Tunde Contributes Again**
```
Tunde gets SMS: "Your contribution of ₦10,000 is due today"

But Tunde's Available Balance is ₦0!
He needs to deposit ₦10,000 first

Tunde deposits ₦10,000 via card
├─ Available: ₦10,000
└─ Tunde clicks "Make Contribution"

Amara receives ₦50,000 (her turn)
```

### **April 1st & May 1st - Same Pattern**
```
Tunde continues contributing ₦10,000 each month
Kunle receives in April
Zainab receives in May
```

### **June 1st - Group Completes**
```
All 5 members have received their payouts ✅

Group Status: COMPLETED

What Tunde earned:
├─ Received: ₦50,000 (February)
├─ Contributed: ₦50,000 (₦10,000 × 5 months)
└─ Net: ₦0 (he got back what he put in)

But Tunde built:
├─ Reliability Score: 100% (paid on time every month)
├─ Savings History: ₦50,000 saved over 5 months
└─ Trust: Can join more groups or get loans in future
```

---

## What Happens If Someone Doesn't Pay

### **Scenario: Kunle Misses His Contribution**

```
April 1st - Contribution Due
├─ Kunle gets SMS reminder
├─ Kunle ignores it
└─ Kunle doesn't pay

April 2nd - 1 Day Late
├─ Kunle gets SMS: "You're 1 day late on ₦10,000"
├─ In-app warning appears
└─ Group members see: "Kunle is LATE"

April 8th - 7 Days Late
├─ Kunle still hasn't paid
├─ Kunle gets SMS: "You're 7 days late. Pay immediately"
├─ Kunle's account flagged as "At Risk"
└─ Kunle CANNOT join new groups

April 15th - 14 Days Late
├─ Kunle still hasn't paid
├─ Kunle gets SMS: "URGENT: You're 14 days late"
├─ Kunle's name + phone visible to all group members
├─ Kunle's account flagged as "DEFAULTER"
├─ Kunle CANNOT create new groups
├─ Penalty: ₦1,000 + 10% of contribution (₦1,000)
└─ Total penalty: ₦2,000

May 1st - 30 Days Late
├─ Kunle still hasn't paid
├─ Kunle gets SMS: "FINAL NOTICE: Your account will be reported to credit bureaus"
├─ Kunle's name + phone + default amount publicly listed on Ajosave
├─ Kunle CANNOT withdraw funds
├─ Kunle's account flagged as "CHRONIC DEFAULTER"
├─ Reported to credit bureaus
├─ Reported to partner banks
├─ Penalty: ₦2,000 + 15% of contribution (₦1,500)
└─ Total penalty: ₦3,500

June 1st - 60 Days Late
├─ Kunle still hasn't paid
├─ Kunle's account PERMANENTLY BLACKLISTED
├─ Kunle's bank account BLOCKED
├─ Kunle CANNOT use Ajosave anymore
├─ Reported to debt collection agencies
├─ Penalty: ₦5,000 + 20% of contribution (₦2,000)
└─ Total penalty: ₦7,000

What Kunle owes:
├─ Original contribution: ₦10,000
├─ Penalties: ₦7,000
└─ Total: ₦17,000

If Kunle pays on June 1st:
├─ Account unlocked immediately
├─ Bank account unblocked
├─ Can rejoin groups
├─ Public listing removed
└─ Back to Level 0
```

---

## Contribution Frequency Options

The rotation system supports different contribution frequencies:

### **Weekly**
```
Group: "Weekly Savers"
├─ Contribution: ₦5,000/week
├─ Frequency: Every Monday
├─ Cycle Duration: 5 weeks (for 5 members)
├─ Payout per cycle: ₦25,000
└─ Total group size: 5 members

Timeline:
├─ Week 1 (Jan 1): Everyone pays ₦5,000 → Member 1 receives ₦25,000
├─ Week 2 (Jan 8): Everyone pays ₦5,000 → Member 2 receives ₦25,000
├─ Week 3 (Jan 15): Everyone pays ₦5,000 → Member 3 receives ₦25,000
├─ Week 4 (Jan 22): Everyone pays ₦5,000 → Member 4 receives ₦25,000
└─ Week 5 (Jan 29): Everyone pays ₦5,000 → Member 5 receives ₦25,000
```

### **Monthly**
```
Group: "Market Women Ajo"
├─ Contribution: ₦10,000/month
├─ Frequency: 1st of every month
├─ Cycle Duration: 5 months (for 5 members)
├─ Payout per cycle: ₦50,000
└─ Total group size: 5 members
```

### **Quarterly**
```
Group: "Business Owners"
├─ Contribution: ₦50,000/quarter
├─ Frequency: Every 3 months
├─ Cycle Duration: 15 months (for 5 members)
├─ Payout per cycle: ₦250,000
└─ Total group size: 5 members
```

---

## Joining a Group Mid-Cycle

What if you want to join a group that's already started?

### **Scenario: Zainab Joins in Month 3**

```
Original Group (Market Women Ajo):
├─ Month 1: Chioma received ✅
├─ Month 2: Tunde received ✅
├─ Month 3: Amara receiving (current)
├─ Month 4: Kunle (pending)
└─ Month 5: Zainab (pending)

Zainab wants to join in Month 3

What happens:
├─ Zainab is added to the group
├─ Zainab is assigned Turn 6 (after the original 5)
├─ Zainab must contribute ₦10,000 in Month 3 (even though she just joined)
├─ Zainab will receive her payout in Month 6 (after everyone else)
└─ Zainab's payout: ₦60,000 (6 people × ₦10,000)

New Timeline:
├─ Month 1: Chioma received ✅
├─ Month 2: Tunde received ✅
├─ Month 3: Amara received ✅
├─ Month 4: Kunle receives
├─ Month 5: Original Zainab receives
└─ Month 6: New Zainab receives ₦60,000

Why does new Zainab get ₦60,000?
├─ She contributes ₦10,000 in Month 3
├─ She contributes ₦10,000 in Month 4
├─ She contributes ₦10,000 in Month 5
├─ She contributes ₦10,000 in Month 6
├─ Plus 2 more members' contributions (₦20,000)
└─ Total: ₦60,000
```

---

## Leaving a Group

### **Before Your Turn**
```
Scenario: Kunle wants to leave before his turn (April)

What happens:
├─ Kunle's locked balance (₦30,000) is refunded to available balance
├─ Kunle is removed from the group
├─ Kunle's turn is skipped
├─ Group continues without him

New Timeline:
├─ Month 1: Chioma received ✅
├─ Month 2: Tunde received ✅
├─ Month 3: Amara received ✅
├─ Month 4: Zainab receives (Kunle's turn skipped)
└─ Group completes

Kunle's Wallet:
├─ Available: ₦30,000 (refunded)
└─ Locked: ₦0
```

### **After Your Turn**
```
Scenario: Kunle wants to leave after his turn (May)

What happens:
├─ Kunle has already received his payout
├─ Kunle still owes contributions for remaining months
├─ Kunle CANNOT leave until group completes
├─ If Kunle tries to leave, his account is flagged
└─ Kunle must complete his obligations

Why?
├─ If Kunle leaves, Zainab won't receive her full payout
├─ Zainab would only get ₦40,000 instead of ₦50,000
└─ This breaks the group
```

---

## Automatic Reminders

The system automatically sends reminders at key times:

### **Contribution Reminders**
```
7 days before due date:
├─ SMS: "Your contribution of ₦10,000 is due in 7 days"
└─ In-app notification

3 days before due date:
├─ SMS: "Your contribution of ₦10,000 is due in 3 days"
└─ In-app notification

1 day before due date:
├─ SMS: "Your contribution of ₦10,000 is due tomorrow"
└─ Push notification (mobile app)

On due date:
├─ SMS: "Your contribution of ₦10,000 is due today"
├─ Push notification (mobile app)
└─ In-app notification
```

### **Payout Reminders**
```
When it's your turn:
├─ SMS: "It's your turn! You'll receive ₦50,000 when everyone contributes"
├─ Push notification (mobile app)
└─ In-app notification

When everyone has contributed:
├─ SMS: "You received ₦50,000! You can now withdraw to your bank account"
├─ Push notification (mobile app)
└─ In-app notification
```

---

## Group Admin Controls

If you create a group, you're the admin. You can:

### **Send Reminders**
```
You can send custom reminders to members:
├─ "Please pay your contribution, it's due tomorrow"
├─ "We're waiting for 2 more members to pay"
└─ "Great job everyone! We're on track"
```

### **View Group Reports**
```
You can see:
├─ Total contributions collected
├─ Pending contributions by member
├─ Member statistics (on-time rate, average contribution)
├─ Payout history with dates and recipients
└─ Group audit log (all actions)
```

### **Pause/Resume Group**
```
You can pause the group temporarily:
├─ No new contributions required
├─ No payouts processed
├─ Members notified
└─ Can resume anytime

Example: Group paused for 2 months due to economic hardship
```

### **Remove Members**
```
You can remove members who haven't contributed for 2 consecutive cycles:
├─ Their locked balance is refunded
├─ Their turn is skipped
├─ Group continues without them
└─ They're notified
```

---

## Data Model

### **Group Schema**
```javascript
{
  _id: ObjectId,
  name: String, // "Market Women Ajo"
  admin: ObjectId, // User ID of creator
  members: [
    {
      userId: ObjectId,
      joinedAt: Date,
      turnNumber: Number, // 1, 2, 3, 4, 5
      status: String, // "active", "removed", "completed"
      contributionHistory: [
        {
          cycleNumber: Number,
          dueDate: Date,
          paidDate: Date,
          amount: Number,
          status: String // "on-time", "late", "missed"
        }
      ],
      payoutHistory: [
        {
          cycleNumber: Number,
          receivedDate: Date,
          amount: Number
        }
      ]
    }
  ],
  contributionAmount: Number, // ₦10,000
  frequency: String, // "weekly", "monthly", "quarterly"
  startDate: Date,
  currentCycle: Number, // Which cycle are we on?
  currentTurn: Number, // Whose turn is it?
  status: String, // "active", "paused", "completed"
  totalContributed: Number,
  totalPayedOut: Number
}
```

---

## Success Metrics

A successful rotation system means:

- ✅ 99%+ on-time contribution rate
- ✅ 100% of payouts processed correctly
- ✅ Zero fraud or missing funds
- ✅ All members receive their payouts
- ✅ Complete transparency (everyone sees everything)
- ✅ Automatic enforcement (no manual intervention needed)

---

## Conclusion

The Ajosave rotation system is designed to **automate and secure** the traditional Ajo process. It removes the need for a trusted treasurer, eliminates fraud, and ensures everyone gets their money. The system is **transparent, fair, and automatic**—exactly what traditional Ajo needed all along.
