# Code Quality & Scanning

This repo includes optional CI jobs to run static analysis and code quality scanning with SonarCloud and Code Climate.

What I added

- `.github/workflows/code-quality.yml` — GitHub Actions workflow that runs lint/tests and conditionally runs SonarCloud and Code Climate scans when the appropriate repository secrets are configured.
- `sonar-project.properties` — minimal Sonar project file with defaults; adjust `sonar.organization` and `sonar.projectKey` as needed.
- `.codeclimate.yml` — minimal Code Climate config enabling ESLint analysis.

How to enable SonarCloud

1. Create an account at https://sonarcloud.io and create a project (organization). Note the `organization` and `projectKey`.
2. Generate a Sonar token in your SonarCloud user account.
3. In GitHub repository Settings → Secrets, add a new secret named `SONAR_TOKEN` with the token value.
4. Optionally update `sonar-project.properties` with your exact `sonar.organization` and `sonar.projectKey`.

How to enable Code Climate

1. Sign up at https://codeclimate.com and add the repository.
2. Note the repo token and create a repository secret named `CODECLIMATE_REPO_TOKEN` in GitHub with that value.
3. The workflow will run Code Climate analysis when the secret is present.

Notes

- The CI workflow is guarded: the SonarCloud and Code Climate steps only execute when their corresponding secrets exist. This avoids failing CI on repos without tokens.
- Both scanners may require additional configuration depending on desired rules, languages, and reports (coverage paths, test reports). Adjust the workflow and config files as necessary.
