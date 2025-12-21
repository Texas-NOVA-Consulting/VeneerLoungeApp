"""
Test script for pretrained Pix2pix weights.

This script loads pretrained Pix2pix models from junyanz/pytorch-CycleGAN-and-pix2pix
and tests them on dental images to see if transfer learning is viable.
"""

import argparse
import sys
from pathlib import Path
import torch
import torchvision.transforms as transforms
from PIL import Image
import numpy as np

# Add paths
sys.path.append(str(Path(__file__).parent))
sys.path.append(str(Path(__file__).parent.parent / 'pretrained' / 'pytorch-CycleGAN-and-pix2pix'))

# Try to import from official repo
try:
    from models.networks import UNetGenerator
    OFFICIAL_REPO_AVAILABLE = True
except ImportError:
    print("Warning: Official pix2pix repo not available")
    print("Run setup_pretrained_models.sh first!")
    OFFICIAL_REPO_AVAILABLE = False
    # Fallback to our implementation
    from models.networks import UNetGenerator


class PretrainedPix2PixTester:
    """Test pretrained Pix2pix on dental images."""

    def __init__(
        self,
        checkpoint_path,
        device='auto'
    ):
        """
        Initialize tester.

        Args:
            checkpoint_path: Path to pretrained checkpoint
            device: Device to use
        """
        # Auto-detect device
        if device == 'auto':
            if torch.cuda.is_available():
                self.device = torch.device('cuda')
            elif torch.backends.mps.is_available():
                self.device = torch.device('mps')
            else:
                self.device = torch.device('cpu')
        else:
            self.device = torch.device(device)

        print(f"Using device: {self.device}")

        # Load model
        print(f"\nLoading Pix2pix from {checkpoint_path}")

        # Create generator
        self.netG = UNetGenerator(
            input_nc=3,
            output_nc=3,
            num_downs=8,
            ngf=64,
            norm_layer=torch.nn.BatchNorm2d,
            use_dropout=False
        )

        # Load checkpoint
        self._load_checkpoint(checkpoint_path)
        self.netG = self.netG.to(self.device)
        self.netG.eval()

        # Define transforms
        self.transform = transforms.Compose([
            transforms.Resize((256, 256), interpolation=transforms.InterpolationMode.BICUBIC),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ])

        print("✓ Pretrained Pix2pix loaded successfully!")

    def _load_checkpoint(self, checkpoint_path):
        """Load checkpoint."""
        checkpoint_path = Path(checkpoint_path)
        if not checkpoint_path.exists():
            raise FileNotFoundError(f"Checkpoint not found: {checkpoint_path}")

        checkpoint = torch.load(checkpoint_path, map_location=self.device)

        # Handle different checkpoint formats
        if isinstance(checkpoint, dict):
            if 'state_dict' in checkpoint:
                state_dict = checkpoint['state_dict']
            elif 'netG' in checkpoint:
                state_dict = checkpoint['netG']
            elif 'model' in checkpoint:
                state_dict = checkpoint['model']
            else:
                # Assume it's the state dict itself
                state_dict = checkpoint
        else:
            state_dict = checkpoint

        # Try to load with strict=False to handle potential architecture mismatches
        try:
            self.netG.load_state_dict(state_dict, strict=True)
            print("✓ Loaded checkpoint with strict matching")
        except Exception as e:
            print(f"Warning: Strict loading failed: {e}")
            print("Attempting to load with strict=False...")
            self.netG.load_state_dict(state_dict, strict=False)
            print("✓ Loaded checkpoint with partial matching")

    def preprocess(self, image):
        """Preprocess image."""
        if isinstance(image, (str, Path)):
            image = Image.open(image).convert('RGB')

        if not isinstance(image, Image.Image):
            raise TypeError("Input must be PIL Image or path")

        tensor = self.transform(image)
        tensor = tensor.unsqueeze(0)  # Add batch dimension

        return tensor

    def postprocess(self, tensor):
        """Postprocess tensor to PIL Image."""
        tensor = tensor.squeeze(0)
        tensor = (tensor + 1) / 2.0
        tensor = torch.clamp(tensor, 0, 1)

        array = tensor.cpu().numpy()
        array = np.transpose(array, (1, 2, 0))
        array = (array * 255).astype(np.uint8)

        return Image.fromarray(array)

    @torch.no_grad()
    def generate(self, image_path):
        """Generate output."""
        # Load and preprocess
        input_tensor = self.preprocess(image_path).to(self.device)

        # Generate
        output_tensor = self.netG(input_tensor)

        # Postprocess
        output_image = self.postprocess(output_tensor)

        return output_image

    def generate_comparison(self, image_path, output_path):
        """Generate side-by-side comparison."""
        # Load original
        original = Image.open(image_path).convert('RGB')
        original = original.resize((256, 256), Image.LANCZOS)

        # Generate
        result = self.generate(image_path)

        # Create comparison
        comparison = Image.new('RGB', (512, 256))
        comparison.paste(original, (0, 0))
        comparison.paste(result, (256, 0))

        # Save
        comparison.save(output_path, quality=95)
        print(f"\n✓ Comparison saved to {output_path}")

        return comparison


def find_pretrained_model():
    """Find available pretrained models."""
    base_path = Path(__file__).parent.parent / 'pretrained' / 'pytorch-CycleGAN-and-pix2pix' / 'checkpoints'

    if not base_path.exists():
        return None

    # Look for common pretrained models
    model_names = ['facades_pix2pix', 'edges2shoes_pix2pix', 'edges2handbags_pix2pix']

    for model_name in model_names:
        model_dir = base_path / model_name
        if model_dir.exists():
            # Look for generator checkpoint
            for pattern in ['latest_net_G.pth', '*_net_G.pth', 'generator.pth']:
                checkpoints = list(model_dir.glob(pattern))
                if checkpoints:
                    return checkpoints[0]

    return None


def main():
    parser = argparse.ArgumentParser(
        description='Test pretrained Pix2pix on dental images'
    )
    parser.add_argument(
        '--image',
        type=str,
        required=True,
        help='Input image'
    )
    parser.add_argument(
        '--output',
        type=str,
        required=True,
        help='Output path'
    )
    parser.add_argument(
        '--checkpoint',
        type=str,
        help='Path to pretrained checkpoint (auto-detect if not provided)'
    )
    parser.add_argument(
        '--device',
        type=str,
        default='auto',
        choices=['auto', 'cuda', 'mps', 'cpu'],
        help='Device to use'
    )

    args = parser.parse_args()

    # Find checkpoint
    checkpoint_path = args.checkpoint
    if checkpoint_path is None:
        print("Auto-detecting pretrained model...")
        checkpoint_path = find_pretrained_model()
        if checkpoint_path is None:
            print("ERROR: No pretrained model found!")
            print("Please run setup_pretrained_models.sh first")
            sys.exit(1)
        print(f"Found pretrained model: {checkpoint_path}")

    # Create tester
    try:
        tester = PretrainedPix2PixTester(
            checkpoint_path=checkpoint_path,
            device=args.device
        )

        # Generate comparison
        print("\nGenerating comparison...")
        tester.generate_comparison(
            image_path=args.image,
            output_path=args.output
        )

        print("\n" + "="*60)
        print("✓ Test complete!")
        print("="*60)
        print("\nNOTE: This is a pretrained model on architectural facades,")
        print("not dental images. The output will likely not look like veneers.")
        print("This is just to test that the pretrained weights load correctly.")
        print("\nTo get good results, you'll need to fine-tune on your dental dataset.")

    except Exception as e:
        print(f"\nERROR: {e}")
        print("\nThis could be due to:")
        print("1. Missing pretrained model (run setup_pretrained_models.sh)")
        print("2. Architecture mismatch (pretrained model uses different config)")
        print("3. Corrupted checkpoint file")
        sys.exit(1)


if __name__ == '__main__':
    main()
