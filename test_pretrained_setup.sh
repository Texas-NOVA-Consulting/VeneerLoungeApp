#!/bin/bash
# Quick test script to verify pretrained model setup

set -e

echo "=========================================="
echo "  Pretrained Models - Quick Test"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if setup has been run
echo -e "${BLUE}Checking if models are downloaded...${NC}"

CONTROLNET_DIR="ext/veneer_generation/checkpoints/controlnet"
PIX2PIX_DIR="ext/veneer_generation/pretrained/pytorch-CycleGAN-and-pix2pix"

HAS_CONTROLNET=false
HAS_PIX2PIX=false

# Check ControlNet
if [ -d "$CONTROLNET_DIR/control_v11p_sd15_seg" ] || [ -d "$CONTROLNET_DIR/control_v11p_sd15_canny" ]; then
    echo -e "${GREEN}✓ ControlNet models found${NC}"
    HAS_CONTROLNET=true
else
    echo -e "${YELLOW}✗ ControlNet models not found${NC}"
    echo "  Will attempt to download from Hugging Face on first use"
fi

# Check Pix2pix
if [ -d "$PIX2PIX_DIR" ]; then
    echo -e "${GREEN}✓ Pix2pix repository found${NC}"
    HAS_PIX2PIX=true
else
    echo -e "${YELLOW}✗ Pix2pix repository not found${NC}"
    echo "  Run ./setup_pretrained_models.sh to download"
fi

echo ""

# Check Python dependencies
echo -e "${BLUE}Checking Python dependencies...${NC}"

if python3 -c "import torch; import diffusers; import transformers" 2>/dev/null; then
    echo -e "${GREEN}✓ Required packages installed${NC}"
else
    echo -e "${RED}✗ Missing required packages${NC}"
    echo "  Run: pip install -r ext/veneer_generation/requirements.txt"
    exit 1
fi

echo ""

# Check for test images
echo -e "${BLUE}Checking for test images...${NC}"

TEST_IMAGE="data/annotate_batch1/before1.jpg"

if [ -f "$TEST_IMAGE" ]; then
    echo -e "${GREEN}✓ Test image found: $TEST_IMAGE${NC}"
else
    echo -e "${YELLOW}✗ Test image not found${NC}"
    echo "  Please provide a test image at: $TEST_IMAGE"
    echo "  Or modify the test commands to use your own image"
fi

echo ""

# Create output directory
mkdir -p test_outputs

# Show available test commands
echo "=========================================="
echo "  Available Test Commands"
echo "=========================================="
echo ""

if [ "$HAS_CONTROLNET" = true ] || [ -f "$TEST_IMAGE" ]; then
    echo -e "${GREEN}1. Test ControlNet (Segmentation)${NC}"
    echo "   Recommended for immediate testing!"
    echo ""
    echo "   python ext/veneer_generation/controlnet/test_pretrained_controlnet.py \\"
    echo "     --image $TEST_IMAGE \\"
    echo "     --output test_outputs/controlnet_seg_test.jpg \\"
    echo "     --controlnet-type segmentation"
    echo ""

    echo -e "${GREEN}2. Test ControlNet (Canny)${NC}"
    echo "   Alternative edge-based approach"
    echo ""
    echo "   python ext/veneer_generation/controlnet/test_pretrained_controlnet.py \\"
    echo "     --image $TEST_IMAGE \\"
    echo "     --output test_outputs/controlnet_canny_test.jpg \\"
    echo "     --controlnet-type canny"
    echo ""
fi

if [ "$HAS_PIX2PIX" = true ]; then
    echo -e "${YELLOW}3. Test Pix2pix (Pretrained - For Architecture Testing Only)${NC}"
    echo "   Note: Will NOT produce veneers, just tests infrastructure"
    echo ""
    echo "   python ext/veneer_generation/pix2pix/test_pretrained_pix2pix.py \\"
    echo "     --image $TEST_IMAGE \\"
    echo "     --output test_outputs/pix2pix_test.jpg"
    echo ""
fi

echo -e "${BLUE}4. List Available Models${NC}"
echo "   See what models are configured"
echo ""
echo "   cd services/veneer-preview && python config.py"
echo ""

# Offer to run a test
echo "=========================================="
echo ""

if [ "$HAS_CONTROLNET" = true ] || [ -z "$(ls -A $CONTROLNET_DIR 2>/dev/null)" ]; then
    echo "Would you like to run a ControlNet test now? (y/n)"
    read -r response

    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo ""
        echo -e "${BLUE}Running ControlNet test...${NC}"
        echo "This may take a few minutes on first run (downloading base model)..."
        echo ""

        python3 ext/veneer_generation/controlnet/test_pretrained_controlnet.py \
            --image "$TEST_IMAGE" \
            --output test_outputs/controlnet_seg_test.jpg \
            --controlnet-type segmentation \
            --steps 20 \
            --guidance 7.5 \
            --seed 42

        echo ""
        echo -e "${GREEN}✓ Test complete!${NC}"
        echo "Check output: test_outputs/controlnet_seg_test.jpg"
        echo ""
        echo "The output shows:"
        echo "  - Left: Original image"
        echo "  - Middle: Conditioning (segmentation mask)"
        echo "  - Right: Generated veneer preview"
    fi
else
    echo -e "${YELLOW}Run ./setup_pretrained_models.sh first to download models${NC}"
fi

echo ""
echo "=========================================="
echo "  Setup Verification Complete"
echo "=========================================="
echo ""
echo "For detailed documentation, see:"
echo "  - PRETRAINED_MODELS_GUIDE.md"
echo "  - ext/veneer_generation/controlnet/test_pretrained_controlnet.py"
echo ""
