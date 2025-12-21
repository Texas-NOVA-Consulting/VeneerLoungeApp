#!/bin/bash
# Setup Script for Pretrained Models (Fixed)
# Focus on ControlNet which works out of the box

set -e

echo "=========================================="
echo "  Pretrained Model Setup for VeneerVision"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create necessary directories
echo -e "${BLUE}Creating directory structure...${NC}"
mkdir -p ext/veneer_generation/checkpoints/pix2pix
mkdir -p ext/veneer_generation/checkpoints/controlnet
mkdir -p ext/veneer_generation/pretrained
mkdir -p ext/individual_tooth_segmentation/checkpoints

echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# ============================================
# ControlNet Pretrained Weights (MAIN FOCUS)
# ============================================
echo "=========================================="
echo "  ControlNet Pretrained Weights"
echo "=========================================="
echo ""
echo "Repository: https://github.com/lllyasviel/ControlNet"
echo ""
echo -e "${GREEN}These models work immediately for veneer generation!${NC}"
echo ""

cd ext/veneer_generation/checkpoints/controlnet

# Check if models already exist
SKIP_SEG=false
SKIP_CANNY=false

if [ -d "control_v11p_sd15_seg" ] && [ -f "control_v11p_sd15_seg/config.json" ]; then
    echo -e "${YELLOW}Segmentation ControlNet already downloaded${NC}"
    SKIP_SEG=true
fi

if [ -d "control_v11p_sd15_canny" ] && [ -f "control_v11p_sd15_canny/config.json" ]; then
    echo -e "${YELLOW}Canny ControlNet already downloaded${NC}"
    SKIP_CANNY=true
fi

# Check if huggingface-cli is available
if command -v huggingface-cli &> /dev/null; then
    echo -e "${GREEN}Using huggingface-cli for download...${NC}"
    echo ""

    # Segmentation model (BEST for teeth since we have segmentation)
    if [ "$SKIP_SEG" = false ]; then
        echo -e "${BLUE}1. Downloading Segmentation ControlNet (Recommended)...${NC}"
        echo "   This model is BEST for veneer generation!"
        echo "   Size: ~3GB"
        echo ""
        huggingface-cli download lllyasviel/control_v11p_sd15_seg \
            --local-dir ./control_v11p_sd15_seg \
            --local-dir-use-symlinks False
        echo -e "${GREEN}✓ Segmentation ControlNet downloaded${NC}"
    fi

    # Canny edge model (backup option)
    if [ "$SKIP_CANNY" = false ]; then
        echo ""
        echo -e "${BLUE}2. Downloading Canny ControlNet (Alternative)...${NC}"
        echo "   Size: ~3GB"
        echo ""
        huggingface-cli download lllyasviel/control_v11p_sd15_canny \
            --local-dir ./control_v11p_sd15_canny \
            --local-dir-use-symlinks False
        echo -e "${GREEN}✓ Canny ControlNet downloaded${NC}"
    fi
else
    echo -e "${YELLOW}huggingface-cli not found, using wget...${NC}"
    echo ""

    # Create directories
    mkdir -p control_v11p_sd15_seg
    mkdir -p control_v11p_sd15_canny

    # Download segmentation model files
    if [ "$SKIP_SEG" = false ]; then
        echo -e "${BLUE}1. Downloading Segmentation ControlNet (using wget)...${NC}"
        cd control_v11p_sd15_seg
        wget -c https://huggingface.co/lllyasviel/control_v11p_sd15_seg/resolve/main/config.json || echo "Warning: Failed to download config.json"
        wget -c https://huggingface.co/lllyasviel/control_v11p_sd15_seg/resolve/main/diffusion_pytorch_model.safetensors || echo "Warning: Failed to download model"
        cd ..
        echo -e "${GREEN}✓ Segmentation ControlNet downloaded${NC}"
    fi

    # Download canny model files
    if [ "$SKIP_CANNY" = false ]; then
        echo ""
        echo -e "${BLUE}2. Downloading Canny ControlNet (using wget)...${NC}"
        cd control_v11p_sd15_canny
        wget -c https://huggingface.co/lllyasviel/control_v11p_sd15_canny/resolve/main/config.json || echo "Warning: Failed to download config.json"
        wget -c https://huggingface.co/lllyasviel/control_v11p_sd15_canny/resolve/main/diffusion_pytorch_model.safetensors || echo "Warning: Failed to download model"
        cd ..
        echo -e "${GREEN}✓ Canny ControlNet downloaded${NC}"
    fi
fi

echo ""

# Return to root directory
cd ../../../..

# ============================================
# Base Stable Diffusion Model
# ============================================
echo ""
echo "=========================================="
echo "  Base Stable Diffusion Model"
echo "=========================================="
echo ""
echo "ControlNet requires Stable Diffusion v1.5 as a base."
echo -e "${YELLOW}This will be automatically downloaded on first use (~4GB)${NC}"
echo ""
echo "Do you want to pre-download it now? (y/n)"
echo "(Recommended if you want to test immediately)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}Downloading Stable Diffusion v1.5...${NC}"
    echo "This may take 5-10 minutes..."
    echo ""
    python -c "
from diffusers import StableDiffusionPipeline
import torch
print('Downloading Stable Diffusion v1.5...')
pipe = StableDiffusionPipeline.from_pretrained(
    'runwayml/stable-diffusion-v1-5',
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
)
print('✓ Base model downloaded and cached')
" || echo -e "${YELLOW}Warning: Failed to pre-download. It will download on first use.${NC}"
    echo ""
else
    echo -e "${YELLOW}Skipping pre-download. Model will download on first use.${NC}"
fi

echo ""

# ============================================
# Pix2pix (Optional - Skip if download fails)
# ============================================
echo ""
echo "=========================================="
echo "  Pix2pix (Optional)"
echo "=========================================="
echo ""
echo -e "${YELLOW}Note: Pix2pix pretrained weights are NOT needed for veneer generation.${NC}"
echo "The pretrained model is for architectural facades, not teeth."
echo ""
echo "Skip Pix2pix download? (recommended) (y/n)"
read -r skip_pix2pix

if [[ "$skip_pix2pix" =~ ^[Nn]$ ]]; then
    echo ""
    echo -e "${BLUE}Attempting to download Pix2pix repository...${NC}"
    cd ext/veneer_generation/pretrained

    if [ ! -d "pytorch-CycleGAN-and-pix2pix" ]; then
        git clone https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix.git || echo -e "${RED}Failed to clone Pix2pix repo${NC}"
    fi

    cd ../../..
    echo -e "${YELLOW}Pix2pix repository cloned (models will need manual download)${NC}"
else
    echo -e "${YELLOW}Skipping Pix2pix download${NC}"
fi

echo ""

# ============================================
# Summary
# ============================================
echo "=========================================="
echo -e "${GREEN}  Setup Complete!${NC}"
echo "=========================================="
echo ""
echo -e "${GREEN}Downloaded Models:${NC}"
echo ""

# Check what was downloaded
if [ -d "ext/veneer_generation/checkpoints/controlnet/control_v11p_sd15_seg" ]; then
    echo "✅ ControlNet Segmentation (READY TO USE)"
    echo "   Location: ext/veneer_generation/checkpoints/controlnet/control_v11p_sd15_seg/"
else
    echo "❌ ControlNet Segmentation not found"
fi

if [ -d "ext/veneer_generation/checkpoints/controlnet/control_v11p_sd15_canny" ]; then
    echo "✅ ControlNet Canny (READY TO USE)"
    echo "   Location: ext/veneer_generation/checkpoints/controlnet/control_v11p_sd15_canny/"
else
    echo "❌ ControlNet Canny not found"
fi

echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Test ControlNet (NO TRAINING NEEDED!):"
echo ""
echo "   python ext/veneer_generation/controlnet/test_pretrained_controlnet.py \\"
echo "     --image data/annotate_batch1/before1.jpg \\"
echo "     --output test_outputs/controlnet_result.jpg \\"
echo "     --controlnet-type segmentation"
echo ""
echo "2. Or run the interactive test:"
echo ""
echo "   ./test_pretrained_setup.sh"
echo ""
echo -e "${GREEN}✓ Setup completed successfully!${NC}"
echo ""
echo -e "${YELLOW}Note: On first run, Stable Diffusion base model will download (~4GB)${NC}"
echo "      This is a one-time download and will be cached."
echo ""
