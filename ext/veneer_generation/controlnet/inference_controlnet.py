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
from diffusers import ControlNetModel, StableDiffusionControlNetInpaintPipeline, UniPCMultistepScheduler

sys.path.insert(0, str(Path(__file__).parent.parent.parent / 'individual_tooth_segmentation'))
from src.network.model import ResNeSt50_TC as TeethSegmentationNet


class VeneerControlNetGenerator:

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
        dtype = torch.float16 if self.device.type == 'cuda' else torch.float32
        print(f"Loading ControlNet from {controlnet_path}...")
        controlnet = ControlNetModel.from_pretrained(controlnet_path, torch_dtype=dtype)

        print(f"Loading Stable Diffusion Inpainting pipeline...")
        self.pipe = StableDiffusionControlNetInpaintPipeline.from_pretrained(
            base_model_path,
            controlnet=controlnet,
            torch_dtype=dtype,
            safety_checker=None
        )

        self.pipe.scheduler = UniPCMultistepScheduler.from_config(self.pipe.scheduler.config)
        self.pipe = self.pipe.to(self.device)

        if self.device.type == 'cuda':
            self.pipe.enable_model_cpu_offload()

        # Load segmentation model if provided
        self.seg_model = None
        if segmentation_checkpoint and segmentation_checkpoint != 'None':
            try:
                print(f"Loading segmentation model from {segmentation_checkpoint}...")
                self.seg_model = TeethSegmentationNet(in_ch=3, out_ch=1)
                checkpoint = torch.load(segmentation_checkpoint, map_location=self.device)

                if 'model_state_dict' in checkpoint:
                    state_dict = checkpoint['model_state_dict']
                elif 'net_state_dict' in checkpoint:
                    state_dict = checkpoint['net_state_dict']
                else:
                    state_dict = checkpoint

                if any(k.startswith('module.') for k in state_dict.keys()):
                    state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}

                self.seg_model.load_state_dict(state_dict)
                self.seg_model.to(self.device)
                self.seg_model.eval()
                print("✓ Tooth segmentation model loaded")
            except Exception as e:
                print(f"Warning: Could not load segmentation model: {e}")
                print("Will use fallback color-based segmentation")
                self.seg_model = None
        else:
            print("Tooth segmentation model not provided - using fallback method")

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
            print("Warning: Using fallback color-based segmentation")
            image_resized = image.resize(target_size, Image.LANCZOS)
            img_array = np.array(image_resized)

            # Convert to HSV and LAB for better tooth detection
            hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
            lab = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)

            # Very restrictive white detection (only bright teeth, not skin/lips)
            # Teeth are typically: high value, low saturation, high L channel
            lower_white = np.array([0, 0, 200])  # Raised from 180 - only very bright regions
            upper_white = np.array([180, 25, 255])  # Reduced saturation from 30
            mask_hsv = cv2.inRange(hsv, lower_white, upper_white)

            # Additional LAB filter to catch tooth enamel specifically
            lower_lab = np.array([200, 120, 120])  # High L (brightness), neutral a,b
            upper_lab = np.array([255, 140, 140])
            mask_lab = cv2.inRange(lab, lower_lab, upper_lab)

            # Combine masks (AND operation for strictness)
            mask = cv2.bitwise_and(mask_hsv, mask_lab)

            # Morphological operations to clean up noise and small regions
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
            mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)  # Remove noise
            mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)  # Fill gaps

            # Erode slightly to avoid lip edges
            kernel_erode = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
            mask = cv2.erode(mask, kernel_erode, iterations=1)

            print(f"Fallback mask coverage: {np.sum(mask > 0) / mask.size * 100:.1f}% of image")

            return Image.fromarray(mask, mode='L')

        # Use trained segmentation model
        image = image.resize(target_size, Image.LANCZOS)
        img_array = np.array(image)
        img_tensor = torch.from_numpy(img_array).permute(2, 0, 1).float()
        img_tensor = img_tensor.unsqueeze(0) / 255.0
        img_tensor = img_tensor.to(self.device)

        with torch.no_grad():
            output = self.seg_model(img_tensor)
            mask = torch.sigmoid(output) > 0.5
            mask = mask.squeeze().cpu().numpy().astype(np.uint8) * 255

        print(f"Model mask coverage: {np.sum(mask > 0) / mask.size * 100:.1f}% of image")
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
        if mask is None:
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
        guidance_scale=5.5,
        controlnet_conditioning_scale=1.0,
        seed=None,
        debug_dir=None
    ):
        """
        Generate veneer preview for an input smile image.

        Args:
            image: PIL Image or path to image
            prompt: Text prompt (optional, uses default if None)
            negative_prompt: Negative prompt
            num_inference_steps: Number of denoising steps
            guidance_scale: Classifier-free guidance scale (lowered to 5.5 to reduce hallucinations)
            controlnet_conditioning_scale: How much to follow conditioning
            seed: Random seed for reproducibility
            debug_dir: Directory to save debug images (optional)

        Returns:
            PIL Image of veneer preview
        """
        # Load image if path
        if isinstance(image, (str, Path)):
            image = Image.open(image).convert('RGB')

        # Resize to 512x512 (standard SD resolution)
        target_size = (512, 512)
        image = image.resize(target_size, Image.LANCZOS)

        # Generate tooth segmentation mask
        tooth_mask = self.generate_segmentation_mask(image, target_size)

        # Save debug images if requested
        if debug_dir:
            debug_path = Path(debug_dir)
            debug_path.mkdir(parents=True, exist_ok=True)
            tooth_mask.save(debug_path / 'tooth_mask.png')
            image.save(debug_path / 'input_resized.png')
            print(f"Debug: Saved mask to {debug_path / 'tooth_mask.png'}")

        # Create conditioning image for ControlNet
        conditioning_image = self.create_conditioning_image(image, mask=tooth_mask, use_edges=True)

        if debug_dir:
            conditioning_image.save(Path(debug_dir) / 'conditioning.png')
            print(f"Debug: Saved conditioning image to {Path(debug_dir) / 'conditioning.png'}")

        # Conservative clinical prompt (avoid creative language)
        if prompt is None:
            prompt = "natural dental veneers applied only to existing tooth enamel, realistic tooth anatomy, proper dental occlusion, natural enamel texture, photorealistic dentistry"

        # Strong negative prompt to prevent distortion
        if negative_prompt is None:
            negative_prompt = "distorted mouth, modified lips, altered gums, changed lip shape, extra teeth, melted teeth, deformed anatomy, plastic texture, artificial look, cartoon, surreal, exaggerated features, face modification, skin changes"

        # Set seed
        if seed is not None:
            generator = torch.Generator(device=self.device).manual_seed(seed)
        else:
            generator = None

        # Generate
        print(f"Generating veneer preview...")
        print(f"  Prompt: {prompt}")
        print(f"  Negative: {negative_prompt[:80]}...")
        print(f"  Steps: {num_inference_steps}")
        print(f"  Guidance: {guidance_scale}")

        # Use inpainting pipeline with mask
        output = self.pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image=image,  # Original image for inpainting
            mask_image=tooth_mask,  # Mask of teeth region
            control_image=conditioning_image,  # ControlNet conditioning
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
            controlnet_conditioning_scale=controlnet_conditioning_scale,
            generator=generator
        )

        result_image = output.images[0]

        if debug_dir:
            result_image.save(Path(debug_dir) / 'output.png')
            print(f"Debug: Saved output to {Path(debug_dir) / 'output.png'}")

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
        default=5.5,
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
    parser.add_argument(
        '--debug-dir',
        type=str,
        default=None,
        help='Directory to save debug outputs (mask, conditioning, etc.)'
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
            seed=args.seed,
            debug_dir=args.debug_dir
        )
    else:
        image = Image.open(args.image).convert('RGB')
        result = generator.generate_veneer_preview(
            image=image,
            prompt=args.prompt,
            negative_prompt=args.negative_prompt,
            num_inference_steps=args.steps,
            guidance_scale=args.guidance,
            seed=args.seed,
            debug_dir=args.debug_dir
        )
        result.save(args.output, quality=95)
        print(f"✓ Veneer preview saved to {args.output}")


if __name__ == "__main__":
    main()
