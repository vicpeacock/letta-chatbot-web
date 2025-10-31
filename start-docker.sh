#!/bin/bash

echo "🚀 Starting Letta Chatbot Docker Environment"
echo "=========================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start MCP Gateway first (if not already running)
echo "🔌 Starting MCP Gateway..."
if ! pgrep -f "docker mcp gateway run" > /dev/null; then
    if [ -f "./start-mcp-gateway.sh" ]; then
        ./start-mcp-gateway.sh
        echo "✅ MCP Gateway started"
    else
        echo "⚠️  MCP Gateway script not found. Please start manually:"
        echo "   docker mcp gateway run --port 8080 --transport streaming"
    fi
else
    echo "✅ MCP Gateway already running"
fi

echo ""

# Check if we want development or production mode
if [ "$1" = "dev" ]; then
    echo "🔧 Starting in DEVELOPMENT mode..."
    docker-compose -f docker-compose.dev.yml up --build
else
    echo "🏭 Starting in PRODUCTION mode..."
    docker-compose up --build
fi

echo "✅ All services started!"
echo ""
echo "📱 Access your services:"
echo "   • Chatbot: http://localhost:3001"
echo "   • Letta ADE: http://localhost:8283"
echo "   • Ollama: http://localhost:11434"
echo "   • MCP Gateway: http://localhost:8080"
echo ""
echo "🛑 To stop all services:"
echo "   • Docker services: docker-compose down"
echo "   • MCP Gateway: ./stop-mcp-gateway.sh"
