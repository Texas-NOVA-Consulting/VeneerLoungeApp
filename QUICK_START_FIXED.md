# Quick Start: Fixed Veneer Generation

## What Changed
✅ Switched to **inpainting** (only modifies teeth, not entire face)
✅ **Conservative prompts** (clinical, not creative)
✅ **Lower guidance** (5.0-5.5 instead of 7.5-8.0)
✅ **Strong negative prompts** (prevents lip/gum modification)
✅ **Better segmentation** (stricter mask, only teeth)
✅ **Debug outputs** (see exactly what's happening)

## Test It Now

### Quick Test (Recommended)
```bash
# Run with your test image
./test_fixed_veneer_generation.sh path/to/smile.jpg

# Check these files after:
# - debug_outputs/tooth_mask.png (should ONLY show teeth)
# - test_outputs/fixed_pipeline/result_default.jpg
```

### Via API Server
```bash
# Terminal 1: Start server
cd services/veneer-preview
python api_server.py --model controlnet --port 5001

# Terminal 2: Test (from project root)
# Make sure your frontend is sending requests to the API
```

### Check Your Results

**1. Look at the mask first**
```bash
open debug_outputs/tooth_mask.png
```
- Should ONLY show white teeth
- NO lips, gums, or other areas
- If mask is wrong, nothing else matters

**2. Compare before/after**
```bash
open test_outputs/fixed_pipeline/result_default.jpg
```
- Left = before, Right = after
- Check: Are lips/gums unchanged? ✅
- Check: Are teeth whitened/aligned? ✅
- Check: Natural texture (not plastic)? ✅

## If Results Still Bad

### Problem: Mask captures lips/gums
**Check**: `debug_outputs/tooth_mask.png` shows non-tooth regions
**Fix**: Edit [inference_controlnet.py:123-127](ext/veneer_generation/controlnet/inference_controlnet.py#L123-L127)
```python
# Increase these thresholds (more restrictive)
lower_white = np.array([0, 0, 210])  # Was 200, now 210
upper_white = np.array([180, 20, 255])  # Was 25, now 20
```

### Problem: Results too subtle
**Fix**: Edit [veneer_service.py:148-151](services/veneer-preview/veneer_service.py#L148-L151)
```python
guidance_scale = 6.0  # Was 5.0/5.5, try 6.0
```

### Problem: Still modifying lips
**Check**: Is mask correct? If yes, try:
```python
# In inference_controlnet.py, line 261, add more to negative prompt:
negative_prompt = "..., lip modification, lip enhancement, lip changes, ..."
```

## Parameter Quick Reference

| Setting | Conservative | Balanced | Creative |
|---------|-------------|----------|----------|
| Guidance | 4.5-5.0 | 5.0-5.5 | 6.0-7.0 |
| ControlNet Scale | 1.2-1.5 | 0.9-1.2 | 0.7-0.9 |
| Mask Threshold | 210+ | 200 | 190 |

## Files You Can Tune

1. **[inference_controlnet.py](ext/veneer_generation/controlnet/inference_controlnet.py)**
   - Line 123-127: Mask thresholds
   - Line 208: Default guidance scale
   - Line 257: Default prompt
   - Line 261: Default negative prompt

2. **[veneer_service.py](services/veneer-preview/veneer_service.py)**
   - Line 148, 151: Guidance scales
   - Line 157, 160: Prompts

## Understanding the Debug Outputs

```
debug_outputs/
├── input_resized.png       → Your image at 512x512
├── tooth_mask.png          → WHITE = will be modified
├── conditioning.png        → What ControlNet sees
└── output.png              → Final result
```

**The mask is EVERYTHING**. If `tooth_mask.png` looks wrong, fix that first.

## Common Scenarios

### Scenario 1: "Mask looks perfect, but still getting distortion"
→ Model weights might be undertrained. Try lowering guidance to 4.5 and increasing ControlNet scale to 1.3

### Scenario 2: "Mask captures way too much"
→ Your segmentation model isn't loading. Check console for "Warning: Using fallback"
→ If using fallback, increase thresholds

### Scenario 3: "No changes happening at all"
→ Mask might be empty. Check `tooth_mask.png` - if it's all black, lower thresholds

### Scenario 4: "Changes look plastic/artificial"
→ Lower guidance (try 4.5) and add to negative prompt: "plastic teeth, fake veneers, artificial appearance"

## Emergency Rollback

If you need to revert to old version:
```bash
mv ext/veneer_generation/controlnet/inference_controlnet_old.py \
   ext/veneer_generation/controlnet/inference_controlnet.py
```

## Need More Help?

1. Check [FIXES_APPLIED.md](FIXES_APPLIED.md) for detailed technical explanation
2. Look at your mask: `debug_outputs/tooth_mask.png`
3. Check console output for warnings/errors
4. Share the debug outputs for better diagnosis
