# HeliosHash DAO - Database Schema Finalization Guide

## 📋 CURRENT SCHEMA STATUS

### Reviewed Models (874 lines)

- ✅ User (with KYC integration)
- ✅ SolarProject
- ✅ ProjectApplication
- ✅ DAOProposal (basic)
- ✅ NFT
- ✅ MiningReward
- ✅ CommunityPost
- ✅ Comment

### Status: **READY FOR FINALIZATION**

---

## 🔧 SCHEMA ENHANCEMENTS NEEDED

### 1. ENHANCE DAOProposal Model

**Current Issues**:

- Limited voting structure
- No milestone tracking
- No execution tracking
- Missing timeline fields

**Enhancement**:

```prisma
model DAOProposal {
  id                    String    @id @default(cuid())

  // Core proposal info
  title                 String
  description           String
  category              ProposalCategory  // governance, funding, parameter, emergency

  // Creator & status
  creatorId             String
  creator               User      @relation("ProposalCreator", fields: [creatorId], references: [id])
  status                ProposalStatus  @default(PENDING)  // PENDING, ACTIVE, VOTING, CLOSED, EXECUTING, EXECUTED, FAILED

  // Voting structure - ENHANCED
  votingOptions         VotingOption[]    // NEW: One-to-many relationship
  proposalVotes         ProposalVote[]
  votingStartTime       DateTime
  votingEndTime         DateTime
  votingPeriod          Int               // in seconds
  minimumQuorum         Int               // minimum votes needed
  supportThreshold      Int               // percentage needed to pass

  // Execution tracking - NEW
  executionData         Json?             // flexible schema for execution params
  executionStatus       ExecutionStatus?  @default(PENDING)
  executionStarted      DateTime?
  executionCompleted    DateTime?
  executionResult       String?

  // Timeline - NEW
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  publishedAt           DateTime?

  // Milestones - NEW
  milestones            Milestone[]

  // Treasury allocation - NEW
  budgetAllocated       Float?
  fundingSource         String?           // treasury, external, etc.

  // Metadata
  tags                  String[]          @default([])
  priority              Int               @default(0)

  @@map("dao_proposals")
}

model VotingOption {
  id                    String    @id @default(cuid())
  proposalId            String
  proposal              DAOProposal @relation(fields: [proposalId], references: [id], onDelete: Cascade)

  optionIndex           Int
  title                 String
  description           String?
  voteCount             Int       @default(0)
  percentage            Float     @default(0.0)

  createdAt             DateTime  @default(now())

  @@unique([proposalId, optionIndex])
  @@map("voting_options")
}

model Milestone {
  id                    String    @id @default(cuid())
  proposalId            String
  proposal              DAOProposal @relation(fields: [proposalId], references: [id], onDelete: Cascade)

  name                  String
  description           String?
  targetDate            DateTime?
  completionDate        DateTime?
  fundingAmount         Float?
  status                MilestoneStatus @default(PENDING)

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@map("milestones")
}
```

### 2. ADD Transaction Model (NEW)

```prisma
model Transaction {
  id                    String    @id @default(cuid())

  // Transaction details
  transactionType       TransactionType  // TRANSFER, MINT, BURN, STAKE, UNSTAKE, REWARD, GRANT, ALLOCATION
  status                TransactionStatus @default(PENDING)

  // Parties
  fromId                String
  from                  User      @relation("TransactionFrom", fields: [fromId], references: [id])
  toId                  String
  to                    User      @relation("TransactionTo", fields: [toId], references: [id])

  // Amount
  amount                Decimal   @db.Decimal(18, 8)
  currency              String    @default("HHU")  // HHU, USD, etc.

  // Metadata
  description           String?
  reference             String?           // proposal ID, grant ID, etc.
  metadata              Json?

  // Blockchain
  canisterId            String?
  blockchainTxId        String?
  blockchainConfirmed   Boolean   @default(false)

  // Fees
  gasFee                Decimal?  @db.Decimal(18, 8)
  networkFee            Decimal?  @db.Decimal(18, 8)

  // Timestamps
  createdAt             DateTime  @default(now())
  confirmedAt           DateTime?

  @@index([fromId])
  @@index([toId])
  @@index([status])
  @@index([createdAt])
  @@map("transactions")
}
```

### 3. ADD Dispute Model (NEW)

```prisma
model Dispute {
  id                    String    @id @default(cuid())

  // Parties
  plaintiffId           String
  plaintiff             User      @relation("DisputePlaintiff", fields: [plaintiffId], references: [id])
  defendantId           String
  defendant             User      @relation("DisputeDefendant", fields: [defendantId], references: [id])

  // Case details
  title                 String
  description           String
  reason                DisputeReason
  status                DisputeStatus @default(FILED)
  priority              Int       @default(0)

  // Arbitration
  arbiterId             String?
  arbiter               User?     @relation("DisputeArbiter", fields: [arbiterId], references: [id])
  arbitrationDate       DateTime?

  // Resolution
  decision              String?
  reasoning             String?
  resolution            ResolutionType?
  resolvedAt            DateTime?

  // Appeals
  appealed              Boolean   @default(false)
  appealCount           Int       @default(0)
  lastAppealDate        DateTime?

  // Amounts
  claimedAmount         Decimal?  @db.Decimal(18, 8)
  awardedAmount         Decimal?  @db.Decimal(18, 8)

  // Timeline
  filedAt               DateTime  @default(now())
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([status])
  @@index([plaintiffId])
  @@index([defendantId])
  @@map("disputes")
}
```

### 4. ADD Voting Model Enhancement

```prisma
model ProposalVote {
  id                    String    @id @default(cuid())
  proposalId            String
  proposal              DAOProposal @relation(fields: [proposalId], references: [id], onDelete: Cascade)
  voterId               String
  voter                 User      @relation(fields: [voterId], references: [id])

  // Vote details
  optionIndex           Int
  optionTitle           String    // denormalized for clarity
  votingPower           Int       // voting power at time of vote
  reason                String?   // optional explanation

  // Metadata
  canisterConfirmed     Boolean   @default(false)
  blockchainTxId        String?

  createdAt             DateTime  @default(now())

  @@unique([proposalId, voterId])  // one vote per person per proposal
  @@index([voterId])
  @@map("proposal_votes")
}
```

### 5. ENHANCE Reward Models

```prisma
model MiningReward {
  id                    String    @id @default(cuid())
  userId                String
  user                  User      @relation(fields: [userId], references: [id])

  // Reward details
  rewardType            RewardType @default(MINING)
  amount                Decimal   @db.Decimal(18, 8)
  period                String    // "2025-11", format: YYYY-MM
  status                RewardStatus @default(EARNED)

  // Metadata
  reference             String?   // project ID, activity ID, etc.
  metadata              Json?

  // Blockchain
  claimedAt             DateTime?
  claimTxId             String?

  // Timestamps
  earnedAt              DateTime  @default(now())
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@index([earnedAt])
  @@map("mining_rewards")
}

model Staking {
  id                    String    @id @default(cuid())
  userId                String
  user                  User      @relation(fields: [userId], references: [id])

  // Staking details
  amount                Decimal   @db.Decimal(18, 8)
  stakedAt              DateTime  @default(now())
  unstakedAt            DateTime?
  status                StakingStatus @default(ACTIVE)

  // Rewards
  rewardsAccrued        Decimal   @default(0) @db.Decimal(18, 8)
  lastRewardCalculation DateTime?

  // Blockchain
  canisterStakeId       String?

  @@index([userId])
  @@index([status])
  @@map("staking")
}
```

### 6. ADD Grant Management Model

```prisma
model MicroGrant {
  id                    String    @id @default(cuid())

  // Grant details
  title                 String
  description           String
  totalAmount           Decimal   @db.Decimal(18, 8)
  amountPerApplication  Decimal   @db.Decimal(18, 8)
  maxApplications       Int

  // Eligibility
  criteria              Json
  requirementsText      String

  // Timeline
  applicationStartDate  DateTime
  applicationEndDate    DateTime
  status                GrantStatus @default(OPEN)

  // Administration
  managerId             String
  manager               User      @relation(fields: [managerId], references: [id])

  // Application tracking
  applications          GrantApplication[]

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([status])
  @@map("micro_grants")
}

model GrantApplication {
  id                    String    @id @default(cuid())
  grantId               String
  grant                 MicroGrant @relation(fields: [grantId], references: [id])

  // Applicant
  applicantId           String
  applicant             User      @relation(fields: [applicantId], references: [id])

  // Application details
  purpose               String
  justification         String
  expectedOutcome       String
  documentPath          String?

  // Status
  status                ApplicationStatus @default(SUBMITTED)
  reviewedAt            DateTime?
  reviewedBy            String?

  // Amount
  requestedAmount       Decimal   @db.Decimal(18, 8)
  approvedAmount        Decimal?  @db.Decimal(18, 8)
  distributedAt         DateTime?

  // Impact tracking
  impactMetrics         ImpactMetric[]

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([status])
  @@index([applicantId])
  @@map("grant_applications")
}

model ImpactMetric {
  id                    String    @id @default(cuid())
  applicationId         String
  application           GrantApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  metricName            String
  expectedValue         Float
  actualValue           Float?
  unit                  String?
  reportedAt            DateTime?

  @@map("impact_metrics")
}
```

---

## 🔄 ENUM DEFINITIONS

```prisma
enum ProposalStatus {
  PENDING
  ACTIVE
  VOTING
  CLOSED
  EXECUTING
  EXECUTED
  FAILED
  CANCELLED
}

enum ExecutionStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
}

enum MilestoneStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
  CANCELLED
}

enum TransactionType {
  TRANSFER
  MINT
  BURN
  STAKE
  UNSTAKE
  REWARD
  GRANT
  ALLOCATION
  REFUND
}

enum TransactionStatus {
  PENDING
  CONFIRMED
  FAILED
  CANCELLED
}

enum DisputeStatus {
  FILED
  UNDER_REVIEW
  ARBITRATION_PENDING
  ARBITRATION_IN_PROGRESS
  RESOLVED
  APPEALED
  DISMISSED
}

enum DisputeReason {
  PAYMENT_DISPUTE
  QUALITY_ISSUE
  DELIVERY_FAILURE
  FRAUD
  OTHER
}

enum ResolutionType {
  PLAINTIFF_WIN
  DEFENDANT_WIN
  SETTLEMENT
  DISMISSED
}

enum RewardType {
  MINING
  STAKING
  PARTICIPATION
  REFERRAL
  GRANT
}

enum RewardStatus {
  EARNED
  PENDING_CLAIM
  CLAIMED
  FORFEITED
}

enum StakingStatus {
  ACTIVE
  UNSTAKING
  UNSTAKED
  PAUSED
}

enum GrantStatus {
  DRAFT
  OPEN
  CLOSED
  PAUSED
  ARCHIVED
}

enum ApplicationStatus {
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  REJECTED
  DISTRIBUTED
  COMPLETED
}

enum ProposalCategory {
  GOVERNANCE
  FUNDING
  PARAMETER
  EMERGENCY
  OTHER
}
```

---

## 📊 MIGRATION STRATEGY

### Phase 1: Preparation

1. **Backup current database**

   ```bash
   sqlite3 prisma/dev.db ".backup backup.db"
   ```

2. **Create new schema file**
   ```bash
   cp prisma/schema.prisma prisma/schema.prisma.backup
   ```

### Phase 2: Add New Models

1. Update `prisma/schema.prisma` with new models
2. Run validation: `prisma validate`
3. Create migration: `prisma migrate dev --name add_advanced_models`

### Phase 3: Deploy Changes

1. **Development**

   ```bash
   pnpm exec prisma migrate dev
   ```

2. **Staging/Production**

   ```bash
   pnpm exec prisma migrate deploy
   ```

3. **Verify schema**
   ```bash
   pnpm exec prisma studio
   ```

---

## ✅ VALIDATION CHECKLIST

- [ ] All enum values documented
- [ ] Relationships properly defined
- [ ] Indexes created for frequently queried fields
- [ ] Cascade delete behavior specified
- [ ] Default values set appropriately
- [ ] Unique constraints defined
- [ ] No circular dependencies
- [ ] Performance considered (denormalization where needed)
- [ ] Migration tested on development database
- [ ] Rollback plan documented

---

## 📝 NEXT STEPS

1. **Review and approve schema changes**
2. **Backup current database**
3. **Create and test migrations**
4. **Update backend services to use new models**
5. **Create API endpoints for new models**
6. **Update frontend to handle new data**
7. **Run end-to-end tests**
8. **Deploy to staging environment**

---

**Document Version**: 1.0
**Status**: Ready for Implementation
**Last Updated**: November 2, 2025
