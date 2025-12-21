#!/bin/bash
# Setup virtual environment for VeneerVision AI

set -e

echo "=========================================="
echo "  Virtual Environment Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if venv already exists
if [ -d "venv" ]; then
    echo -e "${YELLOW}Virtual environment already exists at ./venv${NC}"
    echo "Do you want to remove it and create a new one? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Removing old virtual environment...${NC}"
        rm -rf venv
    else
        echo -e "${YELLOW}Using existing virtual environment${NC}"
        source venv/bin/activate
        echo -e "${GREEN}✓ Virtual environment activated${NC}"
        echo ""
        echo "To activate in the future, run:"
        echo "  source venv/bin/activate"
        exit 0
    fi
fi

# Create virtual environment
echo -e "${BLUE}Creating virtual environment...${NC}"
python3 -m venv venv

echo -e "${GREEN}✓ Virtual environment created${NC}"
echo ""

# Activate virtual environment
echo -e "${BLUE}Activating virtual environment...${NC}"
source venv/bin/activate

echo -e "${GREEN}✓ Virtual environment activated${NC}"
echo ""

# Upgrade pip
echo -e "${BLUE}Upgrading pip...${NC}"
pip install --upgrade pip

echo -e "${GREEN}✓ pip upgraded${NC}"
echo ""

# Install requirements
echo -e "${BLUE}Installing requirements...${NC}"
echo "This will take a few minutes (installing PyTorch, diffusers, etc.)"
echo ""

pip install -r ext/veneer_generation/requirements.txt

echo ""
echo -e "${GREEN}✓ All requirements installed${NC}"
echo ""

# Verify installation
echo -e "${BLUE}Verifying installation...${NC}"
python -c "import torch; print(f'PyTorch version: {torch.__version__}')"
python -c "import diffusers; print(f'Diffusers version: {diffusers.__version__}')"
python -c "import transformers; print(f'Transformers version: {transformers.__version__}')"

echo ""
echo "=========================================="
echo -e "${GREEN}  Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Your virtual environment is activated."
echo ""
echo "To activate it in the future:"
echo -e "  ${BLUE}source venv/bin/activate${NC}"
echo ""
echo "To deactivate:"
echo -e "  ${BLUE}deactivate${NC}"
echo ""
echo "Next steps:"
echo "  1. Download pretrained models:"
echo "     ./setup_pretrained_models.sh"
echo ""
echo "  2. Test the setup:"
echo "     ./test_pretrained_setup.sh"
echo ""
