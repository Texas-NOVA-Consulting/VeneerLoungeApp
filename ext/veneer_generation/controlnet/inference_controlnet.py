"""
ControlNet Inference Pipeline for Veneer Preview Generation.
"""

import argparse
from pathlib import Path
import sys
import torch
import numpy as np
from PIL import Image, ImageFilter
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
        dtype = torch.float16 if self.device.type == 'cuda' else torch.float32
        controlnet = ControlNetModel.from_pretrained(controlnet_path, torch_dtype=dtype)
        self.pipe = StableDiffusionControlNetInpaintPipeline.from_pretrained(
            base_model_path,
            controlnet=controlnet,
            torch_dtype=dtype,
            safety_checker=None
        )

        self.pipe.scheduler = UniPCMultistepScheduler.from_config(self.pipe.scheduler.config, use_karras_sigmas=True)
        self.pipe = self.pipe.to(self.device)

        if self.device.type == 'cuda':
            self.pipe.enable_model_cpu_offload()

        self.seg_model = None
        if segmentation_checkpoint and segmentation_checkpoint != 'None':
            try:
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
            
            # Convert to HSV for better white detection
            hsv = cv2.cvtColor(img_array, cv2.COLOR_RGB2HSV)
            
            # Detect white/bright regions (teeth)
            lower_white = np.array([0, 0, 180])
            upper_white = np.array([180, 30, 255])
            mask = cv2.inRange(hsv, lower_white, upper_white)
            
            return Image.fromarray(mask, mode='L')
        
        image = image.resize(target_size, Image.LANCZOS)
        img_array = np.array(image)
        img_tensor = torch.from_numpy(img_array).permute(2, 0, 1).float()
        img_tensor = img_tensor.unsqueeze(0) / 255.0
        img_tensor = img_tensor.to(self.device)
        
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
        img_array = np.array(image)
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, low_threshold, high_threshold)

        return Image.fromarray(edges, mode='L')

    def crop_to_mouth(self, image, mask, pad=40):
        img_np = np.array(image)
        mask_np = np.array(mask)
        ys, xs = np.where(mask_np > 0)
        y0, y1 = ys.min(), ys.max()
        x0, x1 = xs.min(), xs.max()
        h, w = img_np.shape[:2]

        y0 = max(0, y0 - pad)
        x0 = max(0, x0 - pad)
        y1 = min(h, y1 + pad)
        x1 = min(w, x1 + pad)
        cropped_img = image.crop((x0, y0, x1, y1))
        crop_mask = mask.crop((x0, y0, x1, y1))
        return cropped_img, crop_mask, (x0, y0)

    def composite_back(self, original, generated_crop, mask, offset):
        x0, y0 = offset
        final = original.copy()
        mask_np = np.array(mask)
        mask = Image.fromarray(mask_np, mode='L')
        final.paste(generated_crop, (x0, y0), mask=mask)
        return final

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

        edges = None
        if use_edges:
            edges = self.generate_edge_map(image)
            edges_np = np.array(edges)
            mask_np = np.array(mask)
            edges_np[~mask_np] = 0
            edges = Image.fromarray(edges_np, mode='L')

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

    def refine_tooth_mask(self, mask, erosion_px=6):
        mask_np = np.array(mask)
        kernel = np.ones((erosion_px, erosion_px), np.uint8)
        refined = cv2.erode(mask_np, kernel, iterations=1)
        return Image.fromarray(refined, mode='L')

    def generate_veneer_preview(
        self,
        image,
        prompt=None,
        negative_prompt=None,
        num_inference_steps=30,
        guidance_scale=3.5,
        controlnet_conditioning_scale=0.6,
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
        original_image = image.copy()
        orig_w, orig_h = original_image.size

        crop_img, crop_mask, offset = self.crop_to_mouth(image, self.generate_segmentation_mask(image))
        GEN_SIZE = 768
        sd_crop_img = crop_img.resize((GEN_SIZE, GEN_SIZE), Image.LANCZOS)
        sd_crop_mask = crop_mask.resize((GEN_SIZE, GEN_SIZE), Image.NEAREST)
        tooth_mask = self.generate_segmentation_mask(image)
        tooth_mask = self.refine_tooth_mask(tooth_mask)
        tooth_mask = Image.fromarray(cv2.erode(np.array(tooth_mask), np.ones((8,8), np.uint8), iterations=1), mode="L")


        # ADDITONAL MASK PROCESSING: GATING LOWER HALF TO AVOID CHANING FACIAL FEATURES
        mask_np = np.array(tooth_mask)
        h, w = mask_np.shape

        gate = np.zeros_like(mask_np, dtype=np.uint8)
        
        # Change this gate to be more dynamic, using user input (coordinates of mouth region)
        
        gate[int(0.4 * h):, :] = 255  # bottom 60%

        mask_np = cv2.bitwise_and(mask_np, gate)
        mask_np = cv2.GaussianBlur(mask_np, (31, 31), 0)
        tooth_mask = Image.fromarray(mask_np, mode="L")

        tooth_mask.save("debug_outputs/gated_tooth_mask.png")
        # END ADDITONAL MASK PROCESSING

        crop_img, crop_mask, offset = self.crop_to_mouth(image, tooth_mask)
        orig_crop_size = crop_img.size
        sd_crop_img = crop_img.resize((GEN_SIZE, GEN_SIZE), Image.LANCZOS)
        sd_crop_mask = crop_mask.resize((GEN_SIZE, GEN_SIZE), Image.NEAREST)
        if debug_dir:
            sd_crop_img.save(Path(debug_dir) / 'cropped.png')
        #generate edges only on the cropped region
        edges = self.generate_edge_map(sd_crop_img)
        edges_np = np.array(edges)
        edges_np[np.array(sd_crop_mask) == 0] = 0
        conditioning_image = Image.fromarray(edges_np).convert("RGB")

        if debug_dir:
            debug_path = Path(debug_dir)
            debug_path.mkdir(parents=True, exist_ok=True)
            tooth_mask.save(debug_path / 'tooth_mask.png')
            image.save(debug_path / 'input_resized.png')

        if debug_dir:
            conditioning_image.save(Path(debug_dir) / 'conditioning.png')
            print(f"Debug: Saved conditioning image to {Path(debug_dir) / 'conditioning.png'}")

        if prompt is None:
            prompt = "natural dental veneers applied only to existing tooth enamel, realistic tooth anatomy, proper dental occlusion, natural enamel texture, photorealistic dentistry"

        if negative_prompt is None:
            negative_prompt = "distorted mouth, modified lips, altered gums, changed lip shape, extra teeth, melted teeth, deformed anatomy, plastic texture, artificial look, cartoon, surreal, exaggerated features, face modification, skin changes"

        if seed is not None:
            generator = torch.Generator(device=self.device).manual_seed(seed)
        else:
            generator = None
            
        output = self.pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image=sd_crop_img, 
            mask_image=sd_crop_mask,
            control_image=conditioning_image,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
            controlnet_conditioning_scale=controlnet_conditioning_scale,
            generator=generator,
            strength=0.15
        )

        generated_sd = output.images[0]
        generated_crop = generated_sd.resize(orig_crop_size, Image.LANCZOS)
        final_mask = crop_mask.resize(orig_crop_size, Image.LANCZOS)
        result_image = self.composite_back(original=image, generated_crop=generated_crop, mask=final_mask, offset=offset)
        result_image = result_image.resize((orig_w, orig_h), Image.LANCZOS)
        if debug_dir:
            result_image.save(Path(debug_dir) / 'output.png')
            print(f"Debug: Saved output to {Path(debug_dir) / 'output.png'}")
        result_image = result_image.filter(
            ImageFilter.UnsharpMask(1.2, 120, 3)
        )
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
        image = image.resize((512, 512), Image.LANCZOS)
        preview = self.generate_veneer_preview(image, **kwargs)
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
