#!/bin/bash

# Stop Docker MCP Gateway service
echo "Stopping Docker MCP Gateway service..."

# Check if PID file exists
if [ -f "mcp-gateway.pid" ]; then
    PID=$(cat mcp-gateway.pid)
    echo "Found PID: $PID"
    
    # Kill the process
    if kill $PID 2>/dev/null; then
        echo "Docker MCP Gateway stopped successfully"
    else
        echo "Process with PID $PID not found or already stopped"
    fi
    
    # Remove PID file
    rm -f mcp-gateway.pid
else
    echo "No PID file found. Trying to kill any running MCP Gateway processes..."
    pkill -f "docker mcp gateway run"
    echo "Done"
fi

# Clean up log file if it exists
if [ -f "mcp-gateway.log" ]; then
    echo "Log file preserved at: mcp-gateway.log"
fi
