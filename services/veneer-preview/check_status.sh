#!/bin/bash
# Monitor backend startup status

echo "Checking backend status..."
echo ""

# Check if process is running
if ps aux | grep -q "[a]pi_server.py"; then
    echo "✓ Backend process is running"
    PID=$(ps aux | grep "[a]pi_server.py" | awk 'NR==1{print $2}')
    CPU=$(ps aux | grep "[a]pi_server.py" | awk 'NR==1{print $3}')
    MEM=$(ps aux | grep "[a]pi_server.py" | awk 'NR==1{print $4}')
    echo "  PID: $PID | CPU: $CPU% | Memory: $MEM%"

    if (( $(echo "$CPU > 20" | bc -l) )); then
        echo "  Status: Loading models (high CPU usage)"
    fi
else
    echo "✗ Backend is not running"
    exit 1
fi

echo ""
echo "Testing health endpoint..."

# Try health check
HEALTH=$(curl -s --max-time 2 http://localhost:8000/health 2>&1)

if echo "$HEALTH" | grep -q "healthy"; then
    echo "✓ Backend is READY!"
    echo ""
    echo "Response:"
    echo "$HEALTH" | python3 -m json.tool 2>/dev/null || echo "$HEALTH"
    echo ""
    echo "You can now test image uploads at http://localhost:3000"
    exit 0
elif echo "$HEALTH" | grep -q "unhealthy"; then
    echo "⚠ Backend responding but unhealthy"
    echo "$HEALTH" | python3 -m json.tool 2>/dev/null || echo "$HEALTH"
    exit 1
else
    echo "⏳ Backend still initializing (models downloading/loading)"
    echo "   This can take 5-15 minutes on first run"
    echo ""
    echo "   What's happening:"
    echo "   1. Downloading ControlNet (~1.5 GB)"
    echo "   2. Downloading Stable Diffusion 1.5 (~4 GB)"
    echo "   3. Loading models into memory"
    echo ""
    echo "   Run this script again in a few minutes to check progress"
    exit 2
fi
