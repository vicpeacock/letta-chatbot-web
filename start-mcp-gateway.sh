#!/bin/bash

# Start Docker MCP Gateway as a background service
echo "Starting Docker MCP Gateway as a background service..."

# Kill any existing MCP Gateway processes
pkill -f "docker mcp gateway run" 2>/dev/null

# Start the MCP Gateway in the background
nohup docker mcp gateway run --port 8080 --transport streaming > mcp-gateway.log 2>&1 &

# Get the process ID
PID=$!

# Save the PID to a file for later reference
echo $PID > mcp-gateway.pid

echo "Docker MCP Gateway started with PID: $PID"
echo "Logs are being written to: mcp-gateway.log"
echo "PID saved to: mcp-gateway.pid"
echo ""
echo "To stop the service, run: ./stop-mcp-gateway.sh"
echo "To view logs, run: tail -f mcp-gateway.log"
