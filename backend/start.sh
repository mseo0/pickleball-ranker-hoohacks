#!/bin/bash
# Start the main backend server (port 5000)
echo "Starting main backend on port 5000..."
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
python3 app.py &
BACKEND_PID=$!

# Wait a bit to ensure backend is up
sleep 2

# Start the upload server (port 5050)
echo "Starting upload server on port 5050..."
python3 upload_server.py &
UPLOAD_PID=$!

# Wait for both processes
wait $BACKEND_PID $UPLOAD_PID
