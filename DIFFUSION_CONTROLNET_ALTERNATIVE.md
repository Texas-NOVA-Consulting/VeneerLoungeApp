# ControlNet + Diffusion Alternative for Veneer Preview

## Overview

This approach uses Stable Diffusion with ControlNet conditioning instead of pix2pix. Better for cases where teeth need significant transformation.

## Setup

### Installation

```bash
cd /Users/joshuawu/VeneerLoungeApp/ext/veneer_generation
pip install diffusers transformers controlnet-aux torch accelerate
```

### Basic Implementation

```python
"""
Veneer generation using Stable Diffusion + ControlNet.
Why: Better handling of spatial transformations and teeth repositioning.
"""

import torch
from diffusers import (
    StableDiffusionControlNetPipeline,
    ControlNetModel,
    UniPCMultistepScheduler
)
from PIL import Image
import numpy as np

class ControlNetVeneerGenerator:
    """
    Veneer generator using ControlNet for precise control.

    Why ControlNet:
    - Better at spatial transformations
    - Can handle teeth movement
    - Higher quality outputs
    - Uses segmentation maps naturally
    """

    def __init__(self, device='cuda'):
        self.device = device

        # Load ControlNet model (trained on segmentation maps)
        self.controlnet = ControlNetModel.from_pretrained(
            "lllyasviel/control_v11p_sd15_seg",
            torch_dtype=torch.float16
        )

        # Load Stable Diffusion pipeline with ControlNet
        self.pipe = StableDiffusionControlNetPipeline.from_pretrained(
            "runwayml/stable-diffusion-v1-5",
            controlnet=self.controlnet,
            torch_dtype=torch.float16,
            safety_checker=None
        )

        # Optimize for speed
        self.pipe.scheduler = UniPCMultistepScheduler.from_config(
            self.pipe.scheduler.config
        )
        self.pipe.enable_model_cpu_offload()
        self.pipe.to(device)

    def generate_veneer_preview(
        self,
        image,
        segmentation_mask,
        prompt="perfect white dental veneers, natural smile, professional dental work",
        negative_prompt="yellow teeth, crooked teeth, missing teeth, unnatural",
        num_inference_steps=20,
        controlnet_conditioning_scale=1.0
    ):
        """
        Generates veneer preview using ControlNet.

        Args:
            image: Input smile image (PIL Image)
            segmentation_mask: Tooth segmentation mask (PIL Image)
            prompt: Text prompt describing desired veneers
            negative_prompt: What to avoid
            num_inference_steps: Quality vs speed tradeoff (20 is fast)
            controlnet_conditioning_scale: How much to follow the mask (0-2)

        Returns:
            PIL Image with veneers applied
        """
        # Resize inputs to 512x512 (Stable Diffusion standard)
        image = image.resize((512, 512), Image.LANCZOS)
        mask = segmentation_mask.resize((512, 512), Image.LANCZOS)

        # Generate with ControlNet guidance
        output = self.pipe(
            prompt=prompt,
            image=image,
            control_image=mask,
            negative_prompt=negative_prompt,
            num_inference_steps=num_inference_steps,
            controlnet_conditioning_scale=controlnet_conditioning_scale,
        )

        return output.images[0]


# Usage example
if __name__ == "__main__":
    from your_segmentation_model import generate_tooth_mask

    # Initialize generator
    generator = ControlNetVeneerGenerator(device='cuda')

    # Load input image
    input_image = Image.open("smile.jpg")

    # Generate tooth segmentation mask (using your existing model)
    tooth_mask = generate_tooth_mask(input_image)

    # Generate veneer preview
    preview = generator.generate_veneer_preview(
        image=input_image,
        segmentation_mask=tooth_mask,
        prompt="perfect white porcelain veneers, natural smile",
        num_inference_steps=20
    )

    preview.save("veneer_preview.jpg")
```

## Fine-tuning ControlNet for Veneer Generation

For best results, fine-tune on your dental dataset:

```python
"""
Fine-tuning ControlNet on veneer dataset.
Why: Adapts the model to dental-specific transformations.
"""

from diffusers import StableDiffusionControlNetPipeline, ControlNetModel
from diffusers.optimization import get_scheduler
from torch.utils.data import Dataset, DataLoader
import torch
from PIL import Image
from pathlib import Path

class VeneerDataset(Dataset):
    """Dataset for veneer before/after pairs with segmentation masks."""

    def __init__(self, data_dir):
        self.before_dir = Path(data_dir) / "train" / "A"  # Before images
        self.after_dir = Path(data_dir) / "train" / "B"   # After images
        self.mask_dir = Path(data_dir) / "train" / "C"    # Segmentation masks

        self.image_paths = sorted(list(self.before_dir.glob("*.jpg")))

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img_name = self.image_paths[idx].name

        before = Image.open(self.before_dir / img_name).convert('RGB')
        after = Image.open(self.after_dir / img_name).convert('RGB')
        mask = Image.open(self.mask_dir / img_name).convert('L')

        # Resize to 512x512
        before = before.resize((512, 512))
        after = after.resize((512, 512))
        mask = mask.resize((512, 512))

        return {
            'before': before,
            'after': after,
            'mask': mask,
            'prompt': "perfect white dental veneers, natural smile"
        }

def train_controlnet(
    data_dir,
    output_dir="checkpoints/controlnet_veneer",
    num_epochs=100,
    batch_size=4,
    learning_rate=1e-5
):
    """
    Fine-tunes ControlNet on veneer dataset.

    Why fine-tune:
    - Learns dental-specific transformations
    - Better understands veneer aesthetics
    - Improves quality on your specific use case
    """
    # Load pretrained ControlNet
    controlnet = ControlNetModel.from_pretrained(
        "lllyasviel/control_v11p_sd15_seg",
        torch_dtype=torch.float16
    )

    # Load pipeline
    pipe = StableDiffusionControlNetPipeline.from_pretrained(
        "runwayml/stable-diffusion-v1-5",
        controlnet=controlnet,
        torch_dtype=torch.float16
    )

    # Prepare dataset
    dataset = VeneerDataset(data_dir)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    # Optimizer
    optimizer = torch.optim.AdamW(
        controlnet.parameters(),
        lr=learning_rate
    )

    # Training loop
    for epoch in range(num_epochs):
        for batch_idx, batch in enumerate(dataloader):
            # Training code here
            # (Full implementation would follow diffusers training examples)
            pass

    # Save fine-tuned model
    controlnet.save_pretrained(output_dir)
```

## Comparison: Pix2pix vs ControlNet

| Feature | Pix2pix | ControlNet + Diffusion |
|---------|---------|----------------------|
| **Training Time** | 2-3 days | 3-5 days |
| **Inference Speed** | 0.5-1 sec | 2-5 sec |
| **Quality** | Good for texture changes | Better for complex transformations |
| **Spatial Transformations** | Limited | Excellent |
| **Ease of Use** | Simpler | More complex |
| **Memory Usage** | ~4GB VRAM | ~8GB VRAM |
| **Fine-tuning Data** | 100-500 pairs | 500-1000 pairs |

## Recommendation

### Use Pix2pix if:
- ✅ Your veneers mostly change color/texture
- ✅ Teeth positions don't change significantly
- ✅ You need fast inference (<1 second)
- ✅ You have limited training data (100-500 pairs)
- ✅ You want simpler implementation

### Use ControlNet if:
- ✅ Veneers involve teeth repositioning
- ✅ You need very high quality outputs
- ✅ You can tolerate slower inference (2-5 seconds)
- ✅ You have larger dataset (500+ pairs)
- ✅ You want more control over generation

## Hybrid Approach

You could also combine both:

```python
class HybridVeneerGenerator:
    """
    Uses pix2pix for simple cases, ControlNet for complex ones.

    Why hybrid:
    - Fast for most cases (pix2pix)
    - Falls back to ControlNet for complex transformations
    - Best of both worlds
    """

    def __init__(self):
        self.pix2pix = Pix2PixVeneerGenerator()
        self.controlnet = ControlNetVeneerGenerator()

    def generate(self, image, mask, complexity='auto'):
        """
        Selects appropriate model based on complexity.

        complexity: 'simple', 'complex', or 'auto' (detect automatically)
        """
        if complexity == 'auto':
            # Analyze image to determine complexity
            complexity = self._detect_complexity(image, mask)

        if complexity == 'simple':
            return self.pix2pix.generate(image, mask)
        else:
            return self.controlnet.generate(image, mask)

    def _detect_complexity(self, image, mask):
        # Heuristics to determine if transformation is complex
        # E.g., check for teeth misalignment, large gaps, etc.
        return 'simple'  # or 'complex'
```

## Next Steps

1. **Start with pix2pix** (as planned) - simpler and faster
2. **Evaluate results** - if quality is insufficient for cases with tooth movement
3. **Consider ControlNet** for those specific cases
4. **Optionally implement hybrid** approach for best results
