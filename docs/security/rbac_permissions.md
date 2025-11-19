# HeliosHash DAO - Role-Based Access Control (RBAC) & Permissions

## Overview

This document outlines the privileged roles, permissions, and access controls implemented across the HeliosHash DAO ecosystem, following the principle of least privilege.

## Core Principles

1. **Least Privilege**: Each role has only the minimum permissions required for its function
2. **Separation of Concerns**: Different roles handle different aspects of treasury and governance
3. **Multi-Authorization**: Critical operations require multiple approvals
4. **Auditability**: All privileged operations are logged and auditable

## Role Definitions

### 1. DAO Canister (Highest Privilege)
**Principal**: Configured during deployment via `setDaoCanister()`

**Permissions**:
- ✅ Mint new OWP tokens (`mint()`)
- ✅ Burn OWP tokens (`burn()`)
- ✅ Configure treasury settings (identity, multisig, governance canisters)
- ✅ Emergency pause/resume treasury operations
- ✅ Sync identity balances
- ❌ Cannot transfer tokens directly (must use multisig for large amounts)
- ❌ Cannot modify governance rules

**Rationale**: DAO represents community governance, can create/destroy tokens but cannot unilaterally move funds.

### 2. Governance Canister (Emergency Control)
**Principal**: Configured during deployment via `setGovernanceCanister()`

**Permissions**:
- ✅ Emergency pause/resume treasury operations
- ✅ Create and execute governance proposals
- ✅ Vote on proposals with quadratic/conviction voting
- ✅ Delegate voting power
- ❌ Cannot mint/burn tokens
- ❌ Cannot transfer tokens
- ❌ Cannot modify treasury configuration

**Rationale**: Governance handles emergency situations and community decision-making but cannot directly manipulate token supply or funds.

### 3. Multisig Guardians (Fund Movement)
**Principals**: 5 guardians configured in multisig canister

**Permissions** (3-of-5 threshold):
- ✅ Approve large transfers (>1M OWP)
- ✅ Execute approved transfer proposals
- ✅ Emergency pause multisig operations
- ❌ Cannot mint/burn tokens
- ❌ Cannot modify treasury configuration
- ❌ Cannot access treasury directly

**Rationale**: Multisig provides distributed control over large fund movements, requiring consensus among trusted guardians.

### 4. Identity Canister (User Management)
**Principal**: Configured during deployment via `setIdentityCanister()`

**Permissions**:
- ✅ Update user OWP balances for identity verification
- ✅ Read treasury balances for verification
- ❌ Cannot transfer tokens
- ❌ Cannot mint/burn tokens
- ❌ Cannot modify treasury configuration

**Rationale**: Identity canister maintains user balances for KYC/verification but cannot move funds.

### 5. Regular Users (Minimal Access)
**Permissions**:
- ✅ Transfer small amounts (<1M OWP) directly
- ✅ Query balances and transaction history
- ✅ Participate in governance voting
- ❌ Cannot mint/burn tokens
- ❌ Cannot access privileged functions
- ❌ Cannot transfer large amounts without multisig

**Rationale**: Users can manage their own funds and participate in governance but cannot access administrative functions.

## Function-Level Access Modifiers

### Treasury Canister Functions

| Function | Required Role | Additional Checks |
|----------|---------------|-------------------|
| `mint()` | DAO Canister | - |
| `burn()` | DAO Canister | - |
| `transfer()` | Any User | Amount < 1M OWP, or Multisig approval for >1M OWP |
| `pauseTreasury()` | DAO or Governance | - |
| `resumeTreasury()` | DAO or Governance | - |
| `setDaoCanister()` | None (initial setup) | Can only be set once |
| `setIdentityCanister()` | None (initial setup) | Can only be set once |
| `setMultisigCanister()` | None (initial setup) | Can only be set once |
| `setGovernanceCanister()` | None (initial setup) | Can only be set once |
| `syncIdentityBalance()` | DAO Canister | - |
| `getMeta()` | Public Query | - |
| `balanceOf()` | Public Query | - |
| `getTx()` | Public Query | - |

### Governance Canister Functions

| Function | Required Role | Additional Checks |
|----------|---------------|-------------------|
| `createProposal()` | Any User | - |
| `createEmergencyProposal()` | Any User | - |
| `voteQuadratic()` | Token Holder | - |
| `voteConviction()` | Token Holder | - |
| `executeProposal()` | Any User | Sufficient votes |
| `pauseGovernance()` | Emergency Function | Requires 75% vote |
| `resumeGovernance()` | Emergency Function | Requires 75% vote |
| `emergencyPauseTreasury()` | Governance Vote | Requires executed emergency proposal |
| `emergencyResumeTreasury()` | Governance Vote | Requires executed emergency proposal |

### Multisig Canister Functions

| Function | Required Role | Additional Checks |
|----------|---------------|-------------------|
| `proposeTransfer()` | Any User | Amount > 1M OWP |
| `approveProposal()` | Guardian | 3-of-5 threshold |
| `executeProposal()` | Any Guardian | After approval threshold met |
| `emergencyPause()` | Guardian | Unanimous consent required |

## Security Controls

### 1. Configuration Locking
- Once DAO and Identity canisters are set, treasury enters "locked" mode
- No further configuration changes allowed
- Prevents privilege escalation attacks

### 2. Timelock Mechanisms
- Large transfers (>1M OWP) require 48-hour delay
- Allows community to review and potentially block suspicious transfers
- Emergency pause can bypass timelock

### 3. Multi-Authorization Requirements
- Large transfers require multisig approval
- Emergency operations require governance vote
- Administrative changes require DAO approval

### 4. Audit Logging
- All privileged operations are logged
- Transaction monitoring script alerts on suspicious activity
- Security status queries provide transparency

## Upgradeable Proxy Pattern

The system implements an upgradeable proxy pattern through:

1. **Stable State Management**: Critical state persisted across upgrades
2. **Pre/Post Upgrade Hooks**: State migration between versions
3. **Governance-Controlled Upgrades**: Major changes require community approval
4. **Backward Compatibility**: Interface stability maintained

## Risk Mitigation

### Privilege Escalation Prevention
- Roles are immutable once set
- No role can grant itself additional permissions
- Cross-canister calls require explicit authorization

### Fund Protection
- Large transfers require multiple approvals
- Emergency pause can halt all operations
- Timelocks prevent flash attacks

### Operational Security
- Off-chain monitoring detects anomalies
- Security status queries enable audits
- Multi-sig prevents single points of failure

## Monitoring & Auditing

### Automated Monitoring
- Transaction volume alerts
- Security status checks
- Configuration drift detection

### Manual Auditing
- Role permission reviews
- Access log analysis
- Function call pattern analysis

## Future Enhancements

1. **Time-Locked Roles**: Automatic role expiration
2. **Multi-Role Users**: Granular permission combinations
3. **Audit Trail Encryption**: Secure logging
4. **Zero-Knowledge Proofs**: Privacy-preserving verification

---

*This RBAC system ensures that no single entity can compromise the treasury while maintaining operational flexibility for legitimate use cases.*
