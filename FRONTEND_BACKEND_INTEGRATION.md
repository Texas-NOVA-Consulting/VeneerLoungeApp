# Frontend ↔ Backend Integration Guide

This guide shows how your **VeneerApp-main frontend** connects to your **local backend pipeline** using **pretrained ControlNet** models.

---

## 🎯 Quick Answer: "If I Upload an Image, Will It Work?"

**Right Now: NO** ❌ - Backend isn't running yet

**After Following This Guide: YES** ✅ - Takes ~15 minutes

---

## 📋 What You Need

### Already Have ✅
- Frontend configured correctly ([route.ts](VeneerApp-main/app/api/simulate/route.ts))
- Backend API server ready ([api_server.py](services/veneer-preview/api_server.py))
- Tooth segmentation model ([CP_teeth_seg.pth](ext/individual_tooth_segmentation/checkpoints/CP_teeth_seg.pth))

### Need to Setup 🔧
- Pretrained ControlNet model (download from Hugging Face)
- Python dependencies (diffusers, transformers)
- Start both servers

---

## 🚀 Complete Setup (15 Minutes)

### Step 1: Install Python Dependencies (5 min)

```bash
cd ext/veneer_generation

# Create/activate virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install core dependencies
pip install torch torchvision
pip install diffusers==0.25.0
pip install transformers==4.36.0
pip install accelerate==0.25.0
pip install flask flask-cors pillow opencv-python
```

### Step 2: Download Pretrained Models (Optional - Auto-downloads on first run)

The ControlNet and Stable Diffusion models (~5GB total) will download automatically the first time you run the backend. To pre-download:

```bash
python -c "
from diffusers import ControlNetModel, StableDiffusionControlNetPipeline

# Download ControlNet (segmentation-based)
print('Downloading ControlNet...')
controlnet = ControlNetModel.from_pretrained('lllyasviel/control_v11p_sd15_seg')

# Download Stable Diffusion 1.5
print('Downloading Stable Diffusion...')
pipe = StableDiffusionControlNetPipeline.from_pretrained(
    'runwayml/stable-diffusion-v1-5',
    controlnet=controlnet
)

print('✓ All models downloaded!')
"
```

### Step 3: Start Both Servers (1 command!)

**Option A: Automatic Startup Script**

```bash
# From VeneerLoungeApp root directory
./start_veneer_app.sh
```

This starts:
- Backend API on port 8000
- Frontend on port 3000
- Auto-opens health check

**Option B: Manual Startup (Two Terminals)**

```bash
# Terminal 1 - Backend
cd services/veneer-preview
source ../../ext/veneer_generation/venv/bin/activate
python api_server.py --model controlnet --port 8000 --debug

# Terminal 2 - Frontend
cd VeneerApp-main
pnpm dev
```

### Step 4: Test!

```bash
# Test backend health
curl http://localhost:8000/health

# Should return:
# {"status":"healthy","model_type":"controlnet","device":"cpu"}
```

Then:
1. Open `http://localhost:3000`
2. Go to Patient or Dentist mode
3. Upload a smile image
4. Click "Generate Simulation"
5. Wait 10-30 seconds (first run downloads models)
6. See your veneer preview! ✨

---

## 🔍 How It Works

### Data Flow

```
┌─────────────────────────────────────────────┐
│  Browser (localhost:3000)                   │
│                                             │
│  1. User uploads smile image                │
│  2. Selects shade (natural_white, etc.)     │
│  3. Clicks "Generate"                       │
└──────────────────┬──────────────────────────┘
                   │
                   │ POST /api/simulate
                   │ { image: "data:image/jpeg;base64,...", shade: "natural_white" }
                   ↓
┌─────────────────────────────────────────────┐
│  Next.js API Route                          │
│  [VeneerApp-main/app/api/simulate/route.ts]│
│                                             │
│  const response = await fetch(              │
│    "http://localhost:8000/api/veneer-preview", │
│    { image, intensity: 0.8, ... }          │
│  );                                         │
└──────────────────┬──────────────────────────┘
                   │
                   │ POST http://localhost:8000/api/veneer-preview
                   │ { image: base64, intensity: 0.8, preserve_geometry: true }
                   ↓
┌─────────────────────────────────────────────┐
│  Flask Backend API Server                   │
│  [services/veneer-preview/api_server.py]    │
│                                             │
│  @app.route('/api/veneer-preview')         │
│  - Receives base64 image                    │
│  - Calls veneer_service                     │
└──────────────────┬──────────────────────────┘
                   │
                   │ service.generate_from_base64()
                   ↓
┌─────────────────────────────────────────────┐
│  Veneer Service                             │
│  [services/veneer-preview/veneer_service.py]│
│                                             │
│  1. Decode base64 → PIL Image              │
│  2. Call ControlNet generator               │
└──────────────────┬──────────────────────────┘
                   │
                   │ generator.generate_veneer_preview()
                   ↓
┌─────────────────────────────────────────────┐
│  ControlNet Generator                       │
│  [ext/veneer_generation/controlnet/         │
│   inference_controlnet.py]                  │
│                                             │
│  1. Generate tooth segmentation mask        │
│     └─ Uses: CP_teeth_seg.pth              │
│  2. Create conditioning image               │
│  3. Run ControlNet + Stable Diffusion       │
│     └─ Uses: Pretrained from Hugging Face  │
│  4. Return veneer preview                   │
└──────────────────┬──────────────────────────┘
                   │
                   │ Returns: PIL Image
                   ↓
┌─────────────────────────────────────────────┐
│  Encode as base64 and return                │
│  { output: ["data:image/jpeg;base64,..."],  │
│    success: true }                          │
└──────────────────┬──────────────────────────┘
                   │
                   │ Display in frontend
                   ↓
┌─────────────────────────────────────────────┐
│  User sees before/after comparison          │
│  Can download, generate PDF report, etc.    │
└─────────────────────────────────────────────┘
```

### Key Files

**Frontend:**
- [VeneerApp-main/app/api/simulate/route.ts:13](VeneerApp-main/app/api/simulate/route.ts#L13) - Calls backend
- [VeneerApp-main/app/patient/simulation/page.tsx:29](VeneerApp-main/app/patient/simulation/page.tsx#L29) - Patient UI
- [VeneerApp-main/app/dentist/simulation/page.tsx:29](VeneerApp-main/app/dentist/simulation/page.tsx#L29) - Dentist UI

**Backend:**
- [services/veneer-preview/api_server.py:81](services/veneer-preview/api_server.py#L81) - API endpoint
- [services/veneer-preview/veneer_service.py:191](services/veneer-preview/veneer_service.py#L191) - Service layer
- [ext/veneer_generation/controlnet/inference_controlnet.py:189](ext/veneer_generation/controlnet/inference_controlnet.py#L189) - ControlNet inference

---

## ⚙️ Configuration

### Environment Variables

Create [VeneerApp-main/.env.local](VeneerApp-main/.env.local):
```bash
# Backend URL (default: http://localhost:8000)
BACKEND_URL=http://localhost:8000
```

### Backend Options

```bash
# Use pretrained ControlNet (default)
python api_server.py --model controlnet --port 8000

# Or use Pix2pix (requires trained model)
python api_server.py --model pix2pix --port 8000

# Custom ControlNet path
CONTROLNET_PATH=/path/to/your/trained/model \
  python api_server.py --model controlnet --port 8000
```

---

## 🐛 Troubleshooting

### Backend won't start

**Error:** `ModuleNotFoundError: No module named 'diffusers'`

**Fix:**
```bash
source ext/veneer_generation/venv/bin/activate
pip install diffusers transformers accelerate
```

### Frontend can't reach backend

**Error:** `Failed to fetch` or `Connection refused`

**Fix:**
```bash
# Check backend is running
curl http://localhost:8000/health

# Check .env.local has correct URL
cat VeneerApp-main/.env.local
# Should show: BACKEND_URL=http://localhost:8000
```

### Image upload fails

**Error:** `Image is required` or upload doesn't work

**Fix:** Frontend sends image as base64. Check browser console:
```javascript
// Should see POST to /api/simulate with:
{
  image: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  shade: "natural_white",
  numOutputs: 1
}
```

### ControlNet generation is slow

**Expected Times:**
- First run: 30-60 seconds (downloads models)
- Subsequent: 10-20 seconds (CPU), 2-5 seconds (GPU)

**Speed up:**
- Reduce steps: Edit [veneer_service.py:166](services/veneer-preview/veneer_service.py#L166) to use 10 steps instead of 20
- Use GPU: If you have NVIDIA GPU with CUDA installed
- Reduce resolution: Change 512→256 in [inference_controlnet.py:219](ext/veneer_generation/controlnet/inference_controlnet.py#L219)

### Out of memory

**Error:** `RuntimeError: CUDA out of memory` or system freezes

**Fix:**
```python
# Already enabled in code:
self.pipe.enable_model_cpu_offload()  # Line 77

# If still issues, reduce batch size or image resolution
```

---

## 📊 Performance Expectations

### With Pretrained ControlNet (Out of Box)

| Metric | Value |
|--------|-------|
| First Generation | 30-60 sec (downloads models) |
| Subsequent (CPU) | 10-20 sec |
| Subsequent (GPU) | 2-5 sec |
| Quality | Good (general dental improvements) |
| Memory Usage | ~4-6 GB RAM |

### With Fine-Tuned ControlNet (After Training)

| Metric | Value |
|--------|-------|
| Generation Time | Same as above |
| Quality | Excellent (specific to veneer style) |
| Training Time | 2-6 hours (with 50+ images) |

---

## 🎯 Next Steps

### Immediate (Get It Running)
1. ✅ Run setup script: `./start_veneer_app.sh`
2. ✅ Test with an image
3. ✅ Verify results

### Short Term (Improve Quality)
1. Collect 50+ before/after veneer images
2. Fine-tune ControlNet on your data
3. Experiment with prompts

### Long Term (Production)
1. Deploy on cloud GPU (AWS, GCP, RunPod)
2. Add caching for faster repeats
3. Implement user accounts & storage
4. Add payment integration

---

## 📚 Additional Resources

- [QUICK_START_WITH_PRETRAINED.md](QUICK_START_WITH_PRETRAINED.md) - Detailed setup guide
- [ext/veneer_generation/README.md](ext/veneer_generation/README.md) - Model training docs
- [Hugging Face ControlNet](https://huggingface.co/lllyasviel/ControlNet) - Model repository

---

## ✅ Summary

**To answer your question: "If I upload an image right now, will it work?"**

**After running:**
```bash
./start_veneer_app.sh
```

**YES!** ✅ Your complete stack will be running:
- Frontend at `http://localhost:3000`
- Backend at `http://localhost:8000`
- Using pretrained ControlNet (no training required)
- Generating veneer previews in ~10-20 seconds

**Total setup time: ~15 minutes** (mostly waiting for model downloads)

Ready to start? Run:
```bash
./start_veneer_app.sh
```
