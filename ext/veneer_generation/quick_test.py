#!/usr/bin/env python3
"""
Quick test to diagnose slow inference.
Run this without any arguments to test your setup.
"""

import sys
from pathlib import Path
import time
import torch
from PIL import Image
import numpy as np

# Add pix2pix to path
sys.path.append(str(Path(__file__).parent / 'pix2pix'))

from pix2pix.models.networks import UNetGenerator


def quick_test():
    """Quick performance test."""

    print("=" * 60)
    print("QUICK PERFORMANCE TEST")
    print("=" * 60)

    # Check devices
    print("\n📱 Checking available devices...")
    has_cuda = torch.cuda.is_available()
    has_mps = torch.backends.mps.is_available()

    print(f"   CUDA (NVIDIA GPU): {'✓' if has_cuda else '✗'}")
    print(f"   MPS (Mac GPU): {'✓' if has_mps else '✗'}")

    # Select device
    if has_cuda:
        device = torch.device('cuda')
        print(f"\n✓ Using NVIDIA GPU")
    elif has_mps:
        device = torch.device('mps')
        print(f"\n✓ Using Mac GPU (MPS)")
    else:
        device = torch.device('cpu')
        print(f"\n⚠️  Using CPU - This will be SLOW!")
        print(f"   You have a Mac with M1/M2/M3? MPS should be available!")

    # Create model
    print(f"\n🔧 Creating model...")
    model = UNetGenerator(input_nc=3, output_nc=3, ngf=64)
    model = model.to(device)
    model.eval()

    param_count = sum(p.numel() for p in model.parameters())
    print(f"   Model parameters: {param_count:,}")
    print(f"   Model size: ~{param_count * 4 / 1024 / 1024:.1f} MB")

    # Create test image
    print(f"\n🖼️  Creating test image...")
    test_img = torch.randn(1, 3, 256, 256).to(device)

    # Warm up
    print(f"\n🔥 Warming up (first run is always slower)...")
    with torch.no_grad():
        _ = model(test_img)
    if device.type == 'mps':
        torch.mps.synchronize()

    # Test inference speed
    print(f"\n⚡ Testing inference speed...")
    times = []
    for i in range(10):
        start = time.time()
        with torch.no_grad():
            output = model(test_img)
        if device.type == 'mps':
            torch.mps.synchronize()
        elapsed = time.time() - start
        times.append(elapsed)

    avg_time = sum(times) / len(times)
    min_time = min(times)
    max_time = max(times)

    print(f"   Best:    {min_time:.4f}s")
    print(f"   Average: {avg_time:.4f}s")
    print(f"   Worst:   {max_time:.4f}s")
    print(f"   Speed:   {1/avg_time:.1f} images/sec")

    # Verdict
    print(f"\n" + "=" * 60)
    print("VERDICT")
    print("=" * 60)

    if avg_time < 0.1:
        print("🚀 EXCELLENT! Your setup is very fast!")
        print("   Expected: ~10+ images/sec with batch processing")
    elif avg_time < 0.5:
        print("✓ GOOD! Performance is acceptable.")
        print("   Expected: ~2-10 images/sec with batch processing")
    elif avg_time < 2.0:
        print("⚠️  SLOW but usable.")
        if device.type == 'cpu':
            print("   → You're using CPU. Try --device mps for 5-10x speedup!")
        else:
            print("   → Expected: ~0.5-2 images/sec")
    else:
        print("❌ VERY SLOW! Something is wrong.")
        print("   → Check if you're using the right device")
        print("   → Try --device mps or --device cpu")

    # Recommendations
    print(f"\nRECOMMENDATIONS:")

    if device.type == 'cpu' and (has_cuda or has_mps):
        print("   1. Use GPU acceleration:")
        print("      --device mps  (for Mac)")
        print("      --device cuda  (for NVIDIA)")

    if avg_time > 0.2:
        print("   2. Use batch processing for multiple images:")
        print("      --batch-size 8 --fast")

    if avg_time < 0.5:
        print("   3. Enable half precision for 2x speedup:")
        print("      --half-precision")

    print(f"\nFor a single image, expect:")
    print(f"   Time: ~{avg_time:.3f}s")
    print(f"\nFor 100 images with batch processing, expect:")
    print(f"   Time: ~{avg_time * 100 / 8:.1f}s (with batch-size 8)")
    print(f"   Speed: ~{8 / avg_time:.1f} images/sec")

    print("\n" + "=" * 60)

    # Test with actual image if we can create one
    print("\n🖼️  Testing with real image...")
    try:
        # Create test image
        test_pil = Image.fromarray(
            np.random.randint(0, 255, (256, 256, 3), dtype=np.uint8)
        )

        # Time the full pipeline
        import torchvision.transforms as transforms

        transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ])

        start = time.time()

        # Preprocess
        img_tensor = transform(test_pil).unsqueeze(0).to(device)

        # Inference
        with torch.no_grad():
            output = model(img_tensor)
        if device.type == 'mps':
            torch.mps.synchronize()

        # Postprocess
        output = (output + 1) / 2.0
        output = torch.clamp(output, 0, 1)
        output_np = output.squeeze(0).cpu().numpy()
        output_np = np.transpose(output_np, (1, 2, 0))
        output_np = (output_np * 255).astype(np.uint8)
        result_img = Image.fromarray(output_np)

        total_time = time.time() - start

        print(f"   Full pipeline time: {total_time:.4f}s")
        print(f"   (includes load, preprocess, inference, postprocess)")

    except Exception as e:
        print(f"   Failed: {e}")

    print("\n" + "=" * 60)
    print("Test complete! Use --device mps for faster processing.")
    print("=" * 60)


if __name__ == '__main__':
    quick_test()
