"""
Inference pipeline for Pix2pix veneer generation.

This script loads a trained model and generates veneer previews from input images.
"""

import os
import argparse
from pathlib import Path
import torch
import torchvision.transforms as transforms
from PIL import Image
import numpy as np

# Import model
import sys
sys.path.append(str(Path(__file__).parent))
from models.networks import UNetGenerator


class VeneerPix2PixGenerator:
    """
    Inference class for Pix2pix veneer generation.

    Handles:
    - Model loading
    - Image preprocessing
    - Inference
    - Post-processing
    """

    def __init__(self, checkpoint_path, device='cuda'):
        """
        Initialize the generator.

        Args:
            checkpoint_path: Path to model checkpoint
            device: Device to run inference on ('cuda' or 'cpu')
        """
        self.device = torch.device(device if torch.cuda.is_available() else 'cpu')
        print(f"Initializing Pix2pix generator on {self.device}...")

        # Load model
        self.netG = UNetGenerator(input_nc=3, output_nc=3, ngf=64)
        self._load_checkpoint(checkpoint_path)
        self.netG = self.netG.to(self.device)
        self.netG.eval()

        # Define transforms
        self.transform = transforms.Compose([
            transforms.Resize((256, 256), interpolation=transforms.InterpolationMode.BICUBIC),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ])

        print(f"✓ Generator loaded successfully")

    def _load_checkpoint(self, checkpoint_path):
        """
        Load model weights from checkpoint.

        Args:
            checkpoint_path: Path to checkpoint file
        """
        checkpoint_path = Path(checkpoint_path)
        if not checkpoint_path.exists():
            raise FileNotFoundError(f"Checkpoint not found: {checkpoint_path}")

        checkpoint = torch.load(checkpoint_path, map_location=self.device)

        # Handle different checkpoint formats
        if 'netG_state_dict' in checkpoint:
            state_dict = checkpoint['netG_state_dict']
        else:
            state_dict = checkpoint

        self.netG.load_state_dict(state_dict)

    def preprocess(self, image):
        """
        Preprocess input image.

        Args:
            image: PIL Image or numpy array

        Returns:
            Preprocessed tensor
        """
        if isinstance(image, np.ndarray):
            image = Image.fromarray(image)

        if not isinstance(image, Image.Image):
            raise TypeError("Input must be PIL Image or numpy array")

        # Convert to RGB
        image = image.convert('RGB')

        # Apply transforms
        tensor = self.transform(image)
        tensor = tensor.unsqueeze(0)  # Add batch dimension

        return tensor

    def postprocess(self, tensor):
        """
        Postprocess output tensor to PIL Image.

        Args:
            tensor: Output tensor from model

        Returns:
            PIL Image
        """
        # Remove batch dimension
        tensor = tensor.squeeze(0)

        # Denormalize from [-1, 1] to [0, 1]
        tensor = (tensor + 1) / 2.0
        tensor = torch.clamp(tensor, 0, 1)

        # Convert to numpy
        array = tensor.cpu().numpy()
        array = np.transpose(array, (1, 2, 0))

        # Convert to uint8
        array = (array * 255).astype(np.uint8)

        # Convert to PIL Image
        image = Image.fromarray(array)

        return image

    @torch.no_grad()
    def generate(self, image, return_pil=True):
        """
        Generate veneer preview from input image.

        Args:
            image: Input image (PIL Image, numpy array, or file path)
            return_pil: Whether to return PIL Image (True) or tensor (False)

        Returns:
            Generated veneer preview
        """
        # Load image if path provided
        if isinstance(image, (str, Path)):
            image = Image.open(image)

        # Preprocess
        input_tensor = self.preprocess(image).to(self.device)

        # Generate
        output_tensor = self.netG(input_tensor)

        # Postprocess
        if return_pil:
            output = self.postprocess(output_tensor)
        else:
            output = output_tensor

        return output

    def generate_batch(self, images, return_pil=True):
        """
        Generate veneer previews for a batch of images.

        Args:
            images: List of input images
            return_pil: Whether to return PIL Images

        Returns:
            List of generated previews
        """
        outputs = []
        for image in images:
            output = self.generate(image, return_pil=return_pil)
            outputs.append(output)
        return outputs

    def generate_and_save(self, input_path, output_path):
        """
        Generate veneer preview and save to file.

        Args:
            input_path: Path to input image
            output_path: Path to save output image
        """
        output = self.generate(input_path, return_pil=True)
        output.save(output_path, quality=95)
        print(f"✓ Saved preview to {output_path}")

    def generate_comparison(self, input_path, output_path):
        """
        Generate side-by-side comparison image.

        Args:
            input_path: Path to input image
            output_path: Path to save comparison image
        """
        # Load input
        input_image = Image.open(input_path).convert('RGB')
        input_image = input_image.resize((256, 256), Image.Resampling.LANCZOS)

        # Generate preview
        preview = self.generate(input_image, return_pil=True)

        # Create side-by-side comparison
        comparison = Image.new('RGB', (512, 256))
        comparison.paste(input_image, (0, 0))
        comparison.paste(preview, (256, 0))

        # Save
        comparison.save(output_path, quality=95)
        print(f"✓ Saved comparison to {output_path}")


def main():
    parser = argparse.ArgumentParser(description='Generate veneer previews with Pix2pix')

    parser.add_argument('--checkpoint', type=str, required=True,
                       help='Path to model checkpoint')
    parser.add_argument('--input', type=str, required=True,
                       help='Path to input image or directory')
    parser.add_argument('--output', type=str, required=True,
                       help='Path to save output image or directory')
    parser.add_argument('--comparison', action='store_true',
                       help='Generate side-by-side comparison')
    parser.add_argument('--device', type=str, default='cuda',
                       choices=['cuda', 'cpu'],
                       help='Device to run inference on')

    args = parser.parse_args()

    print("=" * 60)
    print("Pix2pix Veneer Preview Generation")
    print("=" * 60)
    print(f"Checkpoint: {args.checkpoint}")
    print(f"Input: {args.input}")
    print(f"Output: {args.output}")
    print()

    # Initialize generator
    generator = VeneerPix2PixGenerator(args.checkpoint, device=args.device)

    # Process single image or directory
    input_path = Path(args.input)
    output_path = Path(args.output)

    if input_path.is_file():
        # Single image
        if args.comparison:
            generator.generate_comparison(str(input_path), str(output_path))
        else:
            generator.generate_and_save(str(input_path), str(output_path))

    elif input_path.is_dir():
        # Directory of images
        output_path.mkdir(parents=True, exist_ok=True)

        image_extensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']
        image_files = []
        for ext in image_extensions:
            image_files.extend(input_path.glob(f'*{ext}'))

        if len(image_files) == 0:
            print(f"❌ No images found in {input_path}")
            return

        print(f"Found {len(image_files)} images")
        print()

        for img_file in image_files:
            out_file = output_path / f"{img_file.stem}_veneer{img_file.suffix}"

            if args.comparison:
                generator.generate_comparison(str(img_file), str(out_file))
            else:
                generator.generate_and_save(str(img_file), str(out_file))

    else:
        print(f"❌ Input path not found: {input_path}")
        return

    print()
    print("=" * 60)
    print("✓ Generation complete!")
    print("=" * 60)


if __name__ == '__main__':
    main()
