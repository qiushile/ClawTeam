#!/bin/bash
# Test script for LanceDB memory system

echo "=== LanceDB Memory System Test ==="
echo ""

# Check LanceDB data directory locations
echo "1. Checking LanceDB Data Directory Locations:"
echo ""

PATHS=(
  "/home/node/.openclaw/memory"
  "/home/node/.openclaw/workspace/memory"
  "/home/node/.openclaw/lancedb"
  "/home/node/.openclaw/data/lancedb"
  "/tmp/lancedb"
  "/home/node/.lancedb"
)

for p in "${PATHS[@]}"; do
  echo "Path: $p"
  if [ -d "$p" ]; then
    echo "  Status: EXISTS (Directory)"
    echo "  Contents:"
    ls -la "$p" 2>/dev/null | head -15
  elif [ -f "$p" ]; then
    echo "  Status: EXISTS (File)"
  else
    echo "  Status: NOT FOUND"
  fi
  echo ""
done

# Check environment variables
echo "2. Environment Variables:"
echo "HOME=$HOME"
echo "LANCEDB_PATH=${LANCEDB_PATH:-not set}"
echo "OPENCLAW_HOME=${OPENCLAW_HOME:-not set}"
echo ""

# Check for lancedb node module
echo "3. Checking for LanceDB Node Module:"
if [ -d "/home/node/.openclaw/node_modules/@lancedb" ]; then
  echo "  @lancedb module: FOUND"
  ls -la /home/node/.openclaw/node_modules/@lancedb/ 2>/dev/null
else
  echo "  @lancedb module: NOT FOUND in /home/node/.openclaw/node_modules"
fi
echo ""

# Check for memory-related config
echo "4. Checking OpenClaw Configuration:"
if [ -f "/home/node/.openclaw/config.json" ]; then
  echo "  config.json: FOUND"
  cat /home/node/.openclaw/config.json 2>/dev/null | head -50
else
  echo "  config.json: NOT FOUND"
fi
echo ""

echo "=== Test Complete ==="
