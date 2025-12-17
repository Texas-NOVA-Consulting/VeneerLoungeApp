#!/bin/bash
# Automated setup script for Mac (Apple Silicon)
# This script sets up the veneer generation environment

set -e  # Exit on error

echo "=================================="
echo "Veneer Generation Setup - Mac"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check architecture
ARCH=$(uname -m)
if [ "$ARCH" != "arm64" ]; then
    echo -e "${YELLOW}Warning: This script is optimized for Apple Silicon (M-series). You're on $ARCH${NC}"
fi

# Check Python version
echo "Checking Python version..."
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d. -f1)
PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d. -f2)

echo "Found Python $PYTHON_VERSION"

# Check if Python 3.11 is available
if command -v python3.11 &> /dev/null; then
    echo -e "${GREEN}✓ Python 3.11 found${NC}"
    PYTHON_CMD="python3.11"
elif command -v python3.12 &> /dev/null; then
    echo -e "${GREEN}✓ Python 3.12 found${NC}"
    PYTHON_CMD="python3.12"
else
    echo -e "${YELLOW}Warning: Python 3.11/3.12 not found. Using Python $PYTHON_VERSION${NC}"
    echo "PyTorch may not install correctly with Python 3.14+"
    echo ""
    echo "Install Python 3.11 with: brew install python@3.11"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    PYTHON_CMD="python3"
fi

echo ""
echo "Using: $PYTHON_CMD"
echo ""

# Create virtual environment
echo "Creating virtual environment..."
if [ -d "venv" ]; then
    echo -e "${YELLOW}Removing existing venv...${NC}"
    rm -rf venv
fi

$PYTHON_CMD -m venv venv
source venv/bin/activate

echo -e "${GREEN}✓ Virtual environment created${NC}"
echo ""

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip setuptools wheel > /dev/null 2>&1
echo -e "${GREEN}✓ pip upgraded${NC}"
echo ""

# Install PyTorch
echo "Installing PyTorch for Mac..."
echo "This may take a few minutes..."

# Try to install PyTorch
if pip install torch torchvision torchaudio > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PyTorch installed successfully${NC}"
else
    echo -e "${RED}✗ PyTorch installation failed${NC}"
    echo "Trying nightly build..."
    if pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cpu > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PyTorch nightly installed${NC}"
    else
        echo -e "${RED}✗ PyTorch installation failed${NC}"
        echo "Please install manually. See SETUP_MAC_INSTALLATION.md for details."
        exit 1
    fi
fi

echo ""

# Verify PyTorch
echo "Verifying PyTorch installation..."
python -c "import torch; print(f'PyTorch version: {torch.__version__}')" 2>/dev/null
if [ $? -eq 0 ]; then
    python -c "import torch; print(f'MPS (GPU) available: {torch.backends.mps.is_available()}')" 2>/dev/null
    echo -e "${GREEN}✓ PyTorch working${NC}"
else
    echo -e "${RED}✗ PyTorch verification failed${NC}"
    exit 1
fi

echo ""

# Install other dependencies
echo "Installing other dependencies..."
if pip install -r requirements-mac.txt > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${YELLOW}Warning: Some dependencies may have failed to install${NC}"
    echo "Run: pip install -r requirements-mac.txt"
fi

echo ""
echo "=================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=================================="
echo ""
echo "To activate the environment in the future:"
echo "  cd /Users/joshuawu/VeneerLoungeApp/ext/veneer_generation"
echo "  source venv/bin/activate"
echo ""
echo "Next steps:"
echo "  1. Prepare dataset: python scripts/prepare_veneer_dataset.py"
echo "  2. Train model: python pix2pix/train_pix2pix.py"
echo "  3. Run inference: python pix2pix/inference_pix2pix.py"
echo ""
