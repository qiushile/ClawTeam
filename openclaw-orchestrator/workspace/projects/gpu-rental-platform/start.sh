#!/bin/bash
# GPU Cloud Platform - Quick Start Script
# Run: bash start.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 GPU Cloud Platform - Quick Start"
echo "===================================="

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install docker-compose first."
    exit 1
fi

echo ""
echo "📦 Starting PostgreSQL and Redis..."
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 5

echo ""
echo "📋 Checking service status..."
docker-compose ps

echo ""
echo "✅ Services started!"
echo ""
echo "To view API logs:     docker-compose logs -f api"
echo "To stop services:     docker-compose down"
echo "API Health Check:     curl http://localhost:8080/health"
echo ""
echo "🎉 Done! Your GPU Cloud platform is running."
