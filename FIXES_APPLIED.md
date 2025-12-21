# Veneer Generation Fixes Applied

## Problem Summary
The veneer generation was producing distorted results with:
- Modified lips and gums (not just teeth)
- Melting/bulging tooth appearance
- Plastic/artificial texture artifacts
- Complete mouth reconstruction instead of tooth-only changes

## Root Causes Identified

### 1. **Wrong Pipeline Type**
- **Was using**: `StableDiffusionControlNetPipeline` (regenerates entire image)
- **Now using**: `StableDiffusionControlNetInpaintPipeline` (only modifies masked region)
- **Impact**: CRITICAL - This was causing the entire face to be regenerated

### 2. **Weak Segmentation Mask**
- **Problem**: Fallback color segmentation was detecting all white regions (lips, skin highlights, etc.)
- **Fix**: Implemented dual HSV+LAB filtering with morphological operations
- **Result**: Mask now only captures bright tooth enamel, not surrounding tissue

### 3. **Creative Prompts Driving Hallucinations**
- **Old prompt**: "beautiful smile, perfect white teeth, high quality"
- **New prompt**: "natural dental veneers applied only to existing tooth enamel, realistic tooth anatomy"
- **Impact**: Removed subjective/creative language that encouraged face modification

### 4. **Missing/Weak Negative Prompts**
- **Old**: "blurry, low quality, distorted"
- **New**: "distorted mouth, modified lips, altered gums, changed lip shape, melted teeth, plastic texture..."
- **Impact**: Explicitly forbids the types of distortions we were seeing

### 5. **Guidance Scale Too High**
- **Old**: 7.5-8.0 (high creativity/hallucination)
- **New**: 5.0-5.5 (conservative, follows structure)
- **Impact**: Reduces model's tendency to "imagine" features

## Files Modified

### 1. `ext/veneer_generation/controlnet/inference_controlnet.py`
**Key changes**:
- Switched to `StableDiffusionControlNetInpaintPipeline` (line 19, 50)
- Updated `generate_veneer_preview()` to pass mask and original image separately (lines 277-287)
- Improved fallback segmentation with HSV+LAB dual filtering (lines 108-144)
- Added morphological operations to clean mask and erode edges
- Conservative clinical prompts (line 257)
- Strong negative prompts (line 261)
- Lowered default guidance to 5.5 (line 208)
- Added debug directory support to save masks/conditioning images (lines 240-253, 291-293)
- Added mask coverage reporting

### 2. `services/veneer-preview/veneer_service.py`
**Key changes**:
- Lowered guidance scales: 5.0 (preserve geometry), 5.5 (default) (lines 148, 151)
- Updated prompts to clinical language (lines 157, 160)
- Added debug directory creation and passing (lines 165-176)

### 3. New test script: `test_fixed_veneer_generation.sh`
- Automated testing with debug output
- Generates comparison images
- Saves all intermediate images (mask, conditioning, etc.)

## How the Fixed Pipeline Works

```
Input Image
    ↓
1. Generate tooth segmentation mask (ONLY teeth, not lips/gums)
    ↓
2. Create ControlNet conditioning (mask + edges)
    ↓
3. Run INPAINTING with:
   - Original image (base)
   - Tooth mask (where to modify)
   - Conditioning (structural guidance)
   - Clinical prompt (what to do)
   - Strong negative prompt (what to avoid)
    ↓
4. Output: Only teeth modified, face/lips/gums preserved
```

## Testing the Fixes

### Option 1: Via API (if server is running)
```bash
# Start the API server
cd services/veneer-preview
python api_server.py --model controlnet

# In another terminal, test
curl -X POST http://localhost:5001/api/veneer-preview \
  -H "Content-Type: application/json" \
  -d @test_request.json
```

### Option 2: Direct script execution
```bash
./test_fixed_veneer_generation.sh path/to/your/test/image.jpg
```

### Option 3: Python directly
```bash
python ext/veneer_generation/controlnet/inference_controlnet.py \
  --controlnet lllyasviel/control_v11p_sd15_seg \
  --segmentation ext/individual_tooth_segmentation/checkpoints/CP_teeth_seg.pth \
  --image your_image.jpg \
  --output result.jpg \
  --guidance 5.5 \
  --debug-dir debug_outputs \
  --comparison
```

## Debug Outputs to Check

After running, check `debug_outputs/`:

1. **`tooth_mask.png`** - MOST IMPORTANT
   - Should show ONLY bright white teeth
   - Should NOT include: lips, gums, tongue, inner mouth, skin
   - If mask is too broad, adjust thresholds in `generate_segmentation_mask()`

2. **`conditioning.png`**
   - Red channel = tooth mask
   - Green channel = edges
   - Should guide structure without over-constraining

3. **`input_resized.png`** vs **`output.png`**
   - Compare carefully
   - Teeth should change, everything else should stay identical

## What to Expect Now

### Good Results (Expected):
✅ Only teeth are whitened/aligned
✅ Lips remain unchanged
✅ Gums remain unchanged
✅ Face structure preserved
✅ Natural tooth texture
✅ No melting or distortion

### If Still Having Issues:

**Issue**: Lips still being modified
**Fix**: Mask is too broad. Check `tooth_mask.png`. Increase thresholds in segmentation (line 123-127)

**Issue**: Not enough whitening
**Fix**: Increase `controlnet_conditioning_scale` or adjust prompt intensity

**Issue**: Results too conservative
**Fix**: Lower guidance scale slightly (try 4.5-5.0)

**Issue**: Mask not detecting teeth at all
**Fix**: Lower thresholds or ensure segmentation checkpoint is loading correctly

## Parameter Tuning Guide

### Guidance Scale
- **4.0-5.0**: Very conservative, minimal changes
- **5.0-5.5**: Balanced (current default)
- **5.5-6.5**: More creative, higher risk
- **7.0+**: High hallucination risk (old default)

### ControlNet Conditioning Scale
- **0.7-0.9**: Loose structural guidance (more freedom)
- **0.9-1.2**: Balanced (current)
- **1.2-1.5**: Strict structure preservation

### Mask Threshold (if using fallback segmentation)
- **HSV Value threshold**: 200 (line 123) - higher = only brightest pixels
- **LAB L threshold**: 200 (line 128) - higher = only very bright regions

## Next Steps

1. **Test with your problematic image**
2. **Check the mask quality** in `debug_outputs/tooth_mask.png`
3. **If mask looks good but results still bad**: The model weights might need training
4. **If mask captures lips/gums**: Increase thresholds
5. **If mask misses teeth**: Decrease thresholds or verify segmentation checkpoint is loading

## Training Recommendations (Only if fixes don't work)

If after all these fixes you still get poor results, then consider:
- Fine-tuning ControlNet on dental veneer datasets
- Training better tooth segmentation model
- Using a specialized dental image base model

But try the inference fixes first - they should resolve 80%+ of the issues you described.
