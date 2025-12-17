"""
ControlNet Inference Pipeline for Veneer Preview Generation.

This script provides end-to-end veneer preview generation using a trained
ControlNet model. It handles:
1. Loading the input smile image
2. Generating tooth segmentation mask
3. Creating edge maps
4. Running ControlNet to generate veneer preview
"""

import argparse
from pathlib import Path
import sys
import torch
import numpy as np
from PIL import Image
import cv2
from diffusers import ControlNetModel, StableDiffusionControlNetPipeline, UniPCMultistepScheduler


# Add tooth segmentation model path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / 'individual_tooth_segmentation'))
from src.network.model import TeethSegmentationNet


class VeneerControlNetGenerator:
    """
    Complete veneer preview generation pipeline using ControlNet.

    This class:
    1. Loads trained ControlNet model
    2. Uses tooth segmentation for conditioning
    3. Generates photorealistic veneer previews
    """

    def __init__(
        self,
        controlnet_path,
        base_model_path="runwayml/stable-diffusion-v1-5",
        segmentation_checkpoint=None,
        device='cuda'
    ):
        """
        Initialize the veneer generator.

        Args:
            controlnet_path: Path to trained ControlNet weights
            base_model_path: Path to base Stable Diffusion model
            segmentation_checkpoint: Path to tooth segmentation checkpoint
            device: Device to use ('cuda' or 'cpu')
        """
        self.device = torch.device(device if torch.cuda.is_available() else 'cpu')
        print(f"Using device: {self.device}")

        # Load ControlNet
        print(f"Loading ControlNet from {controlnet_path}...")
        controlnet = ControlNetModel.from_pretrained(controlnet_path, torch_dtype=torch.float16)

        # Load pipeline
        print(f"Loading Stable Diffusion pipeline...")
        self.pipe = StableDiffusionControlNetPipeline.from_pretrained(
            base_model_path,
            controlnet=controlnet,
            torch_dtype=torch.float16,
            safety_checker=None
        )

        # Use fast scheduler
        self.pipe.scheduler = UniPCMultistepScheduler.from_config(self.pipe.scheduler.config)

        # Move to device
        self.pipe = self.pipe.to(self.device)

        # Enable memory optimizations
        if self.device.type == 'cuda':
            self.pipe.enable_model_cpu_offload()
            # self.pipe.enable_xformers_memory_efficient_attention()  # Uncomment if xformers installed

        # Load segmentation model if provided
        self.seg_model = None
        if segmentation_checkpoint:
            print(f"Loading segmentation model from {segmentation_checkpoint}...")
            self.seg_model = TeethSegmentationNet()
            checkpoint = torch.load(segmentation_checkpoint, map_location=self.device)
            if 'model_state_dict' in checkpoint:
                self.seg_model.load_state_dict(checkpoint['model_state_dict'])
            else:
                self.seg_model.load_state_dict(checkpoint)
            self.seg_model.to(self.device)
            self.seg_model.eval()

        print("✓ Veneer generator initialized successfully!")

    def generate_segmentation_mask(self, image, target_size=(512, 512)):
        """
        Generate tooth segmentation mask.

        Args:
            image: PIL Image
            target_size: Target size for mask

        Returns:
            PIL Image of segmentation mask
        """
        if self.seg_model is None:
            raise ValueError("Segmentation model not loaded. Provide segmentation_checkpoint.")

        # Resize image
        image = image.resize(target_size, Image.LANCZOS)

        # Convert to tensor
        img_array = np.array(image)
        img_tensor = torch.from_numpy(img_array).permute(2, 0, 1).float()
        img_tensor = img_tensor.unsqueeze(0) / 255.0
        img_tensor = img_tensor.to(self.device)

        # Generate mask
        with torch.no_grad():
            output = self.seg_model(img_tensor)
            mask = torch.sigmoid(output) > 0.5
            mask = mask.squeeze().cpu().numpy().astype(np.uint8) * 255

        return Image.fromarray(mask, mode='L')

    def generate_edge_map(self, image, low_threshold=100, high_threshold=200):
        """
        Generate edge map using Canny detection.

        Args:
            image: PIL Image
            low_threshold: Canny low threshold
            high_threshold: Canny high threshold

        Returns:
            PIL Image of edge map
        """
        # Convert to numpy
        img_array = np.array(image)

        # Convert to grayscale
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)

        # Canny edge detection
        edges = cv2.Canny(gray, low_threshold, high_threshold)

        return Image.fromarray(edges, mode='L')

    def create_conditioning_image(self, image, mask=None, use_edges=True):
        """
        Create conditioning image from segmentation and edges.

        Args:
            image: PIL Image (input smile)
            mask: PIL Image (segmentation mask, optional)
            use_edges: Whether to include edge detection

        Returns:
            PIL Image for ControlNet conditioning
        """
        # Generate mask if not provided
        if mask is None and self.seg_model is not None:
            mask = self.generate_segmentation_mask(image)

        # Generate edges
        edges = None
        if use_edges:
            edges = self.generate_edge_map(image)

        # Combine into conditioning image
        if mask is not None and edges is not None:
            # R=mask, G=edges, B=zeros
            mask_array = np.array(mask)
            edges_array = np.array(edges)
            conditioning = np.stack([
                mask_array,
                edges_array,
                np.zeros_like(mask_array)
            ], axis=-1).astype(np.uint8)
        elif mask is not None:
            # Just mask in all channels
            mask_array = np.array(mask)
            conditioning = np.stack([mask_array] * 3, axis=-1).astype(np.uint8)
        else:
            raise ValueError("Must provide either mask or segmentation model")

        return Image.fromarray(conditioning)

    def generate_veneer_preview(
        self,
        image,
        prompt=None,
        negative_prompt=None,
        num_inference_steps=20,
        guidance_scale=7.5,
        controlnet_conditioning_scale=1.0,
        seed=None
    ):
        """
        Generate veneer preview for an input smile image.

        Args:
            image: PIL Image or path to image
            prompt: Text prompt (optional, uses default if None)
            negative_prompt: Negative prompt
            num_inference_steps: Number of denoising steps
            guidance_scale: Classifier-free guidance scale
            controlnet_conditioning_scale: How much to follow conditioning
            seed: Random seed for reproducibility

        Returns:
            PIL Image of veneer preview
        """
        # Load image if path
        if isinstance(image, (str, Path)):
            image = Image.open(image).convert('RGB')

        # Resize to 512x512 (standard SD resolution)
        target_size = (512, 512)
        image = image.resize(target_size, Image.LANCZOS)

        # Create conditioning image
        conditioning_image = self.create_conditioning_image(image, use_edges=True)

        # Default prompt
        if prompt is None:
            prompt = "professional dental veneers, perfect white teeth, beautiful smile, high quality, photorealistic, detailed"

        # Default negative prompt
        if negative_prompt is None:
            negative_prompt = "blurry, low quality, distorted, deformed teeth, unnatural, artifacts"

        # Set seed
        if seed is not None:
            generator = torch.Generator(device=self.device).manual_seed(seed)
        else:
            generator = None

        # Generate
        print(f"Generating veneer preview...")
        print(f"  Prompt: {prompt}")
        print(f"  Steps: {num_inference_steps}")
        print(f"  Guidance: {guidance_scale}")

        output = self.pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image=conditioning_image,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
            controlnet_conditioning_scale=controlnet_conditioning_scale,
            generator=generator
        )

        result_image = output.images[0]

        return result_image

    def generate_comparison(self, image, output_path=None, **kwargs):
        """
        Generate side-by-side comparison of before/after.

        Args:
            image: Input image
            output_path: Path to save comparison (optional)
            **kwargs: Arguments for generate_veneer_preview

        Returns:
            PIL Image of comparison
        """
        # Load image
        if isinstance(image, (str, Path)):
            image = Image.open(image).convert('RGB')

        # Resize to 512x512
        image = image.resize((512, 512), Image.LANCZOS)

        # Generate preview
        preview = self.generate_veneer_preview(image, **kwargs)

        # Create side-by-side comparison
        comparison = Image.new('RGB', (1024, 512))
        comparison.paste(image, (0, 0))
        comparison.paste(preview, (512, 0))

        # Save if requested
        if output_path:
            comparison.save(output_path, quality=95)
            print(f"✓ Comparison saved to {output_path}")

        return comparison


def main():
    """Main CLI interface."""
    parser = argparse.ArgumentParser(
        description='Generate veneer preview using ControlNet'
    )
    parser.add_argument(
        '--controlnet',
        type=str,
        required=True,
        help='Path to trained ControlNet model'
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
        help='Path to segmentation model checkpoint'
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
        help='Output path for veneer preview'
    )
    parser.add_argument(
        '--prompt',
        type=str,
        default=None,
        help='Custom text prompt'
    )
    parser.add_argument(
        '--negative-prompt',
        type=str,
        default=None,
        help='Negative prompt'
    )
    parser.add_argument(
        '--steps',
        type=int,
        default=20,
        help='Number of inference steps'
    )
    parser.add_argument(
        '--guidance',
        type=float,
        default=7.5,
        help='Guidance scale'
    )
    parser.add_argument(
        '--seed',
        type=int,
        default=None,
        help='Random seed'
    )
    parser.add_argument(
        '--comparison',
        action='store_true',
        help='Generate side-by-side comparison'
    )
    parser.add_argument(
        '--device',
        type=str,
        default='cuda',
        choices=['cuda', 'cpu'],
        help='Device to use'
    )

    args = parser.parse_args()

    # Create generator
    generator = VeneerControlNetGenerator(
        controlnet_path=args.controlnet,
        base_model_path=args.base_model,
        segmentation_checkpoint=args.segmentation,
        device=args.device
    )

    # Generate preview
    if args.comparison:
        result = generator.generate_comparison(
            image=args.image,
            output_path=args.output,
            prompt=args.prompt,
            negative_prompt=args.negative_prompt,
            num_inference_steps=args.steps,
            guidance_scale=args.guidance,
            seed=args.seed
        )
    else:
        image = Image.open(args.image).convert('RGB')
        result = generator.generate_veneer_preview(
            image=image,
            prompt=args.prompt,
            negative_prompt=args.negative_prompt,
            num_inference_steps=args.steps,
            guidance_scale=args.guidance,
            seed=args.seed
        )
        result.save(args.output, quality=95)
        print(f"✓ Veneer preview saved to {args.output}")


if __name__ == "__main__":
    main()
