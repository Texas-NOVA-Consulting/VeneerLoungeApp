#!/bin/bash
# Setup Script for ControlNet Pretrained Models
# This script downloads pretrained ControlNet weights and sets up the environment

set -e

echo "========================================"
echo "ControlNet Pretrained Model Setup"
echo "========================================"

# Create directories
echo "Creating directories..."
mkdir -p ext/veneer_generation/checkpoints/controlnet
mkdir -p ext/veneer_generation/annotator/ckpts

cd ext/veneer_generation/checkpoints/controlnet

# Download ControlNet Semantic Segmentation Model (best for teeth segmentation)
echo ""
echo "Downloading ControlNet Semantic Segmentation model..."
echo "This model works with segmentation masks (like your tooth segmentation)"
wget -c https://huggingface.co/lllyasviel/ControlNet/resolve/main/models/control_sd15_seg.pth -O control_sd15_seg.pth

# Optional: Download other useful models
echo ""
echo "Downloading ControlNet Canny Edge model (backup option)..."
wget -c https://huggingface.co/lllyasviel/ControlNet/resolve/main/models/control_sd15_canny.pth -O control_sd15_canny.pth

echo ""
echo "========================================"
echo "✓ ControlNet models downloaded!"
echo "========================================"
echo ""
echo "Downloaded to: ext/veneer_generation/checkpoints/controlnet/"
echo "  - control_sd15_seg.pth (segmentation-based)"
echo "  - control_sd15_canny.pth (edge-based)"
echo ""
echo "Next steps:"
echo "1. Update your backend to use ControlNet instead of Pix2pix"
echo "2. No training needed - these are pretrained!"
echo "3. Start the backend and test"
echo ""
