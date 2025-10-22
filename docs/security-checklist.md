# Security Development Checklist

Use this checklist before releases and major merges.

## Code Security
- [ ] No hardcoded secrets (scan commits)
- [ ] Input validation on all user inputs
- [ ] Output encoding to prevent XSS
- [ ] Parameterized queries where applicable
- [ ] Errors do not leak stack traces in production
- [ ] Security headers (CSP, HSTS, X-Frame-Options)

## AuthN/Z
- [ ] Short-lived JWT or session tokens
- [ ] MFA for privileged users
- [ ] RBAC enforced on backend
- [ ] Logout and token revocation supported

## API & Network
- [ ] HTTPS/TLS enforced
- [ ] CORS restricted to allowed origins
- [ ] Rate limiting enabled on all APIs
- [ ] DDoS/WAF in front of public endpoints

## Smart Contracts (Motoko)
- [ ] Access controls for admin-only functions
- [ ] Reentrancy-safe patterns
- [ ] Overflow/underflow avoided in arithmetic
- [ ] Upgrade process gated (multi-sig / time-lock)
- [ ] Emergency pause mechanism available

## Data Privacy
- [ ] PII encrypted at rest and in transit
- [ ] Data retention and deletion policies documented
- [ ] GDPR/DPDPA user rights implemented

## Dependencies
- [ ] Dependabot enabled
- [ ] Snyk scanning in CI (SNYK_TOKEN configured)
- [ ] Regular `pnpm audit` checks

## Monitoring & Response
- [ ] Security logs centralized
- [ ] Alerts configured for anomalies
- [ ] Incident response plan up to date
- [ ] Backups tested and restorable
