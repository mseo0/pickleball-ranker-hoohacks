#!/bin/zsh
# Start all servers for the project

# Start the main backend server (port 5000)
echo "Starting main backend on port 5000..."
python3 -m backend.app &
BACKEND_PID=$!

# Wait a bit to ensure backend is up
sleep 2

# Start the upload server (port 5050)
echo "Starting upload server on port 5050..."
python3 backend/upload_server.py &
UPLOAD_PID=$!

# Start the MCP server (port 8000)
echo "Starting MCP server on port 8000..."
python3 backend/mcp/server.py &
MCP_PID=$!

# Start the frontend (npm run dev)
echo "Starting frontend (npm run dev)..."
npm run dev &
FRONTEND_PID=$!

# Wait for all background processes
wait $BACKEND_PID $UPLOAD_PID $MCP_PID $FRONTEND_PID


# chmod +x start.sh 
# ./start.sh
