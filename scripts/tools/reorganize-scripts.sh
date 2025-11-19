#!/bin/bash
# Purpose: 
# Location: scripts/tools/
set -e

echo "🚀 Reorganizing HHDAO-FUSION Shell Scripts"
echo "=========================================="

# Create directories if they don't exist
mkdir -p scripts/build
mkdir -p scripts/fix
mkdir -p scripts/tools
mkdir -p scripts/dfx
mkdir -p scripts/docker
mkdir -p scripts/backup

# Backup current scripts first
echo -e "\n📦 Creating backup..."
tar -czf scripts-backup-$(date +%Y%m%d-%H%M%S).tar.gz $(find . -name "*.sh" -type f) 2>/dev/null || true

# Function to move and categorize script
move_script() {
    local src=$1
    local category=$2
    local dest="scripts/$category/$(basename "$src")"
    
    if [ -f "$src" ]; then
        echo "  Moving: $src -> $dest"
        mv "$src" "$dest"
        chmod +x "$dest"  # Ensure it's executable
        # Add header comment if not present
        if ! head -n 2 "$dest" | grep -q "#!/bin/bash"; then
            sed -i '1i#!/bin/bash' "$dest"
        fi
        if ! head -n 5 "$dest" | grep -q "# Purpose:"; then
            sed -i '2i# Purpose: ' "$dest"
            sed -i '3i# Location: scripts/'"$category"'/' "$dest"
        fi
    fi
}

# Categorize and move scripts
echo -e "\n🗂️  Categorizing scripts..."

# Build scripts
echo "Build scripts:"
for script in build-*.sh; do
    if [ -f "$script" ]; then
        move_script "$script" "build"
    fi
done

# Fix scripts  
echo -e "\nFix scripts:"
for script in fix-*.sh; do
    if [ -f "$script" ]; then
        move_script "$script" "fix"
    fi
done

# DFX/Motoko scripts
echo -e "\nDFX/Motoko scripts:"
for script in *motoko* *.sh *actors.sh; do
    if [ -f "$script" ] && [[ "$script" == *"motoko"* || "$script" == *"actor"* ]]; then
        move_script "$script" "dfx"
    fi
done

# Docker scripts
echo -e "\nDocker scripts:"
for script in *docker* *.sh; do
    if [ -f "$script" ] && [[ "$script" == *"docker"* || "$script" == *"compose"* ]]; then
        move_script "$script" "docker"
    fi
done

# Move remaining root scripts to tools
echo -e "\nOther utility scripts:"
for script in *.sh; do
    if [ -f "$script" ]; then
        move_script "$script" "tools"
    fi
done

# Move scripts from scripts/ directory to appropriate subdirectories
if [ -d "scripts" ]; then
    for script in scripts/*.sh; do
        if [ -f "$script" ]; then
            basename_script=$(basename "$script")
            if [[ "$basename_script" == fix-* ]]; then
                mv "$script" "scripts/fix/$basename_script"
            elif [[ "$basename_script" == build-* ]]; then
                mv "$script" "scripts/build/$basename_script"
            elif [[ "$basename_script" == *"motoko"* || "$basename_script" == *"dfx"* ]]; then
                mv "$script" "scripts/dfx/$basename_script"
            elif [[ "$basename_script" == *"docker"* ]]; then
                mv "$script" "scripts/docker/$basename_script"
            else
                mv "$script" "scripts/tools/$basename_script"
            fi
        fi
    done
fi

# Remove empty backup files and very small scripts
echo -e "\n🧹 Cleaning up..."
find . -name "*.sh" -type f -empty -delete
find . -name "*~" -delete
find . -name "*.back" -delete

# Create a master script index
echo -e "\n📋 Creating script index..."
cat > scripts/README.md << 'README'
# HHDAO-FUSION Scripts Directory

This directory contains all shell scripts organized by category.

## Categories

### 📁 build/ - Build and compilation scripts
$(ls -1 scripts/build/ 2>/dev/null | while read script; do echo "- \`$script\` - Build script"; done || echo "No build scripts")

### 📁 fix/ - Fix and repair scripts  
$(ls -1 scripts/fix/ 2>/dev/null | while read script; do echo "- \`$script\` - Fix script"; done || echo "No fix scripts")

### 📁 dfx/ - DFX and Motoko scripts
$(ls -1 scripts/dfx/ 2>/dev/null | while read script; do echo "- \`$script\` - DFX/Motoko script"; done || echo "No DFX scripts")

### 📁 docker/ - Docker and container scripts
$(ls -1 scripts/docker/ 2>/dev/null | while read script; do echo "- \`$script\` - Docker script"; done || echo "No Docker scripts")

### 📁 tools/ - Utility and tool scripts
$(ls -1 scripts/tools/ 2>/dev/null | while read script; do echo "- \`$script\` - Utility script"; done || echo "No tool scripts")

## Usage

All scripts are executable and can be run from the project root:

\`\`\`bash
./scripts/build/build-complete.sh
./scripts/fix/fix-web.sh
\`\`\`

## Adding New Scripts

1. Place scripts in the appropriate category directory
2. Ensure they have execute permissions: \`chmod +x script.sh\`
3. Update this README if adding a new category
README

echo -e "\n✅ Reorganization complete!"
echo "📁 New structure:"
tree scripts/ 2>/dev/null || ls -la scripts/

echo -e "\n💡 Next steps:"
echo "1. Update any references to moved scripts in package.json or other configs"
echo "2. Test critical build scripts to ensure they still work"
echo "3. Remove the backup tar file once verified: rm scripts-backup-*.tar.gz"
