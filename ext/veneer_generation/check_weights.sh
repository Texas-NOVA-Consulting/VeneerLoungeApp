#!/bin/bash
# Check if pix2pix weights are available and show their info

echo "================================================"
echo "Checking Pix2pix Model Weights"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

CHECKPOINT_DIR="pix2pix/checkpoints"

# Check if directory exists
if [ ! -d "$CHECKPOINT_DIR" ]; then
    echo -e "${RED}✗ Checkpoints directory not found: $CHECKPOINT_DIR${NC}"
    echo ""
    echo "Run ./download_pretrained_weights.sh to download pretrained models"
    echo "Or train your own model with: python pix2pix/train_pix2pix.py"
    exit 1
fi

# Find all .pth files
echo "Looking for model weights..."
echo ""

MODEL_COUNT=0
shopt -s nullglob
for model in "$CHECKPOINT_DIR"/*.pth; do
    if [ -f "$model" ]; then
        MODEL_COUNT=$((MODEL_COUNT + 1))
        BASENAME=$(basename "$model")
        SIZE=$(ls -lh "$model" | awk '{print $5}')
        MODIFIED=$(ls -l "$model" | awk '{print $6, $7, $8}')

        echo -e "${GREEN}✓ Found: $BASENAME${NC}"
        echo "  Path: $model"
        echo "  Size: $SIZE"
        echo "  Modified: $MODIFIED"

        # Try to get model info using Python
        if command -v python &> /dev/null; then
            echo -e "  ${BLUE}Checking model structure...${NC}"
            python - <<EOF 2>/dev/null
import torch
try:
    checkpoint = torch.load("$model", map_location='cpu')
    if isinstance(checkpoint, dict):
        print("  Keys:", ", ".join(checkpoint.keys()))
        if 'netG_state_dict' in checkpoint:
            params = sum(p.numel() for p in checkpoint['netG_state_dict'].values())
            print(f"  Generator parameters: {params:,}")
        if 'epoch' in checkpoint:
            print(f"  Trained epochs: {checkpoint['epoch']}")
    else:
        print("  Type: Direct state dict")
except Exception as e:
    print(f"  Error reading: {e}")
EOF
        fi
        echo ""
    fi
done

if [ $MODEL_COUNT -eq 0 ]; then
    echo -e "${YELLOW}No model weights found in $CHECKPOINT_DIR${NC}"
    echo ""
    echo "Options:"
    echo "  1. Download pretrained weights: ./download_pretrained_weights.sh"
    echo "  2. Train your own model: python pix2pix/train_pix2pix.py"
    echo ""
    exit 1
else
    echo "================================================"
    echo -e "${GREEN}Total models found: $MODEL_COUNT${NC}"
    echo "================================================"
    echo ""
    echo "To use a model for inference:"
    echo "  python pix2pix/inference_pix2pix.py \\"
    echo "    --checkpoint $CHECKPOINT_DIR/YOUR_MODEL.pth \\"
    echo "    --input your_image.jpg \\"
    echo "    --output result.jpg \\"
    echo "    --device mps \\"
    echo "    --fast"
    echo ""
fi
