#!/bin/bash

echo "🔧 Setting up Redis for local development..."

# Check if Redis is installed
if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis is not installed. Installing Redis..."
    
    # For macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "📦 Installing Redis via Homebrew..."
        brew install redis
    else
        echo "❌ Please install Redis manually for your operating system"
        echo "   Visit: https://redis.io/download"
        exit 1
    fi
fi

echo "✅ Redis is installed"

# Start Redis server
echo "🚀 Starting Redis server..."
redis-server --daemonize yes --port 6379

echo "✅ Redis server started on port 6379"
echo "🔍 You can test Redis with: redis-cli ping"
echo "🛑 To stop Redis: redis-cli shutdown"
