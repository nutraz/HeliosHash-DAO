# HeliosHash-DAO Bug Bounty Program

**Program Status:** 🚀 **LAUNCHING Q1 2026**  
**Last Updated:** October 19, 2025  
**Program Version:** 1.0 (Draft)

---

## 🎯 Program Overview

The HeliosHash-DAO Bug Bounty Program rewards security researchers and ethical hackers for responsibly disclosing vulnerabilities in our platform. Our mission is to build the most secure decentralized solar infrastructure DAO, and we believe collaboration with the security community is essential.

### 🌟 Program Highlights

- **Total Bounty Pool:** $25,000 USD (Initial allocation for Q1-Q2 2026)
- **Payment Methods:** USDC, OWP tokens, or USD wire transfer
- **Response Time:** Initial acknowledgment within 48 hours
- **Focus Areas:** Smart contracts, Web3 infrastructure, DAO governance, authentication

---

## 💰 Reward Structure

### Critical Vulnerabilities: $1,000 - $5,000

**Examples:**

- Smart contract vulnerabilities enabling theft of funds
- Authentication bypass allowing unauthorized treasury access
- Governance manipulation enabling malicious proposals
- Remote code execution on production systems
- Private key exposure or wallet compromise
- Flash loan or reentrancy attacks on canisters
- Privilege escalation to admin/controller roles

### High Severity: $500 - $1,000

**Examples:**

- SQL/NoSQL injection enabling data access
- Cross-Site Scripting (XSS) with session hijacking
- CSRF attacks on sensitive operations
- Access control bypasses (non-financial)
- Information disclosure of PII/KYC data
- Rate limiting bypass enabling DoS
- Session management vulnerabilities
- Canister cycle drainage attacks

### Medium Severity: $100 - $500

**Examples:**

- XSS without immediate impact
- Business logic flaws
- Missing security headers
- Insecure direct object references
- Path traversal vulnerabilities
- CORS misconfigurations
- Subdomain takeover risks
- Sensitive data in client-side code

### Low Severity: $50 - $100

**Examples:**

- Missing rate limiting (non-critical endpoints)
- Information disclosure (non-sensitive)
- Missing security best practices
- SSL/TLS configuration issues
- Clickjacking vulnerabilities
- Open redirect vulnerabilities
- Self-XSS requiring social engineering

---

## 🎯 In-Scope Targets

### Smart Contracts & Canisters (Priority)

- **DAO Governance Canister** - Voting and proposal mechanisms
- **Treasury Canister** - Fund management and OWP token operations
- **Identity Canister** - User authentication and KYC integration
- **HHDAO Main Canister** - Core business logic
- **All deployed canisters on Internet Computer mainnet**

**Canister IDs will be published upon mainnet launch.**

### Web Applications

- **Production Web App:** `https://app.helioshash-dao.org` (when deployed)
- **Mobile Interface:** Mobile-specific endpoints and APIs
- **API Endpoints:** All `/api/*` routes
- **Authentication System:** Login, session management, JWT handling

### Infrastructure

- **API Gateways** and backend services
- **Database** access and queries
- **CI/CD Pipelines** (if accessible)
- **Third-party Integrations:** KYC (Onfido), payment processors

---

## 🚫 Out of Scope

The following are **NOT eligible** for bounty rewards:

### Technical Exclusions

- Vulnerabilities in third-party services (report directly to them)
- Issues already known and documented in our security audit reports
- Theoretical vulnerabilities without proof of concept
- Automated scanner output without validation
- Social engineering attacks
- Physical security issues
- Denial of Service (DoS) attacks (except for specific bypass scenarios)
- Spam or content injection without security impact

### Expected Behaviors

- Rate limiting on public endpoints (expected behavior)
- Logout/session timeout behavior
- Password reset functionality (if following security best practices)
- Missing DNSSEC
- Missing CAA records
- Self-XSS that requires significant user interaction

### Development/Test Environments

- `localhost` deployments
- Test networks (unless specifically requested for testing)
- Development branches (main branch only)

---

## 📋 Submission Guidelines

### How to Submit a Vulnerability

**⚠️ NEVER create public GitHub issues for security vulnerabilities!**

#### Step 1: Prepare Your Report

Include the following information:

1. **Vulnerability Type**: (e.g., "Smart Contract Reentrancy")
2. **Severity Assessment**: Your assessment (Critical/High/Medium/Low)
3. **Affected Component**: Specific canister, endpoint, or system
4. **Description**: Clear explanation of the vulnerability
5. **Proof of Concept**: Step-by-step reproduction
6. **Impact Analysis**: What can an attacker achieve?
7. **Proposed Fix**: (Optional but increases reward consideration)
8. **Your Information**: Name/handle, email, payment preference

#### Step 2: Submit Report

**Primary Method:** Email to <security@helioshash-dao.org>

**Alternative Methods:**

- GitHub Security Advisory: <https://github.com/nutraz/HeliosHash-DAO/security/advisories/new>
- Encrypted Email: PGP key available at <https://helioshash-dao.org/.well-known/security.txt>
- HackerOne Platform: `https://hackerone.com/helioshash-dao` (Launching Q2 2026)

#### Step 3: Wait for Acknowledgment

- **Initial Response:** Within 48 hours (business days)
- **Status Update:** Within 7 days
- **Resolution Timeline:** Varies by severity

---

## 🔄 Process & Timeline

### Response Timeline

| Stage | Timeline |
|-------|----------|
| **Acknowledgment** | Within 48 hours |
| **Initial Triage** | Within 7 days |
| **Validation** | 7-14 days |
| **Fix Development** | Varies by severity |
| **Bounty Payment** | Within 30 days of fix deployment |

### Severity-Based Fix Timeline

| Severity | Target Fix Time | Maximum Time |
|----------|----------------|--------------|
| **Critical** | 24-72 hours | 7 days |
| **High** | 7-14 days | 30 days |
| **Medium** | 30 days | 60 days |
| **Low** | Next release | 90 days |

### Communication Process

1. **Acknowledgment Email**: Confirming receipt of your report
2. **Validation Update**: Initial assessment and severity rating
3. **Status Updates**: Regular updates on fix progress
4. **Resolution Notice**: When fix is deployed to production
5. **Bounty Payment**: Payment processed within 30 days of deployment
6. **Public Disclosure**: Coordinated disclosure 90 days after fix (if agreed)

---

## 💳 Payment Information

### Payment Methods

**Primary Options:**

- **USDC (Polygon/Ethereum)**: Fast, low-fee payments
- **OWP Tokens**: Option to receive payment in OWP tokens (project governance token)
- **USD Wire Transfer**: For payments >$1,000

**Payment Processing:**

- Payments processed within **30 days** of fix deployment
- Minimum payment: $50 USD
- Tax documentation may be required for payments >$600 USD (US researchers)

### Bonus Multipliers

Earn **bonus rewards** for exceptional work:

- **+25%**: High-quality, detailed report with fix recommendations
- **+50%**: Critical vulnerability with working exploit code
- **+20%**: First reporter (if multiple researchers find same issue)
- **+15%**: Vulnerabilities found in pre-launch testing phase

### OWP Token Option

Researchers may choose to receive payment in OWP tokens:

- **Bonus**: +10% value when paid in OWP tokens
- **Vesting**: 50% immediate, 50% vested over 6 months
- **Governance Rights**: OWP tokens include DAO voting rights
- **Price Reference**: 7-day TWAP (Time-Weighted Average Price)

---

## 📜 Program Rules & Legal

### Safe Harbor

HeliosHash-DAO commits to:

- **No Legal Action**: We will not pursue legal action against researchers who comply with these guidelines
- **Coordinated Disclosure**: Work with you on responsible public disclosure timeline
- **Good Faith Exemption**: Accidental violations will not result in bounty forfeiture if immediately reported

### Researcher Responsibilities

You **MUST:**

- ✅ Make every effort to avoid privacy violations, data destruction, and service interruption
- ✅ Only interact with accounts you own or with explicit permission
- ✅ Not exploit vulnerabilities beyond the minimum necessary to prove impact
- ✅ Wait for our fix before publicly disclosing (minimum 90 days)
- ✅ Not access, modify, or delete data belonging to others

You **MUST NOT:**

- ❌ Execute DoS/DDoS attacks
- ❌ Spam or social engineer our users or team
- ❌ Perform physical security testing
- ❌ Test on production systems with real user data (use test accounts)
- ❌ Demand payment before disclosure
- ❌ Publicly disclose vulnerabilities before coordinated timeline

### Eligibility Requirements

- Must be 18+ years old (or have parental consent)
- Must not be on any government sanctions list
- Employees, contractors, and immediate family of HeliosHash-DAO are not eligible
- Must comply with all applicable laws
- First reporter of a unique vulnerability is eligible

### Disclosure Policy

**Default Timeline:**

- **Day 0**: Vulnerability reported
- **Day 7**: Initial validation and severity assessment
- **Day 30**: Fix deployed to production (target)
- **Day 90**: Coordinated public disclosure (if appropriate)

**Public Disclosure:**

- We may publish a blog post crediting you (with permission)
- You may publish after 90 days (or earlier with mutual agreement)
- Critical vulnerabilities may require longer embargo periods

---

## 🏆 Hall of Fame

Outstanding security researchers will be recognized:

- **Security Hall of Fame**: Public recognition on our website
- **Annual Awards**: Top 3 researchers receive special recognition + bonus rewards
- **Community Benefits**: Priority access to new features, governance participation

**2026 Hall of Fame** (To be announced in Q4 2026)

---

## 📞 Contact & Support

### Security Team

- **Email**: <security@helioshash-dao.org>
- **PGP Key**: Available at <https://helioshash-dao.org/.well-known/security.txt>
- **Response Time**: 48 hours (business days)

### Program Questions

For non-security questions about the bug bounty program:

- **Email**: <bugbounty@helioshash-dao.org>
- **GitHub Discussions**: <https://github.com/nutraz/HeliosHash-DAO/discussions>

### Social Media

- **Twitter/X**: [@HeliosHashDAO](https://twitter.com/HeliosHashDAO)
- **Discord**: Join our community for updates
- **Telegram**: Security channel for researchers

---

## 🔍 Vulnerability Assessment Guide

### Severity Criteria

We use the following framework to assess severity:

#### Critical (CVSS 9.0 - 10.0)

- Direct theft of funds
- Permanent freezing of funds
- Governance takeover
- Protocol insolvency
- Remote code execution

**Example:** "Reentrancy vulnerability in treasury canister allows attacker to drain all OWP tokens"

#### High (CVSS 7.0 - 8.9)

- Temporary freezing of funds
- Theft of unclaimed yield
- Unauthorized access to PII/KYC data
- Privilege escalation
- Theft of NFT rewards

**Example:** "Authentication bypass allows access to any user's dashboard and KYC information"

#### Medium (CVSS 4.0 - 6.9)

- Information disclosure
- Smart contract griefing
- Manipulation of non-critical functions
- CSRF on sensitive operations

**Example:** "XSS vulnerability in job board allows stealing session tokens"

#### Low (CVSS 0.1 - 3.9)

- Best practice violations
- Missing security headers
- Low-impact information disclosure
- Self-XSS requiring social engineering

**Example:** "Missing CSP header allows inline scripts on non-sensitive pages"

### Impact Assessment

Consider these factors:

1. **Financial Impact**: Can funds be stolen or locked?
2. **Data Exposure**: Is PII/KYC data compromised?
3. **Governance Risk**: Can voting be manipulated?
4. **User Impact**: How many users are affected?
5. **Exploitability**: How easy is it to exploit?
6. **Privilege Required**: Does it require authentication?

---

## 📚 Resources for Researchers

### Documentation

- **Security Audit Report**: [security-audit-2025-10-19.md](docs/security-audit-2025-10-19.md)
- **Architecture Overview**: [README.md](README.md)
- **Smart Contract Docs**: [docs/canisters/](docs/canisters/)
- **API Documentation**: [docs/api.md](docs/api.md)

### Testing Resources

**Test Accounts:**

- Test user accounts will be provided upon request
- Test OWP tokens available on testnet
- Staging environment: `https://staging.helioshash-dao.org`

**Test Networks:**

- Internet Computer Mainnet: Production (use with caution)
- Internet Computer Testnet: Preferred for testing
- Local DFX Replica: For isolated testing

### Tools & References

**Recommended Tools:**

- **Burp Suite / OWASP ZAP**: Web application testing
- **Mythril / Slither**: Smart contract analysis
- **Foundry**: Ethereum/ICP contract testing
- **Postman**: API testing

**References:**

- [OWASP Top 10](https://owasp.org/Top10/)
- [Internet Computer Security Best Practices](https://internetcomputer.org/docs/current/developer-docs/security/)
- [DeFi Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

---

## 🎓 Researcher Tips

### What We Value

1. **Quality over Quantity**: Well-researched, detailed reports
2. **Proof of Concept**: Working exploits demonstrate impact
3. **Fix Recommendations**: Show us how to remediate
4. **Clear Communication**: Make it easy for us to reproduce
5. **Responsible Disclosure**: Follow our coordinated disclosure timeline

### Report Writing Best Practices

**Good Report Structure:**

```markdown
# Title: Reentrancy vulnerability in Treasury Canister

## Severity: Critical

## Summary
The `withdraw()` function in the treasury canister is vulnerable to 
reentrancy attacks, allowing an attacker to drain all funds.

## Reproduction Steps
1. Deploy malicious canister at [address]
2. Call `invest()` with 100 OWP tokens
3. Call `withdraw()` which triggers callback
4. In callback, recursively call `withdraw()` before state update
5. Successfully withdraw 1000 OWP tokens (10x initial investment)

## Proof of Concept
[Include code, screenshots, or video]

## Impact
An attacker can drain the entire treasury (~$500K USD at current prices).
This affects all 150+ community members and stops all solar projects.

## Recommended Fix
Implement checks-effects-interactions pattern:
[Provide code example]

## Timeline
Discovered: October 15, 2025
Reported: October 19, 2025
```

### Common Mistakes to Avoid

- ❌ Vague descriptions without reproduction steps
- ❌ No proof of concept or impact assessment
- ❌ Testing on production with real user data
- ❌ Demanding payment before providing full details
- ❌ Public disclosure before coordinated timeline
- ❌ Automated scanner output without validation

---

## 📊 Program Statistics

### Launch Goals (Q1-Q2 2026)

- **Target Researchers**: 50+ active participants
- **Expected Submissions**: 20-30 valid vulnerabilities
- **Bounty Pool**: $25,000 initial allocation
- **Average Payout**: $500-800 per valid submission

### Program Metrics (To be updated quarterly)

| Metric | Q1 2026 | Q2 2026 | Q3 2026 | Q4 2026 |
|--------|---------|---------|---------|---------|
| **Submissions** | TBD | TBD | TBD | TBD |
| **Valid Findings** | TBD | TBD | TBD | TBD |
| **Total Paid** | TBD | TBD | TBD | TBD |
| **Average Response** | TBD | TBD | TBD | TBD |

---

## 🔄 Program Updates

### Version History

**v1.0 (October 19, 2025)**

- Initial bug bounty program structure
- Reward tiers established
- Scope defined for Q1 2026 launch

### Planned Improvements

- **Q2 2026**: HackerOne platform integration
- **Q3 2026**: Increase bounty pool to $50,000
- **Q4 2026**: Launch annual security competition
- **2027**: Continuous bug bounty with automatic payouts

---

## 🤝 Acknowledgments

We thank the security research community for helping us build a secure platform. Special recognition to:

- **Trail of Bits** - Smart contract audit guidance
- **Internet Computer Security Team** - Canister security best practices
- **OWASP** - Web application security standards
- **HackerOne** - Bug bounty program structure inspiration

---

## ⚖️ Legal Disclaimer

This bug bounty program does not constitute a contract. HeliosHash-DAO reserves the right to:

- Modify reward amounts based on severity assessment
- Disqualify submissions that violate program rules
- Terminate the program at any time with 30 days notice
- Determine final severity ratings and reward amounts

All decisions regarding eligibility and reward amounts are at the sole discretion of HeliosHash-DAO.

By participating, you agree to these terms and our coordinated disclosure policy.

---

**Program Contact**: <security@helioshash-dao.org>  
**Last Updated**: October 19, 2025  
**Next Review**: January 1, 2026

---

*Building the most secure decentralized solar infrastructure - together with the security community.* 🔒⚡🏔️
