"""
Simple SDXL Veneer Generator - Full Image Approach

Sends the full image to SDXL inpainting with a teeth mask.
No cropping, no complex blending - let SDXL handle everything.
"""

import torch
import numpy as np
from PIL import Image
from pathlib import Path
import cv2

from diffusers import StableDiffusionXLInpaintPipeline


class SimpleVeneerGenerator:
    """
    Simplest possible SDXL veneer generator.

    - Sends full image to SDXL
    - Uses a mask for teeth region only
    - SDXL handles all the blending internally
    """

    def __init__(self, device="cuda"):
        self.device = torch.device(device if torch.cuda.is_available() else "cpu")
        dtype = torch.float16 if self.device.type == 'cuda' else torch.float32

        print("Loading SDXL Inpainting pipeline...")
        self.pipe = StableDiffusionXLInpaintPipeline.from_pretrained(
            "stabilityai/stable-diffusion-xl-base-1.0",
            torch_dtype=dtype,
            variant="fp16" if dtype == torch.float16 else None,
        ).to(self.device)

        if self.device.type == 'cuda':
            self.pipe.enable_model_cpu_offload()

        print("✓ SimpleVeneerGenerator initialized")

    def generate(
        self,
        image_path,
        mask_path,
        output_path,
        strength=0.75,
        guidance_scale=7.5,
        num_inference_steps=30,
        seed=None,
    ):
        """
        Generate veneer preview.

        Args:
            image_path: Path to input image
            mask_path: Path to mask image (white = teeth area to modify)
            output_path: Path to save output
            strength: Denoising strength (lower = less change, preserves more)
            guidance_scale: CFG scale
            num_inference_steps: Number of diffusion steps
            seed: Random seed
        """
        # Load image and mask
        image = Image.open(image_path).convert("RGB")
        mask = Image.open(mask_path).convert("L")

        orig_size = image.size
        print(f"Original image size: {orig_size}")
        print(f"Mask size: {mask.size}")

        # Resize to SDXL-friendly size (must be multiple of 8)
        # Keep aspect ratio, fit within 1024x1024
        max_size = 1024
        ratio = min(max_size / orig_size[0], max_size / orig_size[1])
        new_w = int(orig_size[0] * ratio) // 8 * 8
        new_h = int(orig_size[1] * ratio) // 8 * 8

        image_resized = image.resize((new_w, new_h), Image.LANCZOS)
        mask_resized = mask.resize((new_w, new_h), Image.LANCZOS)

        print(f"Resized to: {new_w}x{new_h}")

        # Feather the mask edges for smooth blending
        mask_np = np.array(mask_resized)
        mask_np = cv2.GaussianBlur(mask_np, (21, 21), 0)
        mask_resized = Image.fromarray(mask_np)

        # Setup generator
        generator = None
        if seed is not None:
            generator = torch.Generator(device=self.device).manual_seed(seed)

        # Simple, focused prompt
        prompt = """perfect white dental veneers, natural teeth,
                    same person same face, photorealistic"""

        negative_prompt = """different person, changed face, distorted face,
                            plastic teeth, CGI, cartoon, blurry"""

        # Run SDXL inpainting
        print("Running SDXL inpainting...")
        output = self.pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image=image_resized,
            mask_image=mask_resized,
            strength=strength,
            guidance_scale=guidance_scale,
            num_inference_steps=num_inference_steps,
            generator=generator
        )

        result = output.images[0]

        # Resize back to original size
        result = result.resize(orig_size, Image.LANCZOS)

        # Save
        result.save(output_path, quality=95)
        print(f"✓ Saved to {output_path}")

        return result


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Simple SDXL Veneer Generator')
    parser.add_argument('--image', type=str, required=True, help='Input image')
    parser.add_argument('--mask', type=str, required=True, help='Mask image (white=teeth)')
    parser.add_argument('--output', type=str, required=True, help='Output path')
    parser.add_argument('--strength', type=float, default=0.75, help='Strength (0.5-0.9)')
    parser.add_argument('--guidance', type=float, default=7.5, help='Guidance scale')
    parser.add_argument('--steps', type=int, default=30, help='Inference steps')
    parser.add_argument('--seed', type=int, default=None, help='Random seed')
    parser.add_argument('--device', type=str, default='cuda', help='Device')

    args = parser.parse_args()

    generator = SimpleVeneerGenerator(device=args.device)

    generator.generate(
        image_path=args.image,
        mask_path=args.mask,
        output_path=args.output,
        strength=args.strength,
        guidance_scale=args.guidance,
        num_inference_steps=args.steps,
        seed=args.seed
    )


if __name__ == "__main__":
    main()
