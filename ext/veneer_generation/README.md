# Veneer Preview Generation System

## Overview

This directory contains the implementation for AI-powered veneer preview generation using two approaches:
1. **ControlNet + Stable Diffusion** (Primary) - For geometric and color transformations
2. **Pix2pix GAN** (Baseline) - For cosmetic-only transformations

## Why Two Approaches?

### ControlNet (Recommended)
- ✅ Handles tooth movement and alignment
- ✅ Better geometric transformations
- ✅ More photorealistic results
- ✅ Can fine-tune from pretrained models
- ❌ Slower inference (~2-5 seconds)
- ❌ Higher memory requirements

### Pix2pix (Fallback)
- ✅ Fast inference (~0.5 seconds)
- ✅ Lightweight model
- ✅ Good for pure cosmetic changes
- ❌ Struggles with geometric changes
- ❌ Limited to paired training only

## Directory Structure

```
ext/veneer_generation/
├── README.md                          # This file
├── requirements.txt                   # Python dependencies
├── controlnet/                        # ControlNet implementation
│   ├── train_controlnet.py           # Training script
│   ├── inference_controlnet.py       # Inference pipeline
│   ├── prepare_controlnet_data.py    # Data preparation
│   └── models/                        # Model definitions
├── pix2pix/                          # Pix2pix implementation (baseline)
│   ├── train_pix2pix.py             # Training script
│   ├── inference_pix2pix.py         # Inference pipeline
│   └── models/                       # Model definitions
├── evaluation/                       # Evaluation tools
│   ├── compare_models.py            # Compare ControlNet vs Pix2pix
│   ├── metrics.py                   # Quality metrics
│   └── visualize_results.py         # Visualization tools
└── checkpoints/                      # Saved model weights
    ├── controlnet/
    └── pix2pix/
```

## Quick Start

### 1. Install Dependencies

```bash
cd ext/veneer_generation
pip install -r requirements.txt
```

### 2. Prepare Data

```bash
# Generate segmentation masks for training data
python ../individual_tooth_segmentation/scripts/generate_masks_for_training.py

# Prepare ControlNet training data
python controlnet/prepare_controlnet_data.py \
    --dataset ../../../data/veneer_dataset \
    --output ../../../data/controlnet_dataset
```

### 3. Train Models

#### Option A: ControlNet (Recommended)
```bash
python controlnet/train_controlnet.py \
    --dataset ../../../data/controlnet_dataset \
    --pretrained runwayml/stable-diffusion-v1-5 \
    --epochs 100 \
    --batch_size 4
```

#### Option B: Pix2pix (Baseline)
```bash
python pix2pix/train_pix2pix.py \
    --dataset ../../../data/veneer_dataset \
    --epochs 200 \
    --batch_size 4
```

### 4. Run Inference

```bash
# ControlNet
python controlnet/inference_controlnet.py \
    --image path/to/smile.jpg \
    --output preview.jpg \
    --checkpoint checkpoints/controlnet/best.pth

# Pix2pix
python pix2pix/inference_pix2pix.py \
    --image path/to/smile.jpg \
    --output preview.jpg \
    --checkpoint checkpoints/pix2pix/latest.pth
```

## Model Comparison

| Feature | ControlNet | Pix2pix |
|---------|-----------|---------|
| Tooth Movement | ✅ Excellent | ❌ Poor |
| Color Changes | ✅ Excellent | ✅ Good |
| Training Time | ~1-2 days | ~6-12 hours |
| Inference Speed | 2-5 sec | 0.5 sec |
| Memory (GPU) | 8GB+ | 4GB+ |
| Dataset Size Needed | 50+ pairs | 100+ pairs |
| Pretrained Weights | ✅ Available | ❌ Train from scratch |

## Advanced Features

### Multi-Condition ControlNet
The ControlNet implementation supports multiple conditioning inputs:
- Tooth segmentation masks
- Edge/Canny detection
- Depth maps (optional)

### Tooth Landmark Prediction (Future)
If geometric transformations need improvement:
- Add facial landmark detection
- Predict target tooth positions
- Use landmarks as additional conditioning

## Integration with API

Both models are wrapped in a unified service:

```python
from veneer_generation import VeneerGenerator

generator = VeneerGenerator(
    model_type='controlnet',  # or 'pix2pix'
    checkpoint_path='checkpoints/controlnet/best.pth'
)

preview = generator.generate(
    image=input_image,
    intensity=0.8,  # How dramatic the changes are
    preserve_geometry=True  # Keep tooth positions
)
```

## Evaluation Metrics

- **PSNR** (Peak Signal-to-Noise Ratio): Image quality
- **SSIM** (Structural Similarity): Perceptual similarity
- **LPIPS** (Learned Perceptual): Deep perceptual similarity
- **FID** (Fréchet Inception Distance): Overall quality
- **Tooth Alignment Score**: Custom metric for tooth positioning

## Troubleshooting

### ControlNet Issues
- **OOM errors**: Reduce batch size or use gradient checkpointing
- **Slow training**: Use mixed precision (fp16)
- **Poor results**: Increase conditioning weight

### Pix2pix Issues
- **Blurry results**: Increase lambda_L1 weight
- **Mode collapse**: Adjust discriminator learning rate
- **Artifacts**: Add more training data or augmentation

## References

- [ControlNet Paper](https://arxiv.org/abs/2302.05543)
- [Pix2pix Paper](https://arxiv.org/abs/1611.07004)
- [Stable Diffusion](https://github.com/Stability-AI/stablediffusion)
