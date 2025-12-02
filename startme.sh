#!/bin/bash

# Start script for Accounting System
# Simple single-app structure (no micro-frontends)

echo "Starting Accounting System..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Start the app in dev mode
echo "Starting dev server on port 4200..."
pnpm run dev
