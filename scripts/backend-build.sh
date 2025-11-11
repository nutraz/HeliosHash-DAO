#!/bin/bash
set -e

echo "🔧 Building HeliosHash Backend..."

# Start DFX if not running
if ! dfx ping 2>/dev/null; then
    echo "Starting DFX..."
    dfx start --background
    sleep 5
fi

# Create all canisters (ignore errors if they already exist)
echo "Creating canisters..."
dfx canister create helioshash_backend_backend 2>/dev/null || echo "Backend canister already exists or failed"
dfx canister create helioshash_backend_frontend 2>/dev/null || echo "Frontend canister already exists or failed"
dfx canister create internet_identity 2>/dev/null || echo "Internet Identity canister already exists or failed"

# Generate declarations for backend only
echo "Generating type declarations..."
dfx generate helioshash_backend_backend

# Build all canisters
echo "Building canisters..."
dfx build

echo "✅ Backend build complete!"

# Display canister IDs
echo ""
echo "Canister IDs:"
dfx canister id helioshash_backend_backend 2>/dev/null && echo "✓ Backend: $(dfx canister id helioshash_backend_backend)"
dfx canister id helioshash_backend_frontend 2>/dev/null && echo "✓ Frontend: $(dfx canister id helioshash_backend_frontend)"
dfx canister id internet_identity 2>/dev/null && echo "✓ Internet Identity: $(dfx canister id internet_identity)"
