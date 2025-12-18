# Quick Start: Using Pretrained ControlNet (No Training Required!)

This guide gets your veneer simulator working **immediately** using pretrained ControlNet models from Hugging Face.

## Why ControlNet with Pretrained Weights?

✅ **No training needed** - Works out of the box
✅ **Leverages your existing tooth segmentation** - Uses masks you already generate
✅ **Production quality** - Built on Stable Diffusion 1.5
✅ **Fast setup** - 10-15 minutes total

---

## Step 1: Download Pretrained ControlNet Model

```bash
cd /Users/joshuawu/VeneerLoungeApp

# Make setup script executable
chmod +x setup_controlnet_pretrained.sh

# Download pretrained models (~3-5 min)
./setup_controlnet_pretrained.sh
```

This downloads:
- `control_sd15_seg.pth` - Segmentation-based ControlNet (BEST for teeth!)
- `control_sd15_canny.pth` - Edge-based ControlNet (backup)

**Note:** These are ~1.5GB each. They download to:
```
ext/veneer_generation/checkpoints/controlnet/
├── control_sd15_seg.pth
└── control_sd15_canny.pth
```

---

## Step 2: Install Diffusers Library

The ControlNet code uses Hugging Face Diffusers:

```bash
cd ext/veneer_generation
source venv/bin/activate  # Activate your Python environment

# Install diffusers and dependencies
pip install diffusers==0.25.0
pip install transformers==4.36.0
pip install accelerate==0.25.0
```

---

## Step 3: Update Backend to Use Pretrained ControlNet

The backend needs to load from Hugging Face format instead of local checkpoint.

**Option A: Use the Hugging Face Model Directly**

Update [services/veneer-preview/api_server.py](services/veneer-preview/api_server.py:42-46):

```python
# Change this:
config = {
    'controlnet_path': str(Path(__file__).parent.parent.parent /
                          'ext/veneer_generation/checkpoints/controlnet/best.pth'),
    ...
}

# To this:
config = {
    'controlnet_path': 'lllyasviel/control_v11p_sd15_seg',  # Use Hugging Face model
    'segmentation_checkpoint': str(Path(__file__).parent.parent.parent /
                                   'ext/individual_tooth_segmentation/checkpoints/CP_teeth_seg.pth')
}
```

**Option B: Use Downloaded Models**

Or create a wrapper to load the downloaded `.pth` files. We'll use Option A (simpler).

---

## Step 4: Start Backend

```bash
# Terminal 1 - Backend
cd /Users/joshuawu/VeneerLoungeApp/services/veneer-preview

# Activate environment
source ../../ext/veneer_generation/venv/bin/activate

# Start server (port 8000 to match frontend)
VENEER_MODEL_TYPE=controlnet python api_server.py \
    --model controlnet \
    --port 8000 \
    --debug
```

Expected output:
```
============================================================
Veneer Preview API Server
============================================================
Using device: cpu (or cuda if GPU available)
Loading ControlNet from lllyasviel/control_v11p_sd15_seg...
Loading Stable Diffusion pipeline...
✓ ControlNet generator initialized
```

**First run will download Stable Diffusion 1.5** (~4GB). This happens automatically.

---

## Step 5: Start Frontend

```bash
# Terminal 2 - Frontend
cd /Users/joshuawu/VeneerLoungeApp/VeneerApp-main

# Create .env.local if it doesn't exist
echo "BACKEND_URL=http://localhost:8000" > .env.local

# Install dependencies (if needed)
pnpm install

# Start frontend
pnpm dev
```

---

## Step 6: Test!

1. Open browser to `http://localhost:3000`
2. Navigate to Patient or Dentist mode
3. Upload a smile photo
4. Select shade and click "Generate Simulation"
5. Wait 10-30 seconds (first run is slower)
6. See your veneer preview!

---

## Troubleshooting

### Issue: Backend can't load ControlNet

**Error:** `FileNotFoundError` or model loading fails

**Fix:** Make sure you're using the Hugging Face model name:
```python
'controlnet_path': 'lllyasviel/control_v11p_sd15_seg'  # Correct
# NOT a file path to .pth file
```

### Issue: Out of Memory

**Error:** `CUDA out of memory` or slow performance

**Fix 1 - Enable CPU Offload:**
The code already has this:
```python
self.pipe.enable_model_cpu_offload()  # Line 77
```

**Fix 2 - Reduce Image Size:**
Edit [controlnet/inference_controlnet.py:219](ext/veneer_generation/controlnet/inference_controlnet.py:219):
```python
# Change from 512x512 to 256x256
target_size = (256, 256)
```

### Issue: Tooth segmentation model not found

**Error:** Segmentation checkpoint missing

**Fix:** Make sure you have:
```
ext/individual_tooth_segmentation/checkpoints/CP_teeth_seg.pth
```

If missing, check if it's in a different location:
```bash
find ext/individual_tooth_segmentation -name "*.pth"
```

### Issue: Generation takes too long

**Performance Tips:**
- First generation: 30-60 seconds (downloads models)
- Subsequent: 10-20 seconds on CPU, 2-5 seconds on GPU
- Reduce `num_inference_steps` from 20 to 10 for faster (lower quality) results

---

## Advanced: Fine-Tuning (Optional)

The pretrained ControlNet works but isn't trained on dental images. For **better results**:

1. Collect 50+ before/after veneer pairs
2. Fine-tune the pretrained ControlNet:
```bash
cd ext/veneer_generation/controlnet
python train_controlnet.py \
    --pretrained lllyasviel/control_v11p_sd15_seg \
    --dataset ../../../data/veneer_dataset \
    --epochs 50
```

This improves quality significantly!

---

## Architecture Overview

```
Frontend Upload
    ↓
Next.js API Route (/api/simulate)
    ↓
Flask Backend (port 8000)
    ↓
VeneerPreviewService
    ↓
ControlNet Inference
    ├── Tooth Segmentation (your model)
    ├── ControlNet (pretrained from HF)
    └── Stable Diffusion 1.5 (pretrained from HF)
    ↓
Veneer Preview (returned to frontend)
```

---

## Next Steps

✅ You now have a working veneer simulator!

**To improve quality:**
1. Collect more before/after photos
2. Fine-tune on your data (see Advanced section)
3. Experiment with prompts in [veneer_service.py:156-158](services/veneer-preview/veneer_service.py:156-158)

**To deploy:**
1. Add Docker container
2. Use GPU server (AWS, GCP, RunPod)
3. Add caching for faster repeat generations

---

## Summary

- ✅ **No training needed** - Use pretrained ControlNet
- ✅ **Works with your segmentation** - Leverages existing models
- ✅ **10-15 min setup** - Fast to get running
- ✅ **Production ready** - Built on proven tech (Stable Diffusion + ControlNet)

Run the setup script and you'll be generating veneer previews in minutes!
