#!/bin/bash
# Download pretrained pix2pix weights from pytorch-CycleGAN-and-pix2pix
# https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix

set -e

echo "================================================"
echo "Downloading Pretrained Pix2pix Weights"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Create checkpoints directory
CHECKPOINT_DIR="pix2pix/checkpoints"
mkdir -p "$CHECKPOINT_DIR"

echo "Available pretrained models:"
echo "  1. facades_pix2pix - Building facades (architectural)"
echo "  2. maps_pix2pix - Map to aerial photo"
echo "  3. edges2shoes_pix2pix - Sketch to shoe"
echo "  4. edges2handbags_pix2pix - Sketch to handbag"
echo ""
echo -e "${YELLOW}Note: These are general models. For dental veneers, you'll need to train your own model.${NC}"
echo "      However, you can use these to test the inference pipeline!"
echo ""

read -p "Which model do you want to download? (1-4, or 'q' to quit): " choice

case $choice in
    1)
        MODEL_NAME="facades_pix2pix"
        ;;
    2)
        MODEL_NAME="maps_pix2pix"
        ;;
    3)
        MODEL_NAME="edges2shoes_pix2pix"
        ;;
    4)
        MODEL_NAME="edges2handbags_pix2pix"
        ;;
    q|Q)
        echo "Cancelled."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "Downloading $MODEL_NAME..."
echo ""

# Download from official repo
BASE_URL="https://people.eecs.berkeley.edu/~taesung_park/CycleGAN/pretrained_models"
MODEL_FILE="${MODEL_NAME}.pth"
DOWNLOAD_URL="$BASE_URL/$MODEL_FILE"

# Download using curl
if command -v curl &> /dev/null; then
    curl -L -o "$CHECKPOINT_DIR/$MODEL_FILE" "$DOWNLOAD_URL"
elif command -v wget &> /dev/null; then
    wget -O "$CHECKPOINT_DIR/$MODEL_FILE" "$DOWNLOAD_URL"
else
    echo -e "${RED}Error: Neither curl nor wget found. Please install one.${NC}"
    exit 1
fi

if [ -f "$CHECKPOINT_DIR/$MODEL_FILE" ]; then
    FILE_SIZE=$(ls -lh "$CHECKPOINT_DIR/$MODEL_FILE" | awk '{print $5}')
    echo ""
    echo -e "${GREEN}✓ Download complete!${NC}"
    echo "  Location: $CHECKPOINT_DIR/$MODEL_FILE"
    echo "  Size: $FILE_SIZE"
    echo ""
    echo "Test the model with:"
    echo "  python pix2pix/inference_pix2pix.py \\"
    echo "    --checkpoint $CHECKPOINT_DIR/$MODEL_FILE \\"
    echo "    --input your_image.jpg \\"
    echo "    --output result.jpg \\"
    echo "    --device mps"
    echo ""
else
    echo -e "${RED}✗ Download failed${NC}"
    exit 1
fi
