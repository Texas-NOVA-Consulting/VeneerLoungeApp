#!/usr/bin/env python3
"""
Diagnostic script to find why inference is slow.
"""

import sys
from pathlib import Path
import time
import torch

# Add pix2pix to path
sys.path.append(str(Path(__file__).parent / 'pix2pix'))

from pix2pix.models.networks import UNetGenerator


def diagnose_performance(checkpoint_path=None, test_image_path=None):
    """Diagnose where the slowdown is happening."""

    print("=" * 60)
    print("PERFORMANCE DIAGNOSTIC")
    print("=" * 60)

    # Check devices
    print("\n1. Device Availability:")
    print(f"   CUDA: {torch.cuda.is_available()}")
    print(f"   MPS (Mac GPU): {torch.backends.mps.is_available()}")

    # Auto-select device
    if torch.cuda.is_available():
        device = torch.device('cuda')
    elif torch.backends.mps.is_available():
        device = torch.device('mps')
    else:
        device = torch.device('cpu')

    print(f"\n   Selected device: {device}")

    # Test 1: Model creation
    print("\n2. Model Creation:")
    start = time.time()
    model = UNetGenerator(input_nc=3, output_nc=3, ngf=64)
    model_create_time = time.time() - start
    print(f"   Time: {model_create_time:.3f}s")

    # Test 2: Move to device
    print("\n3. Moving Model to Device:")
    start = time.time()
    model = model.to(device)
    move_time = time.time() - start
    print(f"   Time: {move_time:.3f}s")

    # Test 3: Set eval mode
    print("\n4. Setting Eval Mode:")
    start = time.time()
    model.eval()
    eval_time = time.time() - start
    print(f"   Time: {eval_time:.3f}s")

    # Count parameters
    params = sum(p.numel() for p in model.parameters())
    print(f"\n5. Model Size:")
    print(f"   Parameters: {params:,}")
    print(f"   Memory: ~{params * 4 / 1024 / 1024:.1f} MB (FP32)")

    # Test 4: First inference (cold start)
    print("\n6. First Inference (cold start):")
    dummy_input = torch.randn(1, 3, 256, 256).to(device)
    start = time.time()
    with torch.no_grad():
        output = model(dummy_input)
    first_inference_time = time.time() - start
    print(f"   Time: {first_inference_time:.3f}s")

    # Test 5: Subsequent inferences (warm)
    print("\n7. Subsequent Inferences (warm):")
    times = []
    for i in range(5):
        start = time.time()
        with torch.no_grad():
            output = model(dummy_input)
        if device.type == 'mps':
            torch.mps.synchronize()
        elapsed = time.time() - start
        times.append(elapsed)
        print(f"   Run {i+1}: {elapsed:.3f}s")

    avg_time = sum(times) / len(times)
    print(f"   Average: {avg_time:.3f}s")
    print(f"   Speed: {1/avg_time:.1f} images/sec")

    # Test 6: Load checkpoint (if provided)
    if checkpoint_path and Path(checkpoint_path).exists():
        print(f"\n8. Loading Checkpoint:")
        print(f"   Path: {checkpoint_path}")
        start = time.time()
        checkpoint = torch.load(checkpoint_path, map_location=device)
        load_time = time.time() - start
        print(f"   Load time: {load_time:.3f}s")

        if 'netG_state_dict' in checkpoint:
            state_dict = checkpoint['netG_state_dict']
        else:
            state_dict = checkpoint

        start = time.time()
        model.load_state_dict(state_dict)
        state_dict_time = time.time() - start
        print(f"   Load state dict time: {state_dict_time:.3f}s")

    # Test 7: Image loading (if provided)
    if test_image_path and Path(test_image_path).exists():
        from PIL import Image
        import torchvision.transforms as transforms

        print(f"\n9. Image Processing:")
        print(f"   Path: {test_image_path}")

        # Load image
        start = time.time()
        img = Image.open(test_image_path)
        load_img_time = time.time() - start
        print(f"   Load image: {load_img_time:.3f}s")

        # Preprocess
        transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ])

        start = time.time()
        img_tensor = transform(img).unsqueeze(0).to(device)
        preprocess_time = time.time() - start
        print(f"   Preprocess: {preprocess_time:.3f}s")

        # Inference
        start = time.time()
        with torch.no_grad():
            output = model(img_tensor)
        if device.type == 'mps':
            torch.mps.synchronize()
        real_inference_time = time.time() - start
        print(f"   Inference: {real_inference_time:.3f}s")

        # Postprocess
        start = time.time()
        output_np = output.squeeze(0).cpu().numpy()
        postprocess_time = time.time() - start
        print(f"   Postprocess: {postprocess_time:.3f}s")

        total = load_img_time + preprocess_time + real_inference_time + postprocess_time
        print(f"\n   TOTAL TIME: {total:.3f}s")

    print("\n" + "=" * 60)
    print("DIAGNOSIS SUMMARY")
    print("=" * 60)

    print(f"\nDevice: {device}")
    print(f"Model creation: {model_create_time:.3f}s")
    print(f"First inference: {first_inference_time:.3f}s")
    print(f"Average inference: {avg_time:.3f}s")
    print(f"Expected speed: {1/avg_time:.1f} images/sec")

    # Recommendations
    print("\nRECOMMENDATIONS:")
    if device.type == 'cpu':
        print("  ⚠️  Using CPU! This is SLOW.")
        print("  → Use --device mps for Mac GPU acceleration")
    elif device.type == 'mps':
        print("  ✓ Using Mac GPU (MPS)")
        if avg_time > 0.5:
            print("  ⚠️  Still slow for MPS")
            print("  → Try --half-precision for 2x speedup")
            print("  → Increase --batch-size for multiple images")

    if avg_time < 0.1:
        print("  ✓ Performance looks good!")
    elif avg_time < 0.5:
        print("  ✓ Performance is acceptable")
        print("  → Use batch processing for multiple images")
    else:
        print("  ⚠️  Performance is slow")
        print("  → Check if model is on correct device")
        print("  → Try different device (CPU vs MPS)")

    print("\n" + "=" * 60)


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Diagnose inference performance')
    parser.add_argument('--checkpoint', type=str, help='Path to model checkpoint')
    parser.add_argument('--image', type=str, help='Path to test image')

    args = parser.parse_args()

    diagnose_performance(args.checkpoint, args.image)
