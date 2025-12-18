"""
Prepares paired veneer dataset from existing before/after images.

This script:
1. Finds matching before/after image pairs
2. Aligns and preprocesses them
3. Splits into train/test/val sets
4. Saves in the format required by pix2pix
"""

import os
import shutil
from pathlib import Path
from PIL import Image
import numpy as np
from sklearn.model_selection import train_test_split
import argparse


def find_image_pairs(data_dir):
    """
    Finds matching before/after image pairs.

    Handles naming patterns like:
    - before1.jpg / after1.jpg
    - 39-female-before-porcelain-veneers.jpg / 39-female-after-porcelain-veneers.jpg

    Args:
        data_dir: Directory containing the images

    Returns:
        List of (before_path, after_path) tuples
    """
    data_path = Path(data_dir)
    images = list(data_path.glob("*.jpg")) + list(data_path.glob("*.png")) + \
             list(data_path.glob("*.jpeg")) + list(data_path.glob("*.PNG"))

    pairs = []
    processed = set()

    for img in images:
        if img in processed:
            continue

        name = img.stem.lower()

        # Look for before/after patterns
        if 'before' in name:
            # Try to find matching after image
            after_name = name.replace('before', 'after')

            # Try different extensions
            for ext in ['.jpg', '.png', '.jpeg', '.PNG', '.JPG', '.JPEG']:
                after_path = data_path / f"{after_name}{ext}"
                if after_path.exists():
                    pairs.append((str(img), str(after_path)))
                    processed.add(img)
                    processed.add(after_path)
                    print(f"✓ Found pair: {img.name} <-> {after_path.name}")
                    break

    return pairs


def align_images(img1_path, img2_path, target_size=(256, 256)):
    """
    Aligns and resizes two images to same dimensions.

    pix2pix requires paired images to be the same size.
    Standard size is 256x256 for training.

    Args:
        img1_path: Path to first image
        img2_path: Path to second image
        target_size: Target dimensions (width, height)

    Returns:
        Tuple of (img1, img2) as PIL Images
    """
    try:
        img1 = Image.open(img1_path).convert('RGB')
        img2 = Image.open(img2_path).convert('RGB')

        # Resize to target size using high-quality resampling
        img1 = img1.resize(target_size, Image.Resampling.LANCZOS)
        img2 = img2.resize(target_size, Image.Resampling.LANCZOS)

        return img1, img2
    except Exception as e:
        print(f"Error processing {img1_path}: {e}")
        return None, None


def prepare_dataset(source_dir, output_dir, train_ratio=0.7, val_ratio=0.15, target_size=(256, 256)):
    """
    Main function to prepare dataset.

    Splits data into train/val/test sets:
    - Train: For training the model
    - Val: For validation during training
    - Test: For final performance testing

    Args:
        source_dir: Directory with before/after images
        output_dir: Output directory for organized dataset
        train_ratio: Proportion of data for training (0.7 = 70%)
        val_ratio: Proportion for validation (0.15 = 15%)
        target_size: Image dimensions (width, height)
    """
    print("=" * 60)
    print("VENEER DATASET PREPARATION")
    print("=" * 60)
    print(f"\nSource directory: {source_dir}")
    print(f"Output directory: {output_dir}")
    print(f"Target size: {target_size}")
    print(f"Split: {train_ratio*100:.0f}% train, {val_ratio*100:.0f}% val, {(1-train_ratio-val_ratio)*100:.0f}% test\n")

    # Find image pairs
    print("Searching for before/after image pairs...")
    pairs = find_image_pairs(source_dir)
    print(f"\n✓ Found {len(pairs)} image pairs\n")

    if len(pairs) == 0:
        print("❌ No pairs found! Check your image naming.")
        print("Expected patterns: 'before1.jpg'/'after1.jpg' or 'X-before-Y.jpg'/'X-after-Y.jpg'")
        return

    if len(pairs) < 3:
        print("⚠️  Warning: Very small dataset! Consider collecting more images.")
        print("   For better results, aim for at least 50-100 pairs.")

    # Split into train/val/test
    test_ratio = 1 - train_ratio - val_ratio

    if len(pairs) >= 3:
        train_pairs, temp_pairs = train_test_split(
            pairs, test_size=(1 - train_ratio), random_state=42, shuffle=True
        )
        if len(temp_pairs) >= 2:
            val_pairs, test_pairs = train_test_split(
                temp_pairs, test_size=(test_ratio / (1 - train_ratio)), random_state=42
            )
        else:
            val_pairs = temp_pairs
            test_pairs = []
    else:
        # Too few pairs, put everything in train
        train_pairs = pairs
        val_pairs = []
        test_pairs = []
        print("⚠️  Dataset too small for proper split. Using all data for training.")

    # Create directories
    output_path = Path(output_dir)

    for split_name, split_pairs in [
        ('train', train_pairs),
        ('val', val_pairs),
        ('test', test_pairs)
    ]:
        if len(split_pairs) == 0:
            continue

        split_dir = output_path / split_name
        (split_dir / 'A').mkdir(parents=True, exist_ok=True)
        (split_dir / 'B').mkdir(parents=True, exist_ok=True)

        print(f"Processing {split_name} set ({len(split_pairs)} pairs)...")

        for idx, (before_path, after_path) in enumerate(split_pairs):
            before_img, after_img = align_images(before_path, after_path, target_size)

            if before_img is None or after_img is None:
                print(f"  ⚠️  Skipped pair {idx}: Error processing images")
                continue

            # Save with consistent naming
            before_img.save(split_dir / 'A' / f"{idx:04d}.jpg", quality=95)
            after_img.save(split_dir / 'B' / f"{idx:04d}.jpg", quality=95)

        print(f"  ✓ Saved {len(split_pairs)} pairs to {split_dir}")

    print(f"\n{'=' * 60}")
    print("DATASET PREPARATION COMPLETE")
    print(f"{'=' * 60}")
    print(f"\nDataset saved to: {output_dir}")
    print(f"Total pairs: {len(pairs)}")
    print(f"  - Train: {len(train_pairs)} pairs")
    print(f"  - Val: {len(val_pairs)} pairs")
    print(f"  - Test: {len(test_pairs)} pairs")
    print(f"\nNext steps:")
    print(f"  1. Generate segmentation masks (optional)")
    print(f"  2. Train the model: python pix2pix/train_pix2pix.py")
    print(f"  3. Test inference: python pix2pix/inference_pix2pix.py")
    print()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Prepare veneer dataset for pix2pix training')
    parser.add_argument('--source', type=str,
                       default='../../../data/annotate_batch1',
                       help='Source directory with before/after images')
    parser.add_argument('--output', type=str,
                       default='../../../data/veneer_dataset',
                       help='Output directory for prepared dataset')
    parser.add_argument('--size', type=int, default=256,
                       help='Image size (images will be resized to size x size)')
    parser.add_argument('--train-ratio', type=float, default=0.7,
                       help='Proportion of data for training (default: 0.7)')
    parser.add_argument('--val-ratio', type=float, default=0.15,
                       help='Proportion of data for validation (default: 0.15)')

    args = parser.parse_args()

    # Adjust paths to be absolute
    script_dir = Path(__file__).parent
    source_dir = Path(args.source)
    if not source_dir.is_absolute():
        source_dir = script_dir / source_dir

    output_dir = Path(args.output)
    if not output_dir.is_absolute():
        output_dir = script_dir / output_dir

    prepare_dataset(
        source_dir=str(source_dir),
        output_dir=str(output_dir),
        train_ratio=args.train_ratio,
        val_ratio=args.val_ratio,
        target_size=(args.size, args.size)
    )
        
