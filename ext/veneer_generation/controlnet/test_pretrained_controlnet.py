"""
Test script for pretrained ControlNet weights.

This script loads pretrained ControlNet models from lllyasviel/ControlNet
and tests them on dental images without any additional training.
"""

import argparse
import sys
from pathlib import Path
import torch
import numpy as np
from PIL import Image
import cv2

# Add tooth segmentation path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / 'individual_tooth_segmentation'))

from diffusers import (
    ControlNetModel,
    StableDiffusionControlNetInpaintPipeline,
    UniPCMultistepScheduler
)

try:
    from src.network.model import ResNeSt50_TC as TeethSegmentationNet
    SEGMENTATION_AVAILABLE = True
except ImportError:
    print("Warning: Tooth segmentation model not available")
    SEGMENTATION_AVAILABLE = False


class PretrainedControlNetTester:
    """Test pretrained ControlNet on dental images."""

    def __init__(
        self,
        controlnet_type='segmentation',
        base_model='runwayml/stable-diffusion-v1-5',
        segmentation_checkpoint=None,
        device='auto'
    ):
        """
        Initialize tester.

        Args:
            controlnet_type: 'segmentation' or 'canny'
            base_model: Base Stable Diffusion model
            segmentation_checkpoint: Path to tooth segmentation model
            device: Device to use
        """
        # Auto-detect device
        if device == 'auto':
            if torch.cuda.is_available():
                self.device = 'cuda'
            elif torch.backends.mps.is_available():
                self.device = 'mps'
            else:
                self.device = 'cpu'
        else:
            self.device = device

        print(f"Using device: {self.device}")

        # Map controlnet type to model path
        controlnet_paths = {
            'segmentation': 'lllyasviel/control_v11p_sd15_seg',
            'canny': 'lllyasviel/control_v11p_sd15_canny'
        }

        if controlnet_type not in controlnet_paths:
            raise ValueError(f"Unknown controlnet_type: {controlnet_type}")

        controlnet_path = controlnet_paths[controlnet_type]
        self.controlnet_type = controlnet_type

        print(f"\nLoading ControlNet: {controlnet_path}")

        # Load ControlNet
        controlnet = ControlNetModel.from_pretrained(
            controlnet_path,
            torch_dtype=torch.float16 if self.device != 'cpu' else torch.float32
        )

        # Load pipeline
        print(f"Loading Stable Diffusion pipeline: {base_model}")
        dtype = torch.float16 if self.device != 'cpu' else torch.float32

        self.pipe = StableDiffusionControlNetInpaintPipeline.from_pretrained(
            base_model,
            controlnet=controlnet,
            torch_dtype=dtype,
            safety_checker=None
        )

        # Use fast scheduler
        self.pipe.scheduler = UniPCMultistepScheduler.from_config(
            self.pipe.scheduler.config
        )

        # Move to device
        self.pipe = self.pipe.to(self.device)

        # Enable memory optimizations
        if self.device == 'cuda':
            try:
                self.pipe.enable_model_cpu_offload()
            except:
                print("Warning: Could not enable CPU offload")

        # Load segmentation model if provided
        self.seg_model = None
        if segmentation_checkpoint and SEGMENTATION_AVAILABLE:
            print(f"\nLoading tooth segmentation from {segmentation_checkpoint}")
            self.seg_model = TeethSegmentationNet(in_ch=3, out_ch=1)
            checkpoint = torch.load(segmentation_checkpoint, map_location=self.device)

            # Extract state dict
            if 'model_state_dict' in checkpoint:
                state_dict = checkpoint['model_state_dict']
            elif 'net_state_dict' in checkpoint:
                state_dict = checkpoint['net_state_dict']
            else:
                state_dict = checkpoint

            # Remove 'module.' prefix if present
            if any(k.startswith('module.') for k in state_dict.keys()):
                state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}

            self.seg_model.load_state_dict(state_dict)
            self.seg_model.to(self.device)
            self.seg_model.eval()
            print("✓ Segmentation model loaded")

        print("\n✓ Pretrained ControlNet ready for testing!")

    def create_canny_conditioning(self, image, low=100, high=200):
        """Create Canny edge map."""
        image = image.resize((512, 512), Image.LANCZOS)
        image_np = np.array(image)
        gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, low, high)
        edges = cv2.cvtColor(edges, cv2.COLOR_GRAY2RGB)
        return Image.fromarray(edges)

    def create_segmentation_conditioning(self, image):
        """Create segmentation map (using model or simple threshold)."""
        image = image.resize((512, 512), Image.LANCZOS)

        if self.seg_model is not None:
            # Use tooth segmentation model
            img_array = np.array(image)
            img_tensor = torch.from_numpy(img_array).permute(2, 0, 1).float()
            img_tensor = img_tensor.unsqueeze(0) / 255.0
            img_tensor = img_tensor.to(self.device)

            with torch.no_grad():
                output = self.seg_model(img_tensor)
                mask = torch.sigmoid(output) > 0.5
                mask = mask.squeeze().cpu().numpy().astype(np.uint8) * 255

            # Convert to RGB segmentation map
            seg_map = np.zeros((512, 512, 3), dtype=np.uint8)
            seg_map[:, :, 0] = mask  # Red channel for teeth
            return Image.fromarray(seg_map)
        else:
            # Fallback: simple color-based segmentation
            print("Warning: Using fallback color-based segmentation")
            img_array = np.array(image)
            hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)

            # Rough mask for bright regions (teeth are usually bright)
            lower = np.array([0, 0, 150])
            upper = np.array([180, 50, 255])
            mask = cv2.inRange(hsv, lower, upper)

            # Create segmentation map
            seg_map = np.zeros((512, 512, 3), dtype=np.uint8)
            seg_map[:, :, 0] = mask
            return Image.fromarray(seg_map)

    def generate(
        self,
        image_path,
        prompt=None,
        negative_prompt=None,
        num_inference_steps=20,
        guidance_scale=7.5,
        controlnet_scale=1.0,
        seed=None
    ):
        """
        Generate veneer preview.

        Args:
            image_path: Path to input image
            prompt: Text prompt
            negative_prompt: Negative prompt
            num_inference_steps: Number of steps
            guidance_scale: Guidance scale
            controlnet_scale: ControlNet conditioning scale
            seed: Random seed

        Returns:
            tuple: (output_image, conditioning_image)
        """
        # Load image
        image = Image.open(image_path).convert('RGB')

        # Create conditioning image based on type
        if self.controlnet_type == 'canny':
            conditioning = self.create_canny_conditioning(image)
        else:  # segmentation
            conditioning = self.create_segmentation_conditioning(image)

        # Default prompts
        if prompt is None:
            prompt = (
                "professional dental veneers, perfect white teeth, beautiful smile, "
                "natural looking, high quality, photorealistic, dental photography"
            )

        if negative_prompt is None:
            negative_prompt = (
                "blurry, low quality, distorted, deformed teeth, unnatural, "
                "artifacts, bad anatomy, ugly"
            )

        # Set seed
        generator = None
        if seed is not None:
            generator = torch.Generator(device=self.device).manual_seed(seed)

        print(f"\nGenerating veneer preview...")
        print(f"  Prompt: {prompt}")
        print(f"  Steps: {num_inference_steps}")
        print(f"  Guidance: {guidance_scale}")
        print(f"  ControlNet scale: {controlnet_scale}")

        # Generate
        output = self.pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image=conditioning,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
            controlnet_conditioning_scale=controlnet_scale,
            generator=generator
        )

        result = output.images[0]

        return result, conditioning

    def generate_comparison(
        self,
        image_path,
        output_path,
        **kwargs
    ):
        """Generate side-by-side comparison."""
        # Load original
        original = Image.open(image_path).convert('RGB')
        original = original.resize((512, 512), Image.LANCZOS)

        # Generate
        result, conditioning = self.generate(image_path, **kwargs)

        # Create comparison (original | conditioning | result)
        comparison = Image.new('RGB', (1536, 512))
        comparison.paste(original, (0, 0))
        comparison.paste(conditioning, (512, 0))
        comparison.paste(result, (1024, 0))

        # Save
        comparison.save(output_path, quality=95)
        print(f"\n✓ Comparison saved to {output_path}")

        return comparison


def main():
    parser = argparse.ArgumentParser(
        description='Test pretrained ControlNet on dental images'
    )
    parser.add_argument(
        '--image',
        type=str,
        required=True,
        help='Input smile image'
    )
    parser.add_argument(
        '--output',
        type=str,
        required=True,
        help='Output path'
    )
    parser.add_argument(
        '--controlnet-type',
        type=str,
        default='segmentation',
        choices=['segmentation', 'canny'],
        help='Type of ControlNet to use'
    )
    parser.add_argument(
        '--base-model',
        type=str,
        default='runwayml/stable-diffusion-v1-5',
        help='Base Stable Diffusion model'
    )
    parser.add_argument(
        '--segmentation',
        type=str,
        default='../../individual_tooth_segmentation/checkpoints/CP_teeth_seg.pth',
        help='Tooth segmentation checkpoint'
    )
    parser.add_argument(
        '--prompt',
        type=str,
        help='Custom prompt'
    )
    parser.add_argument(
        '--steps',
        type=int,
        default=20,
        help='Inference steps'
    )
    parser.add_argument(
        '--guidance',
        type=float,
        default=7.5,
        help='Guidance scale'
    )
    parser.add_argument(
        '--controlnet-scale',
        type=float,
        default=1.0,
        help='ControlNet conditioning scale'
    )
    parser.add_argument(
        '--seed',
        type=int,
        help='Random seed'
    )
    parser.add_argument(
        '--device',
        type=str,
        default='auto',
        choices=['auto', 'cuda', 'mps', 'cpu'],
        help='Device to use'
    )

    args = parser.parse_args()

    # Check if segmentation checkpoint exists
    seg_checkpoint = None
    if Path(args.segmentation).exists():
        seg_checkpoint = args.segmentation
    else:
        print(f"Warning: Segmentation checkpoint not found at {args.segmentation}")
        print("Will use fallback segmentation method")

    # Create tester
    tester = PretrainedControlNetTester(
        controlnet_type=args.controlnet_type,
        base_model=args.base_model,
        segmentation_checkpoint=seg_checkpoint,
        device=args.device
    )

    # Generate comparison
    tester.generate_comparison(
        image_path=args.image,
        output_path=args.output,
        prompt=args.prompt,
        num_inference_steps=args.steps,
        guidance_scale=args.guidance,
        controlnet_scale=args.controlnet_scale,
        seed=args.seed
    )

    print("\n" + "="*60)
    print("✓ Test complete!")
    print("="*60)


if __name__ == '__main__':
    main()
