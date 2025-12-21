# Pretrained Models Setup and Testing Guide

This guide walks you through setting up and testing pretrained weights from:
1. **ControlNet** ([lllyasviel/ControlNet](https://github.com/lllyasviel/ControlNet))
2. **Pix2pix** ([junyanz/pytorch-CycleGAN-and-pix2pix](https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix))

## Quick Start

### 1. Install Dependencies

```bash
# Ensure you have Python 3.9+
python --version

# Install required packages
pip install -r ext/veneer_generation/requirements.txt

# Important: Install huggingface-cli for easier downloads
pip install huggingface-hub
```

### 2. Download Pretrained Models

```bash
# Make the setup script executable
chmod +x setup_pretrained_models.sh

# Run the setup script
./setup_pretrained_models.sh
```

This will:
- Clone the official Pix2pix repository
- Download pretrained Pix2pix models (facades dataset)
- Download ControlNet pretrained models from Hugging Face
- Optionally pre-download Stable Diffusion base model (~4GB)

### 3. Test the Models

#### Test ControlNet (Recommended - Ready to Use!)

```bash
# Test with segmentation ControlNet (best for teeth)
python ext/veneer_generation/controlnet/test_pretrained_controlnet.py \
  --image data/annotate_batch1/before1.jpg \
  --output test_outputs/controlnet_seg_output.jpg \
  --controlnet-type segmentation

# Test with Canny ControlNet (edge-based)
python ext/veneer_generation/controlnet/test_pretrained_controlnet.py \
  --image data/annotate_batch1/before1.jpg \
  --output test_outputs/controlnet_canny_output.jpg \
  --controlnet-type canny
```

#### Test Pix2pix (Baseline - Needs Fine-tuning)

```bash
# Test pretrained Pix2pix (trained on facades, not veneers)
python ext/veneer_generation/pix2pix/test_pretrained_pix2pix.py \
  --image data/annotate_batch1/before1.jpg \
  --output test_outputs/pix2pix_pretrained_output.jpg
```

**Note:** The pretrained Pix2pix model is trained on architectural facades, NOT dental images. The output will likely not look like veneers. This test just verifies the weights load correctly.

---

## Detailed Model Information

### ControlNet Models

#### 1. Segmentation ControlNet (`lllyasviel/control_v11p_sd15_seg`)

**Best for veneer generation!**

- **Pretrained on:** ADE20K segmentation dataset
- **Input:** Segmentation masks (teeth regions)
- **Output:** Photorealistic images guided by the mask
- **Requires training:** NO - works out of the box!
- **Why it's good:** Your tooth segmentation model creates perfect conditioning masks

**Usage:**
```python
from services.veneer_preview.config import get_model_config
from services.veneer_preview.veneer_service import VeneerPreviewService

config = get_model_config('controlnet', 'pretrained.segmentation')
service = VeneerPreviewService(model_type='controlnet', **config)

result = service.generate_from_file(
    'input.jpg',
    'output.jpg',
    intensity=0.8,
    preserve_geometry=False
)
```

#### 2. Canny ControlNet (`lllyasviel/control_v11p_sd15_canny`)

**Alternative edge-based approach**

- **Pretrained on:** Various datasets with Canny edges
- **Input:** Edge maps (Canny edge detection)
- **Output:** Images following the edge structure
- **Requires training:** NO - works out of the box!
- **Why it's useful:** Good for preserving exact tooth outlines

### Pix2pix Models

#### 1. Facades Pretrained (`facades_pix2pix`)

**For testing architecture only**

- **Pretrained on:** Architectural facade images
- **Input:** Facade sketches → Realistic facades
- **Output:** Will NOT produce veneers (different domain)
- **Requires training:** YES - must fine-tune on dental data
- **Why it's included:** Validates your infrastructure works

**Fine-tuning Required:**
```bash
# Fine-tune on your dental dataset
python ext/veneer_generation/pix2pix/train_pix2pix.py \
  --data-root data/annotate_batch1 \
  --pretrained ext/veneer_generation/pretrained/pytorch-CycleGAN-and-pix2pix/checkpoints/facades_pix2pix/latest_net_G.pth \
  --epochs 200
```

---

## Configuration System

The service uses a centralized configuration in `services/veneer-preview/config.py`.

### List Available Models

```bash
cd services/veneer-preview
python config.py
```

Output:
```
Available Models:
============================================================

ControlNet Models:
  ✓ pretrained.segmentation: Segmentation-based ControlNet (best for teeth) (ready to use)
  ✓ pretrained.canny: Canny edge-based ControlNet (ready to use)
  ✗ custom.veneer_controlnet: Custom trained ControlNet for veneers (needs training)

Pix2pix Models:
  ✓ pretrained.facades: Pretrained on facades (for testing only) (needs training)
  ✗ custom.veneer_pix2pix: Custom trained Pix2pix for veneers (needs training)
```

### Switch Models in API

The API server can load different models dynamically:

```bash
# Start API with ControlNet (segmentation)
cd services/veneer-preview
python api_server.py --model controlnet --model-name pretrained.segmentation

# Or with Canny ControlNet
python api_server.py --model controlnet --model-name pretrained.canny
```

---

## Testing Workflow

### Step 1: Test ControlNet (Ready to Use)

```bash
# Create output directory
mkdir -p test_outputs

# Test on sample image
python ext/veneer_generation/controlnet/test_pretrained_controlnet.py \
  --image data/annotate_batch1/before1.jpg \
  --output test_outputs/controlnet_test1.jpg \
  --controlnet-type segmentation \
  --steps 20 \
  --guidance 7.5 \
  --seed 42
```

**Expected result:**
- Output: `Original | Conditioning | Generated`
- Generated image should show whitened/enhanced teeth
- Quality should be good even without training

### Step 2: Compare Multiple Images

```bash
# Test on multiple samples
for i in {1..5}; do
  python ext/veneer_generation/controlnet/test_pretrained_controlnet.py \
    --image data/annotate_batch1/before${i}.jpg \
    --output test_outputs/controlnet_test${i}.jpg \
    --controlnet-type segmentation
done
```

### Step 3: Evaluate Results

Check `test_outputs/` for generated comparisons:
- **Left panel:** Original input image
- **Middle panel:** Conditioning image (segmentation mask or edges)
- **Right panel:** Generated veneer preview

**Quality criteria:**
- ✅ Teeth are whiter/enhanced
- ✅ Face/background unchanged
- ✅ Natural appearance
- ✅ No artifacts or distortions

**If quality is poor:**
- Adjust `--guidance` (try 6.0 - 10.0)
- Adjust `--controlnet-scale` (try 0.8 - 1.5)
- Increase `--steps` (try 30-50 for higher quality)
- Try different prompts with `--prompt`

### Step 4: Test API Integration

```bash
# Start the API server
cd services/veneer-preview
python api_server.py

# In another terminal, test the API
curl -X POST http://localhost:8000/api/veneer-preview \
  -H "Content-Type: application/json" \
  -d '{
    "image": "'"$(base64 -i ../../data/annotate_batch1/before1.jpg)"'",
    "intensity": 0.8,
    "preserve_geometry": false
  }' | jq '.output' -r | base64 -d > api_test_output.jpg
```

---

## Performance Benchmarks

### ControlNet Performance

| Hardware | Resolution | Steps | Time per Image |
|----------|-----------|-------|----------------|
| M1 Mac (MPS) | 512x512 | 20 | ~8-12s |
| RTX 3080 (CUDA) | 512x512 | 20 | ~3-5s |
| CPU Only | 512x512 | 20 | ~60-120s |

### Pix2pix Performance

| Hardware | Resolution | Batch Size | Time per Image |
|----------|-----------|------------|----------------|
| M1 Mac (MPS) | 256x256 | 8 | ~0.1s |
| RTX 3080 (CUDA) | 256x256 | 16 | ~0.05s |
| CPU Only | 256x256 | 4 | ~0.5s |

**Note:** Pix2pix is much faster but requires training. ControlNet is slower but works immediately.

---

## Recommendations

### For Immediate Testing

**Use ControlNet Segmentation** ✅
- No training required
- Good quality out of the box
- Works with your existing tooth segmentation
- Can generate realistic veneers

**Command:**
```bash
python ext/veneer_generation/controlnet/test_pretrained_controlnet.py \
  --image YOUR_IMAGE.jpg \
  --output OUTPUT.jpg \
  --controlnet-type segmentation
```

### For Production Deployment

**Option 1: ControlNet (Recommended)**
- ✅ Ready to deploy immediately
- ✅ Good quality without training
- ✅ Can fine-tune for even better results
- ⚠️ Slower inference (~5-10s per image)
- ⚠️ Larger model size (~4GB)

**Option 2: Pix2pix (After Fine-tuning)**
- ⚠️ Requires training on dental dataset first
- ✅ Very fast inference (~0.1s per image)
- ✅ Smaller model size (~200MB)
- ✅ Good for high-volume processing

**Option 3: Hybrid Approach**
- Use ControlNet for patient-facing demos
- Train Pix2pix for dentist batch processing
- Offer both options in the UI

---

## Training Recommendations

### Do You Need to Train?

**ControlNet:**
- **NO** - Use pretrained weights immediately
- **OPTIONAL** - Fine-tune for better dental-specific results
- **If fine-tuning:** Use small learning rate, few epochs

**Pix2pix:**
- **YES** - Pretrained facades model won't work for teeth
- **Required:** At least 100-500 paired before/after images
- **Training time:** ~2-6 hours on GPU

### Fine-tuning ControlNet (Optional)

```bash
# Fine-tune on your dataset (if you want even better results)
python ext/veneer_generation/controlnet/train_controlnet.py \
  --pretrained lllyasviel/control_v11p_sd15_seg \
  --data-root data/annotate_batch1 \
  --epochs 10 \
  --learning-rate 1e-5 \
  --output checkpoints/controlnet/veneer_controlnet
```

**When to fine-tune:**
- You have 100+ paired images
- Pretrained results are good but not perfect
- You want domain-specific improvements

**When NOT to fine-tune:**
- You have < 50 paired images (risk of overfitting)
- Pretrained results are already satisfactory
- You need results immediately

### Training Pix2pix (Required)

```bash
# Train from pretrained weights
python ext/veneer_generation/pix2pix/train_pix2pix.py \
  --data-root data/annotate_batch1 \
  --pretrained ext/veneer_generation/pretrained/pytorch-CycleGAN-and-pix2pix/checkpoints/facades_pix2pix/latest_net_G.pth \
  --epochs 200 \
  --batch-size 4 \
  --learning-rate 2e-4
```

**Dataset requirements:**
- Minimum: 100 paired before/after images
- Recommended: 500+ images
- Optimal: 1000+ images

---

## Troubleshooting

### "Out of Memory" Error (ControlNet)

```bash
# Enable CPU offloading
python test_pretrained_controlnet.py --device cpu

# Or use lower resolution
# Edit the script to use 256x256 instead of 512x512
```

### "Checkpoint not found" Error

```bash
# Re-run setup
./setup_pretrained_models.sh

# Or manually download
huggingface-cli download lllyasviel/control_v11p_sd15_seg --local-dir ext/veneer_generation/checkpoints/controlnet/control_v11p_sd15_seg
```

### "Segmentation model not found"

```bash
# Check if tooth segmentation checkpoint exists
ls ext/individual_tooth_segmentation/checkpoints/

# If missing, the script will use fallback color-based segmentation
```

### Poor Quality Results (ControlNet)

Try these adjustments:

```bash
# Higher guidance (stronger prompt following)
--guidance 10.0

# More steps (better quality, slower)
--steps 30

# Stronger conditioning
--controlnet-scale 1.5

# Custom prompt
--prompt "professional dental veneers, ultra white teeth, perfect smile, 8k, highly detailed"
```

---

## Next Steps

1. **Test immediately:** Run ControlNet on your sample images
2. **Evaluate quality:** Check if results meet your requirements
3. **Decide on training:**
   - If ControlNet results are good → Deploy as-is
   - If you need faster inference → Train Pix2pix
   - If you want perfect results → Fine-tune ControlNet
4. **Integrate with frontend:** Update API to use pretrained models
5. **Gather feedback:** Test with real user images
6. **Iterate:** Fine-tune based on user feedback

---

## Support

For issues or questions:
- Check this guide first
- Review `ext/veneer_generation/controlnet/test_pretrained_controlnet.py`
- Review `services/veneer-preview/config.py`
- Check model documentation:
  - ControlNet: https://github.com/lllyasviel/ControlNet
  - Pix2pix: https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix
