#!/bin/bash
# Test script for the fixed veneer generation pipeline

set -e  # Exit on error

echo "========================================="
echo "Testing Fixed Veneer Generation Pipeline"
echo "========================================="
echo ""

# Configuration
CONTROLNET_PATH=${CONTROLNET_PATH:-"lllyasviel/control_v11p_sd15_seg"}
SEG_CHECKPOINT="ext/individual_tooth_segmentation/checkpoints/CP_teeth_seg.pth"
TEST_IMAGE=${1:-"test_inputs/sample_smile.jpg"}
OUTPUT_DIR="test_outputs/fixed_pipeline"

# Check if test image exists
if [ ! -f "$TEST_IMAGE" ]; then
    echo "❌ Error: Test image not found at: $TEST_IMAGE"
    echo "Usage: $0 <path_to_test_image>"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"
mkdir -p "debug_outputs"

echo "Configuration:"
echo "  ControlNet: $CONTROLNET_PATH"
echo "  Segmentation: $SEG_CHECKPOINT"
echo "  Input: $TEST_IMAGE"
echo "  Output: $OUTPUT_DIR"
echo ""

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

echo "========================================="
echo "Test 1: Generate with default settings"
echo "========================================="
python ext/veneer_generation/controlnet/inference_controlnet.py \
    --controlnet "$CONTROLNET_PATH" \
    --segmentation "$SEG_CHECKPOINT" \
    --image "$TEST_IMAGE" \
    --output "$OUTPUT_DIR/result_default.jpg" \
    --debug-dir "debug_outputs" \
    --comparison

echo ""
echo "✓ Test 1 complete. Check $OUTPUT_DIR/result_default.jpg"
echo ""

echo "========================================="
echo "Test 2: Generate with preserve_geometry"
echo "========================================="
python ext/veneer_generation/controlnet/inference_controlnet.py \
    --controlnet "$CONTROLNET_PATH" \
    --segmentation "$SEG_CHECKPOINT" \
    --image "$TEST_IMAGE" \
    --output "$OUTPUT_DIR/result_preserve_geometry.jpg" \
    --guidance 5.0 \
    --debug-dir "debug_outputs" \
    --comparison

echo ""
echo "✓ Test 2 complete. Check $OUTPUT_DIR/result_preserve_geometry.jpg"
echo ""

echo "========================================="
echo "Debug Outputs Available:"
echo "========================================="
echo "📁 debug_outputs/"
echo "  ├── input_resized.png      (Resized input image)"
echo "  ├── tooth_mask.png         (Segmentation mask - CHECK THIS!)"
echo "  ├── conditioning.png       (ControlNet conditioning)"
echo "  └── output.png             (Final output)"
echo ""
echo "📁 $OUTPUT_DIR/"
echo "  ├── result_default.jpg"
echo "  └── result_preserve_geometry.jpg"
echo ""
echo "========================================="
echo "✅ All tests complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Check debug_outputs/tooth_mask.png - should ONLY show teeth (not lips/gums)"
echo "2. Compare before/after in $OUTPUT_DIR/"
echo "3. If lips/gums are still being modified, the mask is too broad"
echo ""
