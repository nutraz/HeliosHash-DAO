

# Updated Copilot Instructions for HeliosHash DAO (HHDAO) - Enhanced Safety Features

## Project Overview
- **HeliosHash DAO (HHDAO)** is an India-specific extension of the One World Project (OWP) ecosystem, designed to make so 

     

    Implementation Examples: More code snippets showing actual implementation patterns for the most complex integrations. 
     

    Error Handling Strategies: Specific guidance on handling failures in government API integrations and account recovery processes. 
     

    Performance Considerations: Guidance on optimizing performance given the extensive government integrations and real-time data requirements. 
     

    Testing Framework: More detailed guidance on testing the complex government integrations and account safety mechanisms. 
     

    Migration Strategies: Guidance on migrating users from legacy systems while maintaining the one user one account policy. 
     

lar energy infrastructure accessible through blockchain technology.
- **Core Relationship**: HHDAO extends OWP's global platform (https://www.oneworldproject.io/, https://dapp.oneworldproject.io/) with India-specific features while maintaining full compatibility with existing OWP DAOs like UrgamUSmartCity (https://dapp.oneworldproject.io/daodetail/UrgamUSmartCity).
- **Key Focus**: Simplified onboarding for Indian users, seamless integration with OWP's NFT ecosystem (https://opensea.io/collection/one-world-project), and real-time solar infrastructure management.
- **Compliance**: Built with Web3 best practices and Bitcoin Satoshi standard compliance at its core.
- **Critical Addition**: Comprehensive utility system integrating all relevant Indian government departments for automated permissions, background verification, and regulatory compliance.
- **Safety Priority**: Robust account safety mechanisms to prevent lockouts and ensure one user = one account.


## Architecture & Key Components
- **OWP Integration Layer**:
  - Extends OWP's core canisters with India-specific implementations
  - Maintains compatibility with OWP's governance and NFT systems
  - Synchronizes with OWP's global ledger while adding India-specific data layers

- **Government Integration System**:
  - Located in `canisters/gov_integration/`
  - Connects with Indian government APIs and portals
  - Handles automated permission workflows and status tracking
  - Implements secure data exchange protocols for sensitive information

- **Account Safety System**:
  - Located in `canisters/account_safety/`
  - Manages account recovery mechanisms
  - Implements community-based verification systems
  - Enforces one user = one account policy
  - Handles emergency access protocols

- **Canisters (Motoko)**:
  - `hhdao/`: Main business logic with India-specific implementations
  - `dao/`: Governance layer extending OWP's governance framework
  - `telemetry/`: Real-time solar infrastructure data with India-specific metrics
  - `documents/`: Workflow automation tailored to Indian regulatory requirements
  - `identity/`: Simplified KYC for Indian users with local verification partners
  - `gov_integration/`: Government department integration and permission automation
  - `background_checks/`: User verification and criminal history checks
  - `land_records/`: Integration with Indian land registry systems
  - `video_testimonials/`: Video verification system for offline processes
  - `account_safety/`: Account recovery and safety mechanisms
  - `anti_sybil/`: Prevention of multiple accounts per user


- **Frontend**:
  - Web: React + Vite + Tailwind CSS (`src/` and `public/`)
  - Mobile: Flutter (`ios/`, `android/`, `lib/`)
  - Dashboard: Intricate yet user-friendly interface with real-time data visualization
  - Government Portal: Dedicated interface for permission tracking and document submission
  - Account Safety Portal: Interface for account recovery and safety management

## Developer Workflows
- **Install**: `pnpm install`
- **Dev Server**: `pnpm dev` (web)
- **Build**: Use Vite for frontend, DFX for canisters
- **Test**:
  - Motoko: `motoko-mocha` or `canisters/test-runner/run-tests.sh`
  - Frontend: `pnpm test:run` (unit/integration), `pnpm test:e2e` (Playwright), `pnpm test:all` (all tests)
- **Deploy**: `deploy.sh` (custom script with OWP integration checks), DFX for canisters


## Conventions & Patterns
- **OWP Extension Pattern**:
  - All HHDAO components must extend or implement OWP base interfaces
  - Use OWP's core canisters as foundation, adding India-specific extensions
  - Maintain data structure compatibility with OWP's global ledger

- **Government Integration Pattern**:
  - Implement secure API gateways for each government department
  - Use standardized data formats (e.g., DigiLocker formats)
  - Maintain audit trails for all government interactions
  - Implement asynchronous workflows with status callbacks

- **Background Verification System**:
  - Modular verification components for different check types
  - Implement privacy-preserving verification using zero-knowledge proofs
  - Cache verification results with proper expiration policies
  - Handle partial verification results gracefully

- **Account Safety Pattern**:
  - Implement multi-layered account recovery mechanisms
  - Use community-based verification for account recovery
  - Implement social recovery with trusted contacts
  - Enforce strict one user = one account policy

- **Anti-Sybil Pattern**:
  - Implement robust identity verification at account creation
  - Use government-issued IDs as unique identifiers
  - Implement device fingerprinting to prevent multiple accounts
  - Use behavioral analysis to detect suspicious account creation

- **Canister Structure**:
  - Use `main.mo` as entrypoint; keep business logic modular in `src/`
  - Implement OWP's standard interfaces with India-specific extensions
  - Tests live in `test/` folders alongside code

- **Frontend**:
  - Use TypeScript for new code (`.tsx`, `.ts`), but legacy `.jsx` exists
  - Organize by feature: `components/`, `pages/`, `hooks/`, `utils/`
  - Dashboard components in `src/components/dashboard/` with real-time data visualization
  - Government portal components in `src/components/gov_portal/`
  - Account safety components in `src/components/account_safety/`

- **Bitcoin Satoshi Standard Compliance**:
  - All financial transactions must implement Bitcoin's UTXO model
  - Use Bitcoin-compatible address formats and signatures
  - Implement Bitcoin-style transaction verification in canisters

- **Web3 Best Practices**:
  - Decentralized identity management with self-sovereign principles
  - Gas-efficient contract design with minimal on-chain storage
  - Transparent audit trails for all transactions and governance decisions
  - Secure key management with hardware wallet support


## Integration Points
- **OWP Ecosystem**:
  - Synchronizes with OWP's global DAO registry
  - Extends OWP's NFT marketplace with India-specific solar assets
  - Implements OWP's governance protocols with India-specific voting mechanisms

- **Comprehensive Government Departments**:
  - **Central Government Departments**:
    - Ministry of New and Renewable Energy (MNRE): Solar project approvals and subsidies
    - Ministry of Power: Overall power sector regulations and policies
    - Ministry of Environment, Forest and Climate Change (MoEFCC): Environmental clearances
    - Ministry of Corporate Affairs: Business registration and compliance
    - Ministry of Social Justice and Empowerment: Community impact assessments
    - Central Electricity Authority (CEA): Technical standards for power projects
    - Bureau of Indian Standards (BIS): Quality and safety certifications
    - Department of Telecommunications: Communication infrastructure permissions
    - National Green Tribunal (NGT): Environmental dispute resolution
    
  - **State Government Departments**:
    - State Electricity Boards/Discoms: Grid connection permissions and power purchase agreements
    - State Pollution Control Boards: Pollution control and environmental compliance
    - State Renewable Energy Development Agencies: State-specific renewable energy policies
    - Revenue Department: Land record verification and property tax
    - Forest Department: Forest land clearances and compensatory afforestation
    - Water Resources Department: Water usage permissions and impact assessment
    - Labor Department: Labor laws compliance and worker safety
    - Industry Department: Industrial approvals and incentives
    - Disaster Management Authority: Disaster resilience and emergency protocols
    
  - **Local Government Bodies**:
    - Municipal Corporations: Local construction permits and building approvals
    - Panchayats/Rural Local Bodies: Rural project approvals and community consent
    - District Collector/Local Administration: Overall coordination and special permissions
    
  - **Regulatory and Compliance Bodies**:
    - Fire Department: Fire safety clearances and emergency preparedness
    - Police Departments: Criminal background checks and security clearances
    - Archaeological Survey of India: Heritage site protection clearances
    - Civil Aviation Department: Aviation safety and height restrictions
    - Factory Inspectorate: Manufacturing safety and operational compliance
    - Income Tax Department: Tax clearances and exemptions
    - GST Department: GST compliance and input tax credit
    
  - **Identity and Verification Agencies**:
    - UIDAI: Aadhaar-based identity verification
    - National Crime Records Bureau (NCRB): Criminal background verification
    - Credit Information Bureau (India) Limited (CIBIL): Credit history and financial verification

- **Account Safety and Recovery Systems**:
  - **Multi-Factor Authentication**: Biometric, hardware wallet, and time-based OTP
  - **Social Recovery**: Trusted community members can verify identity for account recovery
  - **Time-Locked Recovery**: Gradual restoration of account access with verification steps
  - **Emergency Access**: Protocol for critical situations requiring immediate access
  - **Activity Monitoring**: Automated detection of suspicious account behavior

- **Anti-Sybil Mechanisms**:
  - **Government ID Verification**: Mandatory linking to unique government-issued IDs
  - **Device Binding**: Accounts tied to specific devices with verification
  - **Behavioral Analysis**: AI-powered detection of bot-like behavior
  - **Community Verification**: Existing users vouch for new accounts
  - **Proof of Humanity**: Video verification or other methods to prove human identity

- **Automated Permission Workflows**:
  - Multi-department approval chains with parallel processing
  - Document submission and verification system
  - Status tracking with real-time updates
  - Automated escalation for delayed approvals
  - Integration with DigiLocker for document access
  - Single-window system for all government interactions

- **Background Verification System**:
  - **Criminal Checks**: Integration with NCRB and police databases
  - **Financial History**: Credit score verification (CIBIL, etc.)
  - **Identity Verification**: Aadhaar, PAN, and passport verification
  - **Land Ownership**: Integration with Bhulekh and land registry systems
  - **Tax Compliance**: GST and income tax verification
  - **Regulatory Compliance**: Industry-specific license verification

- **Video Testimonial System**:
  - Secure video recording with tamper-proof timestamps
  - Video verification for offline processes
  - Integration with government officials for remote verification
  - Video storage on IPFS with blockchain anchoring

- **Payments**:
  - Razorpay (INR) with Bitcoin settlement
  - Transak (crypto) with Bitcoin network integration
  - Direct Bitcoin payments using Lightning Network for microtransactions

- **KYC**:
  - Onfido, HyperVerge with India-specific verification
  - Integration with India's Aadhaar system (where compliant)
  - Zero-knowledge proofs for privacy-preserving verification

- **Storage**:
  - IPFS/web3.storage for document and media storage
  - On-chain storage for critical transaction data
  - Bitcoin blockchain for anchoring critical records

- **Real-time Data**:
  - Solar infrastructure telemetry with India-specific metrics
  - Integration with India's power grid data sources
  - Real-time dashboard with historical trend analysis


## Dashboard Requirements
- **User Experience**:
  - Intricate yet intuitive interface with progressive disclosure
  - Multi-language support (English, Hindi, and regional languages)
  - Responsive design for all device types
  - Accessibility compliance (WCAG 2.1 AA)

- **Core Features**:
  - Real-time solar infrastructure monitoring
  - Account ledger with Bitcoin transaction history
  - DAO governance interface with proposal tracking
  - NFT portfolio management with OWP integration
  - Energy production/consumption analytics
  - Financial dashboard with INR and BTC balances
  - Community engagement metrics
  - **Comprehensive Government Portal**: Permission tracking, document submission, and status updates across all departments
  - **Verification Dashboard**: Background check status and verification history
  - **Land Record Viewer**: Integrated land ownership and title verification
  - **Video Testimonial Interface**: Recording and submission system
  - **Compliance Tracker**: Real-time status of all regulatory requirements
  - **Single-Window Dashboard**: Unified view of all government interactions
  - **Account Safety Center**: Manage recovery options, trusted contacts, and security settings
  - **Identity Verification Portal**: Complete and manage identity verification steps

- **Data Visualization**:
  - Interactive charts for energy production/consumption
  - Geographic visualization of solar infrastructure
  - Governance participation metrics
  - Financial performance indicators
  - Permission workflow status diagrams
  - Verification process timelines
  - Department-wise approval status visualization
  - Compliance heat maps showing regulatory coverage
  - Account security status visualization


## Government Integration Implementation
- **Comprehensive Permission Automation Workflow**:
  1. User submits project details through HHDAO portal
  2. System identifies ALL required permissions based on project type, size, and location
  3. Automated document generation using department-specific templates
  4. Parallel submission to all relevant government departments via APIs
  5. Real-time status tracking with automated follow-ups
  6. Inter-departmental coordination for overlapping requirements
  7. Escalation to human agents for complex cases
  8. Final approval integration with blockchain for immutable records
  9. Ongoing compliance monitoring and renewal alerts

- **Background Check Process**:
  1. User provides consent for verification
  2. System collects required data points
  3. Parallel verification across multiple sources (NCRB, CIBIL, etc.)
  4. Privacy-preserving result compilation using zero-knowledge proofs
  5. Risk scoring and recommendation generation
  6. Immutable record of verification process on blockchain
  7. Periodic re-verification based on risk profile

- **Land Record Integration**:
  1. User provides land details (survey number, location)
  2. System queries state land registry databases
  3. Ownership verification and encumbrance check
  4. Integration with satellite imagery for boundary verification
  5. Checks for forest land, heritage sites, or other restrictions
  6. Blockchain-anchored land title certificate
  7. Automated mutation of records after project approval

- **Video Testimonial System**:
  1. User records video testimony for offline processes
  2. System adds tamper-proof metadata and timestamps
  3. Video is stored on IPFS with content addressing
  4. Hash is recorded on blockchain for immutability
  5. Government officials can access and verify videos
  6. Integration with department-specific verification protocols

## Account Safety Implementation
- **Multi-Layered Account Recovery**:
  1. **Primary Recovery Method**: Hardware wallet or seed phrase backup
  2. **Secondary Recovery Method**: Time-locked recovery with email/SMS verification
  3. **Community Recovery**: Trusted contacts verify identity through multi-signature process
  4. **Emergency Recovery**: Special protocol for critical situations with enhanced verification

- **Community Approval Verification**:
  1. User designates 3-5 trusted community members as recovery contacts
  2. In case of lockout, user initiates recovery request
  3. System notifies trusted contacts with verification request
  4. Trusted contacts verify user identity through video call or in-person meeting
  5. Minimum threshold (e.g., 3 out of 5) must approve recovery
  6. System gradually restores account access with security checkpoints

- **One User One Account Enforcement**:
  1. **Mandatory Government ID Verification**: All accounts must be linked to unique government-issued IDs (Aadhaar, PAN, etc.)
  2. **Biometric Verification**: Use fingerprint or facial recognition to prevent multiple accounts
  3. **Device Fingerprinting**: Track and limit accounts per device
  4. **Behavioral Analysis**: Detect patterns indicative of multiple accounts
  5. **Community Vouching**: Existing verified users must vouch for new accounts
  6. **Proof of Humanity**: Require video verification or other methods to prove human identity

- **Emergency Access Protocol**:
  1. User initiates emergency access request with detailed justification
  2. System implements time-locked access (e.g., 48-hour waiting period)
  3. During waiting period, system notifies all trusted contacts and community moderators
  4. Enhanced verification process including video call with support team
  5. Temporary access granted with limited privileges
  6. Full access restored after additional verification steps



## Implementation Examples
- **Government API Integration (Motoko):**
  ```motoko
  // Example: Asynchronous call to government API with error handling
  public func requestPermission(details: ProjectDetails): async Result<PermissionStatus, Text> {
    let apiResult = await GovAPI.submit(details);
    switch (apiResult) {
      case (#ok(status)) return #ok(status);
      case (#err(e)) return #err("API error: " # e);
    }
  }
  ```
- **Account Recovery (Motoko):**
  ```motoko
  // Community-based recovery pattern
  public func initiateRecovery(user: Principal, contacts: [Principal]): async Bool {
    // ...existing code for notification and threshold approval...
  }
  ```
- **Frontend Real-Time Data Fetch (React):**
  ```tsx
  // src/hooks/useSolarData.ts
  export function useSolarData() {
    const { data, error } = useSWR('/api/telemetry', fetcher, { refreshInterval: 5000 });
    // ...existing code...
  }
  ```

## Error Handling Strategies
- **Government API Failures:**
  - Always wrap external API calls in try/catch (Motoko: use Result types; JS: try/catch with fallback UI).
  - Log all failures with department, timestamp, and payload for audit.
  - Implement retry with exponential backoff for transient errors.
  - On persistent failure, escalate to human review and notify user via dashboard.
- **Account Recovery Failures:**
  - Require multi-party approval for recovery; if threshold not met, lock account and alert admin.
  - Provide clear user feedback and escalation path for unresolved recovery attempts.

## Performance Considerations
- **Government Integrations:**
  - Use asynchronous workflows and status callbacks to avoid blocking UI or canister logic.
  - Batch requests where possible; avoid synchronous multi-department calls.
  - Cache verification and permission results with expiry to reduce redundant API calls.
- **Real-Time Data:**
  - Use polling or websockets for telemetry; throttle updates to avoid frontend overload.
  - Offload heavy analytics to background jobs or edge services.

## Testing Framework
- **Motoko:**
  - Use `motoko-mocha` and `canisters/test-runner/run-tests.sh` for unit and integration tests.
  - Mock government APIs and simulate error conditions in `canisters/gov_integration/test/`.
  - Test account safety flows in `canisters/account_safety/test/` with edge cases (e.g., partial recovery, failed approvals).
- **Frontend:**
  - Use Playwright and Cypress for end-to-end flows (see `e2e/`, `cypress/`).
  - Mock backend/canister responses for error and latency scenarios.

## Migration Strategies
- **Legacy User Migration:**
  - Require all legacy users to complete government ID verification and device binding on first login.
  - Use migration scripts to map legacy accounts to new structure, flagging duplicates for manual review.
  - Provide a migration dashboard for admins to resolve conflicts and monitor progress.
- **One User One Account Enforcement:**
  - Enforce unique government ID and device fingerprint at migration; block or merge duplicates as per policy.

---


## Special Notes
- **India Focus**: All features must prioritize Indian user needs with simplified onboarding
- **Government Compliance**: Strict adherence to Indian regulations and data protection laws
- **Comprehensive Coverage**: Ensure integration with ALL relevant government departments, no matter how minor
- **OWP Compatibility**: Always maintain compatibility with OWP's core systems and standards
- **Bitcoin Standard**: All financial implementations must follow Bitcoin's principles
- **Transparency**: All data and actions must be transparent and auditable on-chain
- **User Experience**: Balance complexity with simplicity - make intricate features accessible
- **Privacy**: Implement privacy-preserving technologies for sensitive verification data
- **Automation**: Maximize automation of government processes while maintaining human oversight where required
- **Single-Window System**: Create a unified interface for all government interactions to eliminate bureaucracy
- **Account Safety**: Implement robust mechanisms to prevent account lockouts while maintaining security
- **One User One Account**: Strictly enforce one account per user through multiple verification layers
- **Community Trust**: Leverage community-based verification systems for both account recovery and new user validation

For more, see `README.md`, OWP documentation at https://docs.oneworldproject.io/, and comments in key files. When in doubt, follow the structure and patterns of existing OWP modules while adding India-specific extensions. Always prioritize user convenience in government interactions while maintaining regulatory compliance across ALL departments. Never compromise on account safety - implement multiple recovery mechanisms and strictly enforce one user one account policy.