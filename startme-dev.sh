#!/bin/bash

# Development start script - only runs shell app
# All MFEs are imported directly in App.dev.tsx for full HMR support

echo "🚀 Starting Accounting System (Development Mode)..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Create a PID file directory
mkdir -p .pids

echo "🏠 Starting Shell App (dev mode - with direct MFE imports)..."
cd "apps/shell"
pnpm run dev > "../../.pids/shell.log" 2>&1 &
local pid=$!
echo $pid > "../../.pids/shell.pid"
cd "$SCRIPT_DIR"
echo "  ✓ shell started (PID: $pid)"

echo ""
echo "✅ Development server started!"
echo ""
echo "📊 Service:"
echo "  Shell (with all MFEs):  http://localhost:4200"
echo ""
echo "📝 Logs: .pids/shell.log"
echo "🛑 To stop: ./stopme.sh"
echo ""
echo "ℹ️  In dev mode, all MFEs are imported directly for instant HMR!"
echo ""
