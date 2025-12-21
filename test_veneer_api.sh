#!/bin/bash
# Test script for veneer API

echo "=========================================="
echo "Testing Veneer Preview API"
echo "=========================================="
echo ""

# Test 1: Health check
echo "[1/3] Testing health endpoint..."
HEALTH=$(curl -s http://localhost:8000/health)
echo "Response: $HEALTH"

if echo "$HEALTH" | grep -q "healthy"; then
    echo "✓ Backend is healthy"
else
    echo "✗ Backend is not healthy"
    exit 1
fi

echo ""

# Test 2: Model info
echo "[2/3] Testing model info endpoint..."
MODEL_INFO=$(curl -s http://localhost:8000/api/model/info)
echo "Response: $MODEL_INFO"
echo ""

# Test 3: Generate preview with minimal image
echo "[3/3] Testing veneer preview generation..."
echo "This will take some time (model needs to run inference)..."

# Create a minimal test image (1x1 red pixel PNG in base64)
MINI_IMAGE="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="

RESPONSE=$(curl -s -X POST http://localhost:8000/api/veneer-preview \
  -H "Content-Type: application/json" \
  -d "{\"image\": \"data:image/png;base64,$MINI_IMAGE\"}" | head -100)

echo "Response preview:"
echo "$RESPONSE" | head -20

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo ""
    echo "✓ API test PASSED!"
    echo "✓ Veneer generation is working!"
elif echo "$RESPONSE" | grep -q '"error"'; then
    echo ""
    echo "✗ API test FAILED with error:"
    echo "$RESPONSE" | grep -o '"error":"[^"]*"'
    exit 1
else
    echo ""
    echo "? Unexpected response"
    exit 1
fi

echo ""
echo "=========================================="
echo "All tests completed!"
echo "=========================================="
