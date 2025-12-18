"""
Unified Veneer Preview Service

This service provides a single interface for veneer preview generation with
- ControlNet (recommended for geometric + color changes)
- Pix2pix (fast baseline for cosmetic changes only)

The service handles:
1. Model loading and caching
2. Image preprocessing
3. Inference
4. Result post-processing
5. Base64 encoding for API responses
"""

import base64
import io
import sys
from pathlib import Path
from PIL import Image
import torch
import numpy as np

# Add paths
sys.path.insert(0, str(Path(__file__).parent.parent.parent / 'ext' / 'veneer_generation'))


class VeneerPreviewService:
    """
    Unified service for veneer preview generation.
    Supports multiple model backends with a consistent interface.
    """

    def __init__(self, model_type='controlnet', **model_config):
        """
        Initialize the veneer preview service.

        Args:
            model_type: Type of model to use ('controlnet' or 'pix2pix')
            **model_config: Model-specific configuration
                For ControlNet:
                    - controlnet_path: Path to ControlNet weights
                    - base_model_path: Path to Stable Diffusion base
                    - segmentation_checkpoint: Path to segmentation model
                For Pix2pix:
                    - checkpoint_path: Path to trained pix2pix model
                    - segmentation_checkpoint: Path to segmentation model
        """
        self.model_type = model_type
        self.generator = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        print(f"Initializing Veneer Preview Service...")
        print(f"  Model type: {model_type}")
        print(f"  Device: {self.device}")

        # Initialize the appropriate model
        self._initialize_generator(model_config)

    def _initialize_generator(self, config):
        """
        Initialize the veneer generator based on model type.

        Args:
            config: Model-specific configuration dictionary
        """
        if self.model_type == 'controlnet':
            self._init_controlnet(config)
        elif self.model_type == 'pix2pix':
            self._init_pix2pix(config)
        else:
            raise ValueError(f"Unknown model type: {self.model_type}")

    def _init_controlnet(self, config):
        """Initialize ControlNet generator."""
        from controlnet.inference_controlnet import VeneerControlNetGenerator

        required_keys = ['controlnet_path', 'segmentation_checkpoint']
        for key in required_keys:
            if key not in config:
                raise ValueError(f"Missing required config key for ControlNet: {key}")

        self.generator = VeneerControlNetGenerator(
            controlnet_path=config['controlnet_path'],
            base_model_path=config.get('base_model_path', 'runwayml/stable-diffusion-v1-5'),
            segmentation_checkpoint=config['segmentation_checkpoint'],
            device=str(self.device)
        )

        print("✓ ControlNet generator initialized")

    def _init_pix2pix(self, config):
        """Initialize Pix2pix generator."""
        sys.path.insert(0, str(Path(__file__).parent.parent.parent /
                              'ext/veneer_generation/pix2pix'))
        from inference_pix2pix import VeneerPix2PixGenerator

        required_keys = ['checkpoint_path']
        for key in required_keys:
            if key not in config:
                raise ValueError(f"Missing required config key for Pix2pix: {key}")

        self.generator = VeneerPix2PixGenerator(
            checkpoint_path=config['checkpoint_path'],
            device=str(self.device)
        )

        print("✓ Pix2pix generator initialized")

    def generate_from_pil(
        self,
        image,
        intensity=0.8,
        preserve_geometry=False,
        custom_prompt=None,
        **kwargs
    ):
        """
        Generate veneer preview from PIL Image.

        Args:
            image: PIL Image
            intensity: Transformation intensity (0-1)
                Higher = more dramatic changes
            preserve_geometry: If True, minimize tooth movement
            custom_prompt: Custom text prompt (ControlNet only)
            **kwargs: Additional model-specific arguments

        Returns:
            PIL Image of veneer preview
        """
        if self.model_type == 'controlnet':
            return self._generate_controlnet(
                image, intensity, preserve_geometry, custom_prompt, **kwargs
            )
        elif self.model_type == 'pix2pix':
            return self._generate_pix2pix(image, intensity, **kwargs)

    def _generate_controlnet(
        self,
        image,
        intensity,
        preserve_geometry,
        custom_prompt,
        **kwargs
    ):
        if preserve_geometry:
            controlnet_scale = 1.5
            guidance_scale = 6.0
        else:
            controlnet_scale = 1.0
            guidance_scale = 7.5

        if custom_prompt is None:
            if preserve_geometry:
                prompt = f"professional dental veneers, white teeth, beautiful smile, natural looking, high quality, photorealistic"
            else:
                prompt = f"professional dental veneers, perfectly aligned white teeth, beautiful smile, high quality, photorealistic"

        else:
            prompt = custom_prompt

        result = self.generator.generate_veneer_preview(
            image=image,
            prompt=prompt,
            num_inference_steps=kwargs.get('steps', 20),
            guidance_scale=guidance_scale,
            controlnet_conditioning_scale=controlnet_scale,
            seed=kwargs.get('seed', None)
        )

        return result

    def _generate_pix2pix(self, image, intensity, **kwargs):
        """
        Generate using Pix2pix.

        Args:
            image: PIL Image
            intensity: Not used for Pix2pix (always generates full transformation)
            **kwargs: Additional arguments (ignored for Pix2pix)

        Returns:
            PIL Image of veneer preview
        """
        result = self.generator.generate(image, return_pil=True)
        return result

    def generate_from_base64(
        self,
        base64_image,
        intensity=0.8,
        preserve_geometry=False,
        custom_prompt=None,
        return_format='base64',
        **kwargs
    ):
        """
        Generate veneer preview from base64 encoded image.

        This is the main API endpoint function.

        Args:
            base64_image: Base64 encoded image string
            intensity: Transformation intensity (0-1)
            preserve_geometry: If True, minimize tooth movement
            custom_prompt: Custom text prompt
            return_format: 'base64' or 'pil'
            **kwargs: Additional generation arguments

        Returns:
            Base64 encoded preview image (if return_format='base64')
            or PIL Image (if return_format='pil')
        """
        try:
            # DEBUG: Log what we received
            print(f"DEBUG: Received base64_image type: {type(base64_image)}")
            print(f"DEBUG: base64_image length: {len(base64_image) if base64_image else 0}")
            print(f"DEBUG: First 100 chars: {base64_image[:100] if base64_image else 'None'}")
            
            if ',' in base64_image:
                base64_image = base64_image.split(',')[1]
                print(f"DEBUG: After comma split, length: {len(base64_image)}")

            image_data = base64.b64decode(base64_image)
            print(f"DEBUG: Decoded image_data length: {len(image_data)}")
            print(f"DEBUG: First 10 bytes: {image_data[:10]}")
            
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
            preview = self.generate_from_pil(
                image=image,
                intensity=intensity,
                preserve_geometry=preserve_geometry,
                custom_prompt=custom_prompt,
                **kwargs
            )

            if return_format == 'pil':
                return preview
            buffer = io.BytesIO()
            preview.save(buffer, format='JPEG', quality=95)
            preview_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

            return f"data:image/jpeg;base64,{preview_base64}"

        except Exception as e:
            raise Exception(f"Error generating veneer preview: {str(e)}")

    def generate_from_file(
        self,
        file_path,
        output_path=None,
        intensity=0.8,
        preserve_geometry=False,
        **kwargs
    ):
        """
        Generate veneer preview from file path.

        Args:
            file_path: Path to input image
            output_path: Path to save output (optional)
            intensity: Transformation intensity
            preserve_geometry: Whether to preserve tooth positions
            **kwargs: Additional generation arguments

        Returns:
            PIL Image of preview
        """
        image = Image.open(file_path).convert('RGB')
        preview = self.generate_from_pil(
            image=image,
            intensity=intensity,
            preserve_geometry=preserve_geometry,
            **kwargs
        )
        if output_path:
            preview.save(output_path, quality=95)
            print(f"✓ Preview saved to {output_path}")

        return preview

_veneer_service = None


def get_veneer_service(model_type='controlnet', force_reload=False, **config):
    """
    Get singleton instance of veneer service.

    Args:
        model_type: Type of model ('controlnet' or 'pix2pix')
        force_reload: Force reload of service
        **config: Model configuration

    Returns:
        VeneerPreviewService instance
    """
    global _veneer_service

    if _veneer_service is None or force_reload:
        _veneer_service = VeneerPreviewService(
            model_type=model_type,
            **config
        )

    return _veneer_service


# Example usage
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('--image', type=str, required=True, help='Input image path')
    parser.add_argument('--output', type=str, required=True, help='Output path')
    parser.add_argument('--model', type=str, default='controlnet', choices=['controlnet', 'pix2pix'])
    parser.add_argument('--controlnet-path', type=str, help='Path to ControlNet weights')
    parser.add_argument('--segmentation', type=str, help='Path to segmentation checkpoint')
    parser.add_argument('--intensity', type=float, default=0.8, help='Transformation intensity')
    parser.add_argument('--preserve-geometry', action='store_true', help='Preserve tooth positions')

    args = parser.parse_args()

    # Configure service
    if args.model == 'controlnet':
        config = {
            'controlnet_path': args.controlnet_path,
            'segmentation_checkpoint': args.segmentation
        }
    else:
        config = {}

    # Get service
    service = get_veneer_service(model_type=args.model, **config)

    # Generate preview
    result = service.generate_from_file(
        file_path=args.image,
        output_path=args.output,
        intensity=args.intensity,
        preserve_geometry=args.preserve_geometry
    )

    print("✓ Veneer preview generated successfully!")
