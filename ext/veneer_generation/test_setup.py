"""
Test script to verify the Pix2pix setup is working correctly.

Run this after installing dependencies to ensure everything is configured properly.
"""

import sys
from pathlib import Path

def print_header(title):
    """Print a formatted header."""
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)


def test_imports():
    """Test that all required packages can be imported."""
    print_header("Testing Package Imports")

    required_packages = [
        ('torch', 'PyTorch'),
        ('torchvision', 'TorchVision'),
        ('PIL', 'Pillow'),
        ('numpy', 'NumPy'),
        ('flask', 'Flask'),
        ('sklearn', 'Scikit-learn'),
    ]

    all_passed = True

    for package, name in required_packages:
        try:
            __import__(package)
            print(f"✓ {name:20s} - OK")
        except ImportError as e:
            print(f"✗ {name:20s} - FAILED: {e}")
            all_passed = False

    return all_passed


def test_pytorch():
    """Test PyTorch installation and GPU availability."""
    print_header("Testing PyTorch")

    try:
        import torch

        print(f"✓ PyTorch version: {torch.__version__}")
        print(f"✓ CUDA available: {torch.cuda.is_available()}")
        print(f"✓ MPS (Mac GPU) available: {torch.backends.mps.is_available()}")

        # Test tensor creation
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        if torch.backends.mps.is_available() and not torch.cuda.is_available():
            device = 'mps'

        test_tensor = torch.randn(3, 3).to(device)
        print(f"✓ Created test tensor on {device}")

        return True

    except Exception as e:
        print(f"✗ PyTorch test failed: {e}")
        return False


def test_model_architectures():
    """Test that model architectures can be instantiated."""
    print_header("Testing Model Architectures")

    try:
        # Add pix2pix to path
        pix2pix_path = Path(__file__).parent / 'pix2pix'
        sys.path.insert(0, str(pix2pix_path))

        from models.networks import UNetGenerator, PatchGANDiscriminator
        import torch

        device = 'cpu'  # Use CPU for testing

        # Test Generator
        gen = UNetGenerator(input_nc=3, output_nc=3, ngf=64)
        gen = gen.to(device)
        test_input = torch.randn(1, 3, 256, 256).to(device)
        test_output = gen(test_input)
        print(f"✓ Generator: Input {test_input.shape} → Output {test_output.shape}")

        # Count parameters
        gen_params = sum(p.numel() for p in gen.parameters())
        print(f"  Parameters: {gen_params:,}")

        # Test Discriminator
        disc = PatchGANDiscriminator(input_nc=6, ndf=64)
        disc = disc.to(device)
        test_real = torch.randn(1, 3, 256, 256).to(device)
        test_fake = torch.randn(1, 3, 256, 256).to(device)
        test_disc_output = disc(test_real, test_fake)
        print(f"✓ Discriminator: Output shape {test_disc_output.shape}")

        # Count parameters
        disc_params = sum(p.numel() for p in disc.parameters())
        print(f"  Parameters: {disc_params:,}")

        return True

    except Exception as e:
        print(f"✗ Model architecture test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_dataset():
    """Test dataset loading."""
    print_header("Testing Dataset Loader")

    try:
        # Add pix2pix to path
        pix2pix_path = Path(__file__).parent / 'pix2pix'
        sys.path.insert(0, str(pix2pix_path))

        from data.veneer_dataset import VeneerDataset

        # Check if dataset exists
        dataset_root = Path(__file__).parent.parent.parent / 'data/veneer_dataset'

        if not dataset_root.exists():
            print(f"⚠️  Dataset not found at {dataset_root}")
            print("   Run prepare_data.py first to create the dataset")
            return None

        # Try to load train split
        train_dir = dataset_root / 'train' / 'A'
        if not train_dir.exists() or len(list(train_dir.glob('*.jpg'))) == 0:
            print(f"⚠️  No training images found at {train_dir}")
            print("   Run prepare_data.py first to create the dataset")
            return None

        # Load dataset
        dataset = VeneerDataset(str(dataset_root), phase='train')
        print(f"✓ Dataset loaded: {len(dataset)} training samples")

        # Load a sample
        if len(dataset) > 0:
            sample = dataset[0]
            print(f"✓ Sample loaded:")
            print(f"  Before image shape: {sample['A'].shape}")
            print(f"  After image shape: {sample['B'].shape}")

        return True

    except Exception as e:
        print(f"✗ Dataset test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_data_preparation():
    """Test data preparation script."""
    print_header("Testing Data Preparation")

    try:
        # Check if source data exists
        source_dir = Path(__file__).parent.parent.parent / 'data/annotate_batch1'

        if not source_dir.exists():
            print(f"⚠️  Source data directory not found: {source_dir}")
            return None

        # Count images
        image_files = list(source_dir.glob('*.jpg')) + \
                     list(source_dir.glob('*.png')) + \
                     list(source_dir.glob('*.jpeg'))

        print(f"✓ Source directory found: {source_dir}")
        print(f"  Total images: {len(image_files)}")

        # Check for before/after pairs
        before_images = [f for f in image_files if 'before' in f.stem.lower()]
        after_images = [f for f in image_files if 'after' in f.stem.lower()]

        print(f"  Images with 'before': {len(before_images)}")
        print(f"  Images with 'after': {len(after_images)}")

        if len(before_images) > 0 and len(after_images) > 0:
            print(f"✓ Ready for data preparation")
            return True
        else:
            print(f"⚠️  No before/after pairs found")
            print(f"   Make sure images have 'before' and 'after' in their names")
            return None

    except Exception as e:
        print(f"✗ Data preparation test failed: {e}")
        return False


def main():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("Pix2pix Veneer Generation - Setup Test")
    print("=" * 60)
    print("\nThis script will verify that your environment is set up correctly.")
    print("Make sure you've run ./setup_mac.sh before running this test.")

    results = {}

    # Run tests
    results['imports'] = test_imports()
    results['pytorch'] = test_pytorch()
    results['models'] = test_model_architectures()
    results['data_prep'] = test_data_preparation()
    results['dataset'] = test_dataset()

    # Print summary
    print_header("Test Summary")

    for test_name, result in results.items():
        if result is True:
            status = "✓ PASSED"
        elif result is False:
            status = "✗ FAILED"
        else:
            status = "⚠️  SKIPPED"

        print(f"{test_name.upper():20s}: {status}")

    # Overall result
    print("\n" + "=" * 60)

    failed = [name for name, result in results.items() if result is False]
    skipped = [name for name, result in results.items() if result is None]

    if len(failed) == 0:
        print("✓ All tests passed!")
        print("\nYou're ready to:")
        print("  1. Prepare your dataset: python ext/individual_tooth_segmentation/scripts/prepare_data.py")
        print("  2. Train the model: python ext/veneer_generation/pix2pix/train_pix2pix.py")
        print("  3. Start the API: python services/veneer-preview/api_server.py")
    else:
        print(f"✗ {len(failed)} test(s) failed:")
        for name in failed:
            print(f"  - {name}")
        print("\nPlease fix the failing tests before proceeding.")

    if len(skipped) > 0:
        print(f"\n⚠️  {len(skipped)} test(s) skipped:")
        for name in skipped:
            print(f"  - {name}")

    print("=" * 60)


if __name__ == '__main__':
    main()
