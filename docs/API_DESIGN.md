# HeliosHash DAO - API Design & Implementation Guide

## 📋 TABLE OF CONTENTS

1. [Architecture Overview](#architecture-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Core API Endpoints](#core-api-endpoints)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Implementation Guide](#implementation-guide)

---

## 🏗️ ARCHITECTURE OVERVIEW

### Technology Stack

- **Framework**: Express.js (Node.js)
- **Database**: SQLite + Prisma ORM
- **Authentication**: JWT + Internet Identity
- **Smart Contracts**: Motoko (Internet Computer)
- **API Documentation**: OpenAPI/Swagger

### API Layers

```
┌─────────────────────────────────────────┐
│         Frontend (React/Next.js)        │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│    API Gateway (Express Middleware)     │
│  - Authentication                       │
│  - Rate Limiting                        │
│  - Request Validation                   │
│  - Error Handling                       │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│     Service Layer (Business Logic)      │
│  - User Management                      │
│  - Proposal Processing                  │
│  - Treasury Management                  │
│  - Canister Integration                 │
└──────────────────┬──────────────────────┘
                   │
       ┌───────────┼───────────┐
       │           │           │
   ┌───▼──┐   ┌────▼───┐ ┌────▼────┐
   │Prisma│   │Canisters│ │External │
   │ ORM  │   │(IC)     │ │Services │
   └──────┘   └─────────┘ └─────────┘
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Authentication Flow

```
1. User Registration/Login
   ├─ Internet Identity (Principal)
   ├─ Email/Password (Optional)
   └─ Wallet Connection

2. JWT Token Generation
   ├─ Access Token (15 min)
   ├─ Refresh Token (7 days)
   └─ Stored securely

3. Request Authorization
   ├─ Token verification
   ├─ Role-based access control (RBAC)
   └─ Resource-level permissions
```

### Authorization Levels

```
Admin
├── Create proposals
├── Manage treasury
├── Update parameters
└── View all disputes

DAO Member
├── Vote on proposals
├── Submit proposals
├── Request funds
└── View own data

Verified User
├── Create projects
├── Participate in grants
├── Transfer tokens
└── View public data

Unverified User
└── Limited read access
```

---

## 📡 CORE API ENDPOINTS

### 1. AUTHENTICATION ENDPOINTS

#### `POST /api/v1/auth/register`

Register new user with Internet Identity

**Request**

```json
{
  "principal": "v57e3-4u4nf-...",
  "name": "John Doe",
  "email": "john@example.com",
  "walletAddress": "1a2b3c4d..."
}
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "userId": "user_12345",
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "user_12345",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "member"
    }
  }
}
```

#### `POST /api/v1/auth/login`

Authenticate existing user

**Request**

```json
{
  "principal": "v57e3-4u4nf-...",
  "signature": "0x1234..."
}
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900
  }
}
```

### 2. USER MANAGEMENT ENDPOINTS

#### `GET /api/v1/users/:userId`

Get user profile

**Query Parameters**

```
include=balance,rewards,kycStatus
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "id": "user_12345",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "member",
    "kycStatus": "verified",
    "balance": 5000,
    "rewards": 250,
    "createdAt": "2025-11-01T10:00:00Z"
  }
}
```

#### `PUT /api/v1/users/:userId`

Update user profile

**Request**

```json
{
  "name": "John Updated",
  "phoneNumber": "+1234567890",
  "country": "US"
}
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "id": "user_12345",
    "updated": true,
    "fields": ["name", "phoneNumber", "country"]
  }
}
```

#### `POST /api/v1/users/:userId/kyc/verify`

Submit KYC verification

**Request**

```json
{
  "provider": "onfido",
  "documentType": "passport",
  "documentNumber": "AB123456",
  "dateOfBirth": "1990-01-15"
}
```

**Response (202)**

```json
{
  "success": true,
  "data": {
    "verificationId": "verif_12345",
    "status": "pending",
    "estimatedTime": "24-48 hours"
  }
}
```

### 3. TOKEN ENDPOINTS

#### `POST /api/v1/tokens/transfer`

Transfer HHU tokens

**Request**

```json
{
  "to": "recipient_principal_id",
  "amount": 100,
  "memo": "Payment for services"
}
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "transactionId": "tx_12345",
    "from": "user_123",
    "to": "recipient_id",
    "amount": 100,
    "status": "confirmed",
    "timestamp": "2025-11-02T15:30:00Z"
  }
}
```

#### `GET /api/v1/tokens/balance/:address`

Get token balance

**Response (200)**

```json
{
  "success": true,
  "data": {
    "address": "principal_id",
    "balance": 5000,
    "staked": 1000,
    "available": 4000,
    "decimals": 8,
    "lastUpdated": "2025-11-02T15:25:00Z"
  }
}
```

### 4. PROPOSAL ENDPOINTS

#### `POST /api/v1/proposals`

Create new proposal

**Request**

```json
{
  "title": "Allocate 50k HHU to Solar Project Alpha",
  "description": "Detailed description...",
  "options": ["Approve allocation", "Modify amount to 30k", "Reject proposal"],
  "votingPeriod": 604800,
  "executionData": {
    "projectId": "proj_123",
    "amount": 50000
  }
}
```

**Response (201)**

```json
{
  "success": true,
  "data": {
    "proposalId": "prop_12345",
    "creator": "user_123",
    "status": "active",
    "startTime": "2025-11-02T15:30:00Z",
    "endTime": "2025-11-09T15:30:00Z",
    "votes": {
      "option1": 0,
      "option2": 0,
      "option3": 0
    }
  }
}
```

#### `POST /api/v1/proposals/:proposalId/vote`

Cast vote on proposal

**Request**

```json
{
  "optionIndex": 0,
  "reason": "This allocation aligns with our Q4 goals"
}
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "proposalId": "prop_12345",
    "voter": "user_456",
    "vote": "option1",
    "votingPower": 1000,
    "timestamp": "2025-11-02T16:00:00Z"
  }
}
```

#### `GET /api/v1/proposals/:proposalId/results`

Get real-time voting results

**Response (200)**

```json
{
  "success": true,
  "data": {
    "proposalId": "prop_12345",
    "title": "Allocate 50k HHU to Solar Project Alpha",
    "status": "active",
    "totalVoters": 245,
    "totalVotes": 189,
    "participation": "77%",
    "votes": {
      "Approve allocation": {
        "count": 150,
        "percentage": "79%",
        "voters": ["user_123", "user_456", "..."]
      },
      "Modify amount to 30k": {
        "count": 30,
        "percentage": "16%"
      },
      "Reject proposal": {
        "count": 9,
        "percentage": "5%"
      }
    },
    "timeRemaining": 172800,
    "winningOption": "Approve allocation"
  }
}
```

### 5. TREASURY ENDPOINTS

#### `GET /api/v1/treasury/balance`

Get treasury balance

**Response (200)**

```json
{
  "success": true,
  "data": {
    "balance": 500000,
    "currency": "HHU",
    "lastUpdated": "2025-11-02T15:30:00Z",
    "allocations": {
      "projects": 200000,
      "reserves": 150000,
      "operations": 100000,
      "rewards": 50000
    }
  }
}
```

#### `POST /api/v1/treasury/allocate`

Allocate funds from treasury

**Request**

```json
{
  "projectId": "proj_123",
  "amount": 50000,
  "reason": "Q4 project funding",
  "milestones": [
    { "name": "Phase 1", "releaseAmount": 20000 },
    { "name": "Phase 2", "releaseAmount": 30000 }
  ]
}
```

**Response (201)**

```json
{
  "success": true,
  "data": {
    "allocationId": "alloc_12345",
    "projectId": "proj_123",
    "amount": 50000,
    "status": "approved",
    "createdAt": "2025-11-02T15:30:00Z"
  }
}
```

### 6. PROJECT ENDPOINTS

#### `POST /api/v1/projects`

Create new project

**Request**

```json
{
  "name": "Solar Farm Alpha",
  "description": "5MW solar farm in rural area",
  "category": "solar",
  "location": {
    "state": "Karnataka",
    "city": "Bangalore",
    "coordinates": [12.9716, 77.5946]
  },
  "fundingGoal": 1000000,
  "timeline": {
    "startDate": "2025-12-01",
    "completionDate": "2026-12-01"
  },
  "impact": {
    "co2Reduction": 5000,
    "jobs": 150,
    "energyGeneration": 8000
  }
}
```

**Response (201)**

```json
{
  "success": true,
  "data": {
    "projectId": "proj_12345",
    "name": "Solar Farm Alpha",
    "status": "active",
    "fundingRaised": 0,
    "fundingGoal": 1000000,
    "createdAt": "2025-11-02T15:30:00Z"
  }
}
```

#### `POST /api/v1/projects/:projectId/fund`

Fund a project

**Request**

```json
{
  "amount": 5000,
  "funderId": "user_123"
}
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "fundingId": "fund_12345",
    "projectId": "proj_123",
    "amount": 5000,
    "fundingRaised": 125000,
    "progress": "12.5%",
    "timestamp": "2025-11-02T15:30:00Z"
  }
}
```

### 7. GRANT ENDPOINTS

#### `POST /api/v1/grants/apply`

Apply for micro grant

**Request**

```json
{
  "grantId": "grant_123",
  "amount": 5000,
  "purpose": "Community education program",
  "justification": "Detailed explanation...",
  "expectedOutcome": "Train 100 youth"
}
```

**Response (201)**

```json
{
  "success": true,
  "data": {
    "applicationId": "app_12345",
    "grantId": "grant_123",
    "amount": 5000,
    "status": "submitted",
    "createdAt": "2025-11-02T15:30:00Z"
  }
}
```

#### `GET /api/v1/grants/:grantId/impact`

Get grant impact metrics

**Response (200)**

```json
{
  "success": true,
  "data": {
    "grantId": "grant_123",
    "amount": 5000,
    "status": "completed",
    "metrics": {
      "peopleReached": 150,
      "expectedVsActual": "150% of target",
      "communityRating": 4.8,
      "sustainabilityScore": 8.5
    }
  }
}
```

---

## 📊 DATA MODELS

### User Model

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  principal: string;
  walletAddress?: string;
  role: "admin" | "member" | "user";
  kycStatus: "not_verified" | "pending" | "verified" | "rejected";
  balance: number;
  stakingBalance: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Proposal Model

```typescript
interface Proposal {
  id: string;
  creator: string;
  title: string;
  description: string;
  options: string[];
  votes: Record<string, number>;
  status: "pending" | "active" | "closed" | "executed" | "failed";
  startTime: Date;
  endTime: Date;
  executionData: Record<string, any>;
  createdAt: Date;
}
```

### Treasury Model

```typescript
interface Treasury {
  id: string;
  balance: number;
  allocations: {
    projects: number;
    reserves: number;
    operations: number;
    rewards: number;
  };
  transactionHistory: Transaction[];
  lastUpdated: Date;
}
```

---

## ⚠️ ERROR HANDLING

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "User not found",
    "details": {
      "userId": "user_12345"
    }
  },
  "timestamp": "2025-11-02T15:30:00Z"
}
```

### Common Error Codes

| Code            | Status | Meaning                    |
| --------------- | ------ | -------------------------- |
| INVALID_REQUEST | 400    | Invalid request parameters |
| UNAUTHORIZED    | 401    | Authentication required    |
| FORBIDDEN       | 403    | Insufficient permissions   |
| NOT_FOUND       | 404    | Resource not found         |
| CONFLICT        | 409    | Resource already exists    |
| RATE_LIMIT      | 429    | Too many requests          |
| INTERNAL_ERROR  | 500    | Server error               |
| CANISTER_ERROR  | 502    | Smart contract error       |

---

## 🚀 IMPLEMENTATION GUIDE

### Step 1: Project Setup

```bash
cd apps/backend
npm install express cors dotenv prisma
npx prisma init
```

### Step 2: Create API Structure

```
src/
├── config/
│   ├── database.ts
│   └── auth.ts
├── middleware/
│   ├── auth.ts
│   ├── validation.ts
│   └── errorHandler.ts
├── routes/
│   ├── auth.ts
│   ├── users.ts
│   ├── proposals.ts
│   ├── treasury.ts
│   └── projects.ts
├── services/
│   ├── userService.ts
│   ├── proposalService.ts
│   └── caniesterService.ts
├── controllers/
│   ├── authController.ts
│   ├── userController.ts
│   └── proposalController.ts
└── app.ts
```

### Step 3: Implement Core Endpoints

- Start with authentication
- Build user management
- Add proposal system
- Integrate canisters

### Step 4: Testing

- Unit tests for services
- Integration tests for APIs
- End-to-end testing
- Load testing

---

**Document Version**: 1.0
**Last Updated**: November 2, 2025
**Status**: Ready for Implementation
