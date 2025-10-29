
# Security Policy for HeliosHash-DAO

## Reporting a Vulnerability

If you discover a security vulnerability, please report it via GitHub Issues or contact the maintainers directly. Do not disclose vulnerabilities publicly until they are resolved.

## Automated Security Checks

- Run `pnpm audit` regularly to check for new vulnerabilities.
- Review dependency updates and changelogs before upgrading.
- Monitor upstream packages (e.g., Vite, esbuild, @connect2ic/core) for security advisories.

## Best Practices

- Keep all dependencies up to date.
- Remove unused packages promptly.
- Use only trusted libraries and avoid deprecated/archived packages.
- Refactor insecure code patterns (e.g., inline styles, direct user input in queries).

## Continuous Improvement

- Consider integrating automated security checks in CI/CD (e.g., GitHub Actions with `pnpm audit`).
- Review this policy quarterly or after major dependency updates.
