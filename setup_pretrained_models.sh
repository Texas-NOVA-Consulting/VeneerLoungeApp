#!/bin/bash
# Setup Script for Pretrained Models
# Downloads and configures pretrained weights from:
# 1. junyanz/pytorch-CycleGAN-and-pix2pix (Pix2pix)
# 2. lllyasviel/ControlNet (ControlNet)

set -e

echo "=========================================="
echo "  Pretrained Model Setup for VeneerVision"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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
# PART 1: Pix2pix Pretrained Weights
# ============================================
echo "=========================================="
echo "  1. Pix2pix Pretrained Weights"
echo "=========================================="
echo ""
echo "Repository: https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix"
echo ""

cd ext/veneer_generation/pretrained

# Clone the official Pix2pix repository if not already cloned
if [ ! -d "pytorch-CycleGAN-and-pix2pix" ]; then
    echo -e "${BLUE}Cloning official Pix2pix repository...${NC}"
    git clone https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix.git
    echo -e "${GREEN}✓ Repository cloned${NC}"
else
    echo -e "${YELLOW}Repository already exists, skipping clone${NC}"
fi

cd pytorch-CycleGAN-and-pix2pix

# Download pretrained Pix2pix models
echo ""
echo -e "${BLUE}Available Pix2pix pretrained models:${NC}"
echo "  1. facades (architecture translation)"
echo "  2. edges2shoes (edge to photo)"
echo "  3. edges2handbags (edge to photo)"
echo "  4. maps (map to satellite)"
echo ""
echo "Downloading facades model for testing (similar to teeth before/after)..."

bash ./scripts/download_pix2pix_model.sh facades

echo -e "${GREEN}✓ Pix2pix pretrained model downloaded${NC}"
echo "Location: ext/veneer_generation/pretrained/pytorch-CycleGAN-and-pix2pix/checkpoints/facades_pix2pix/"
echo ""

# Copy to our checkpoints directory
echo -e "${BLUE}Creating symlink to our checkpoints directory...${NC}"
cd ../../../..
ln -sf "$(pwd)/ext/veneer_generation/pretrained/pytorch-CycleGAN-and-pix2pix/checkpoints" \
       "$(pwd)/ext/veneer_generation/checkpoints/pix2pix_pretrained"
echo -e "${GREEN}✓ Symlink created${NC}"
echo ""

# ============================================
# PART 2: ControlNet Pretrained Weights
# ============================================
echo "=========================================="
echo "  2. ControlNet Pretrained Weights"
echo "=========================================="
echo ""
echo "Repository: https://github.com/lllyasviel/ControlNet"
echo ""

cd ext/veneer_generation/checkpoints/controlnet

# Download ControlNet models from Hugging Face
echo -e "${BLUE}Downloading ControlNet models from Hugging Face...${NC}"
echo ""

# Check if huggingface-cli is available, if not use wget
if command -v huggingface-cli &> /dev/null; then
    echo "Using huggingface-cli for download..."

    # Segmentation model (BEST for teeth since we have segmentation)
    echo -e "${BLUE}1. Downloading Segmentation ControlNet...${NC}"
    huggingface-cli download lllyasviel/control_v11p_sd15_seg \
        --local-dir ./control_v11p_sd15_seg \
        --local-dir-use-symlinks False

    # Canny edge model (backup option)
    echo -e "${BLUE}2. Downloading Canny ControlNet...${NC}"
    huggingface-cli download lllyasviel/control_v11p_sd15_canny \
        --local-dir ./control_v11p_sd15_canny \
        --local-dir-use-symlinks False
else
    echo "huggingface-cli not found, using wget..."

    # Create directories
    mkdir -p control_v11p_sd15_seg
    mkdir -p control_v11p_sd15_canny

    # Download segmentation model files
    echo -e "${BLUE}1. Downloading Segmentation ControlNet (using wget)...${NC}"
    cd control_v11p_sd15_seg
    wget -c https://huggingface.co/lllyasviel/control_v11p_sd15_seg/resolve/main/config.json
    wget -c https://huggingface.co/lllyasviel/control_v11p_sd15_seg/resolve/main/diffusion_pytorch_model.safetensors
    cd ..

    # Download canny model files
    echo -e "${BLUE}2. Downloading Canny ControlNet (using wget)...${NC}"
    cd control_v11p_sd15_canny
    wget -c https://huggingface.co/lllyasviel/control_v11p_sd15_canny/resolve/main/config.json
    wget -c https://huggingface.co/lllyasviel/control_v11p_sd15_canny/resolve/main/diffusion_pytorch_model.safetensors
    cd ..
fi

echo -e "${GREEN}✓ ControlNet models downloaded${NC}"
echo ""

# Return to root directory
cd ../../../..

# ============================================
# PART 3: Base Stable Diffusion Model
# ============================================
echo "=========================================="
echo "  3. Base Stable Diffusion Model"
echo "=========================================="
echo ""
echo "ControlNet requires a base Stable Diffusion model."
echo "We'll use runwayml/stable-diffusion-v1-5 (will auto-download on first use)"
echo ""
echo -e "${YELLOW}Note: The base model will be automatically downloaded by diffusers${NC}"
echo -e "${YELLOW}when you first run the ControlNet pipeline (~4GB download).${NC}"
echo ""

# Optional: Pre-download the base model
echo "Do you want to pre-download the Stable Diffusion base model now? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    python3 -c "
from diffusers import StableDiffusionPipeline
print('Downloading Stable Diffusion v1.5...')
pipe = StableDiffusionPipeline.from_pretrained('runwayml/stable-diffusion-v1-5')
print('✓ Base model downloaded and cached')
"
    echo -e "${GREEN}✓ Base model pre-downloaded${NC}"
else
    echo -e "${YELLOW}Skipping pre-download. Model will download on first use.${NC}"
fi

echo ""

# ============================================
# PART 4: Summary and Configuration
# ============================================
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo -e "${GREEN}Downloaded Models:${NC}"
echo ""
echo "1. Pix2pix Pretrained:"
echo "   - Location: ext/veneer_generation/pretrained/pytorch-CycleGAN-and-pix2pix/"
echo "   - Model: facades_pix2pix (architectural facade translation)"
echo "   - Can be used for testing, but will need training on dental data"
echo ""
echo "2. ControlNet Pretrained:"
echo "   - Segmentation: ext/veneer_generation/checkpoints/controlnet/control_v11p_sd15_seg/"
echo "   - Canny: ext/veneer_generation/checkpoints/controlnet/control_v11p_sd15_canny/"
echo "   - These models can work out-of-the-box with your tooth segmentation!"
echo ""
echo "3. Stable Diffusion Base:"
echo "   - Will be cached in ~/.cache/huggingface/"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Test ControlNet (recommended - no training needed):"
echo "   python ext/veneer_generation/controlnet/test_pretrained_controlnet.py \\"
echo "     --image data/annotate_batch1/before1.jpg \\"
echo "     --output test_controlnet_output.jpg"
echo ""
echo "2. Test Pix2pix pretrained (for comparison):"
echo "   python ext/veneer_generation/pix2pix/test_pretrained_pix2pix.py \\"
echo "     --image data/annotate_batch1/before1.jpg \\"
echo "     --output test_pix2pix_output.jpg"
echo ""
echo "3. Start the API server:"
echo "   cd services/veneer-preview"
echo "   python api_server.py"
echo ""
echo -e "${GREEN}Setup completed successfully!${NC}"
