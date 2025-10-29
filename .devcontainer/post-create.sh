#!/bin/bash
set -e

echo "🚀 Setting up development environment..."

# Install pnpm
npm install -g pnpm@latest

# Install dependencies
pnpm install

echo "✅ Setup complete!"
