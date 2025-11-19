# CI/CD Setup for HeliosHash DAO

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### 1. Flutter CI (`flutter-ci.yml`)
**Purpose**: Build and validate the mobile Flutter app in the cloud.

**Triggers**:
- Push to `main`, `develop`, or any `feat/*` branch
- Pull requests to `main` or `develop`
- Only runs when `mobile/**` files change

**Jobs**:
- ✅ Flutter doctor check
- ✅ `flutter pub get` - Install dependencies
- ✅ `flutter analyze` - Static code analysis
- ✅ `flutter build apk --debug` - Build debug APK
- ✅ Upload APK as artifact (7-day retention)

**Runner**: Ubuntu latest with Flutter 3.35.7, Java 17

---

### 2. Web CI (`web-ci.yml`)
**Purpose**: Build and validate the Next.js web app.

**Triggers**:
- Push to `main`, `develop`, or any `feat/*` branch
- Pull requests to `main` or `develop`
- Only runs when `web/**` files change

**Jobs**:
- ✅ Install dependencies with pnpm
- ✅ Lint check (non-blocking)
- ✅ TypeScript type check (non-blocking)
- ✅ `pnpm build` - Build Next.js production bundle
- ✅ Upload build artifact (7-day retention)

**Runner**: Ubuntu latest with Node.js 20

---

### 3. Backend CI (`backend-ci.yml`)
**Purpose**: Build and validate the Internet Computer backend.

**Triggers**:
- Push to `main`, `develop`, or any `feat/*` branch
- Pull requests to `main` or `develop`
- Only runs when `backend/**` files change

**Jobs**:
- ✅ Install Node.js dependencies
- ✅ Lint and type check (non-blocking)
- ✅ Install DFX (Internet Computer SDK)
- ✅ `dfx deploy` - Build and deploy canisters locally
- ✅ Clean up DFX process

**Runner**: Ubuntu latest with Node.js 20 and DFX

---

## Benefits of Cloud CI

### For Local Machine Struggles:
1. **Offload heavy builds**: Flutter and Next.js builds run in GitHub's cloud
2. **Parallel execution**: All three workflows run simultaneously
3. **Consistent environment**: Same Ubuntu runner every time
4. **No local resource drain**: Your machine stays free for development
5. **Build artifacts**: Download APKs and builds without building locally

### For Team Collaboration:
1. **Pre-merge validation**: PRs are tested before merging
2. **Build status badges**: Show build health in README
3. **Automated testing**: Can add unit/integration tests later
4. **Deployment ready**: Can extend to auto-deploy on success

---

## Usage

### Push to GitHub
```bash
cd /home/nutarzz/HeliosHash-DAO/apps
git add .github/workflows/
git commit -m "Add CI workflows for Flutter, Web, and Backend"
git push origin feat/clean-social-media-tests
```

### View CI Results
1. Go to: https://github.com/nutraz/HeliosHash-DAO/actions
2. See workflow runs for each push/PR
3. Download build artifacts (APKs, web builds)

### Download Built APK
```bash
# From GitHub Actions run page, click "app-debug-apk" artifact
# Or use GitHub CLI:
gh run download --name app-debug-apk
```

---

## Extending CI

### Add Tests
Add to any workflow before build step:
```yaml
- name: Run tests
  run: flutter test  # or pnpm test
```

### Add Code Coverage
```yaml
- name: Generate coverage
  run: flutter test --coverage
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
```

### Auto-Deploy on Success
```yaml
- name: Deploy to Firebase Hosting
  if: github.ref == 'refs/heads/main'
  run: firebase deploy --only hosting
```

### Slack/Discord Notifications
```yaml
- name: Notify on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: '{"text": "Build failed!"}'
```

---

## Troubleshooting

### Workflow not running?
- Check file paths match: `mobile/**`, `web/**`, `backend/**`
- Verify branch names in triggers
- Ensure `.github/workflows/` is at repo root

### Build failing in CI but passes locally?
- Check Flutter/Node versions match
- Review dependency versions in `pubspec.yaml` / `package.json`
- Check for environment-specific code

### Need faster builds?
- Use caching for dependencies:
  ```yaml
  - uses: actions/cache@v3
    with:
      path: ~/.pub-cache
      key: ${{ runner.os }}-pub-${{ hashFiles('**/pubspec.lock') }}
  ```

---

## Cost
GitHub Actions is **free** for public repos and includes:
- 2,000 minutes/month for private repos (free tier)
- Unlimited for public repos
- All three workflows typically complete in < 10 minutes total

---

## Next Steps
1. ✅ Commit and push workflows to GitHub
2. ✅ Monitor first CI run
3. ⏳ Add tests to workflows
4. ⏳ Set up auto-deployment
5. ⏳ Add status badges to README
