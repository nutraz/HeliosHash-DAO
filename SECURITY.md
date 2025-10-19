# Security Policy

## Supported Versions

We maintain security fixes on the `main` branch until a stable release is tagged. Pre-release (alpha) software is not production-ready.

## Reporting a Vulnerability

- Please report vulnerabilities privately via GitHub Security Advisories or email: security@helioshash.org
- Do not create public issues for sensitive reports.
- We aim to acknowledge within 48 hours and provide a remediation timeline within 7 days.

## Disclosure Policy

- Coordinated disclosure is preferred. We will credit researchers upon request.
- If a vulnerability involves third-party dependencies, we will coordinate with upstreams.

## Hardening Guidelines

- No hardcoded secrets or private keys in repository
- All credentials via environment variables (see `.env.example`)
- Minimal API authentication via `AUTH_TOKEN` header for `/api/*` in non-local environments
- Rate limiting enabled for `/api/*` via environment variables

## Dependency Security

- Dependabot is configured to monitor `npm` ecosystem
- Optional Snyk workflow available; requires `SNYK_TOKEN` secret in repository settings

## Contact

security@helioshash.org
