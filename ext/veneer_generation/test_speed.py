#!/usr/bin/env python3
"""
Quick test script to compare old vs new inference speed.
"""

import sys
from pathlib import Path
import time
import torch

# Add pix2pix to path
sys.path.append(str(Path(__file__).parent / 'pix2pix'))

from pix2pix.inference_pix2pix import VeneerPix2PixGenerator


def test_speed(checkpoint_path, image_path, num_runs=5):
    """Test inference speed."""

    print("=" * 60)
    print("Speed Test")
    print("=" * 60)

    # Check available devices
    print("\nAvailable devices:")
    print(f"  CUDA: {torch.cuda.is_available()}")
    print(f"  MPS (Mac GPU): {torch.backends.mps.is_available()}")

    # Initialize generator
    print("\nInitializing generator...")
    generator = VeneerPix2PixGenerator(
        checkpoint_path,
        device='auto',
        use_half_precision=False
    )

    # Warm up
    print("\nWarming up...")
    _ = generator.generate(image_path)

    # Test single image
    print(f"\nTesting single image ({num_runs} runs)...")
    times = []
    for i in range(num_runs):
        start = time.time()
        _ = generator.generate(image_path)
        elapsed = time.time() - start
        times.append(elapsed)
        print(f"  Run {i+1}: {elapsed:.3f}s")

    avg_time = sum(times) / len(times)
    print(f"\n  Average: {avg_time:.3f}s")
    print(f"  Speed: {1/avg_time:.1f} imgs/sec")

    # Test batch processing
    print(f"\nTesting batch processing (batch_size=8)...")
    images = [image_path] * 8
    start = time.time()
    _ = generator.generate_batch(images, batch_size=8)
    elapsed = time.time() - start
    print(f"  8 images in {elapsed:.3f}s")
    print(f"  Speed: {8/elapsed:.1f} imgs/sec")
    print(f"  Speedup: {(8/elapsed) / (1/avg_time):.1f}x faster!")

    print("\n" + "=" * 60)
    print("✓ Test complete!")
    print("=" * 60)


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Test inference speed')
    parser.add_argument('--checkpoint', type=str, required=True,
                       help='Path to model checkpoint')
    parser.add_argument('--image', type=str, required=True,
                       help='Path to test image')
    parser.add_argument('--runs', type=int, default=5,
                       help='Number of test runs')

    args = parser.parse_args()

    test_speed(args.checkpoint, args.image, args.runs)
