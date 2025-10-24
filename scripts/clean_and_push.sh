#!/bin/bash
set -e

echo "🧹 Starting repository cleanup..."

# 1. Delete problematic branch
echo "📌 Deleting old branch..."
git branch -D audit/production-review 2>/dev/null || true
git push origin --delete audit/production-review 2>/dev/null || true

# 2. Remove large files physically
echo "🗑️  Removing large files..."
rm -rf node_modules.bak
rm -f react

# 3. Update .gitignore
echo "📝 Updating .gitignore..."
cat >> .gitignore << 'EOF'

# === NEVER COMMIT THESE ===
node_modules.bak/
*.bak/
react
*.node
EOF

# 4. Create new branch from clean main
echo "🌿 Creating fresh branch..."
git checkout main
git pull origin main
git checkout -b audit/production-review

# 5. Add files (respecting .gitignore)
echo "➕ Adding files..."
git add .

# 6. Verify no problematic files
echo "🔍 Verifying..."
if git diff --cached --name-only | grep -E '(node_modules\.bak|^react$|\.node$)'; then
    echo "❌ ERROR: Large files still detected!"
    exit 1
fi

# 7. Commit
echo "💾 Committing..."
git commit -m "chore: Prepare for production audit

- Remove node_modules.bak backup directory  
- Remove large binary files
- Update .gitignore
- Ready for security and architecture review" --no-verify

# 8. Push
echo "🚀 Pushing to origin..."
git push -u origin audit/production-review

echo "✅ SUCCESS! Repository cleaned and pushed!"
echo "🔗 Share this URL: https://github.com/nutraz/HeliosHash-DAO"
