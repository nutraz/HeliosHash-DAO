#!/bin/bash

echo "=== HHDAO Project Structure Check ==="
echo "Checking backend and frontend directories..."

# Initialize counters
TOTAL_CHECKS=0
PASSED_CHECKS=0

# Function to check existence and report
check_exists() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [ -e "$1" ]; then
        echo "✅ $1 exists"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo "❌ $1 missing"
        return 1
    fi
}

# Function to check if directory has files
check_not_empty() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [ -d "$1" ] && [ "$(ls -A $1)" ]; then
        echo "✅ $1 exists and is not empty"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo "❌ $1 missing or empty"
        return 1
    fi
}

echo -e "\n--- Backend (Canisters) Structure ---"
check_exists "canisters"
check_exists "canisters/hhdao"
check_exists "canisters/hhdao/src"
check_exists "canisters/hhdao/src/lib.mo"
check_exists "canisters/hhdao/src/canister.mo"
check_exists "canisters/hhdao/src/main.mo"
check_exists "canisters/hhdao/test"
check_exists "canisters/hhdao/test/hhdao.test.mo"
check_exists "canisters/hhdao/test/test-utils.mo"
check_exists "canisters/test-runner"
check_exists "canisters/test-runner/run-tests.sh"
check_exists "canisters/test-runner/test-runner.js"

echo -e "\n--- Frontend (Web) Structure ---"
check_exists "src"
check_exists "src/components"
check_exists "src/hooks"
check_exists "src/utils"
check_exists "src/test"
check_exists "src/App.tsx"
check_exists "src/main.tsx"
check_exists "public"
check_exists "vite.config.ts"
check_exists "tailwind.config.js"

echo -e "\n--- Frontend (Mobile) Structure ---"
check_exists "lib"
check_exists "lib/screens"
check_exists "lib/widgets"
check_exists "lib/models"
check_exists "lib/services"
check_exists "lib/test"
check_exists "lib/main.dart"
check_exists "android"
check_exists "ios"

echo -e "\n--- Configuration Files ---"
check_exists "dfx.json"
check_exists "package.json"
check_exists "pnpm-lock.yaml"
check_exists ".env.example"
check_exists "LICENSE"
check_exists "README.md"

echo -e "\n--- Test Directories ---"
check_exists "e2e"
check_not_empty "e2e"

echo -e "\n--- Build Artifacts Check ---"
if [ -d ".dfx" ]; then
    echo "✅ .dfx directory exists (DFX build artifacts)"
    if [ -d ".dfx/local/canisters" ]; then
        echo "✅ Local canisters built"
        if [ -d ".dfx/local/canisters/hhdao" ]; then
            echo "✅ HHDAO canister built"
        else
            echo "❌ HHDAO canister not built"
        fi
    else
        echo "❌ Local canisters not built"
    fi
else
    echo "⚠️  .dfx directory not found (run 'dfx deploy' to build canisters)"
fi

if [ -d "dist" ]; then
    echo "✅ dist directory exists (frontend build artifacts)"
else
    echo "⚠️  dist directory not found (run 'pnpm build' to build frontend)"
fi

# Summary
echo -e "\n=== Summary ==="
echo "Total checks: $TOTAL_CHECKS"
echo "Passed: $PASSED_CHECKS"
echo "Failed: $((TOTAL_CHECKS - PASSED_CHECKS))"

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo "🎉 All checks passed! Project structure is complete."
    exit 0
else
    echo "⚠️  Some checks failed. Please review the missing components."
    exit 1
fi
