#!/usr/bin/env python3
"""Quick script to check processing progress."""

from pathlib import Path

# Get all image numbers from processed directory
processed_dir = Path('dataset/kaggle_batch1_processed')
image_files = (list(processed_dir.glob('*.jpg')) + 
               list(processed_dir.glob('*.png')) + 
               list(processed_dir.glob('*.jpeg')) + 
               list(processed_dir.glob('*.jfif')))

image_numbers = set()
for img_file in image_files:
    try:
        num = int(img_file.stem)
        image_numbers.add(num)
    except ValueError:
        continue

# Get all .pth files
output_dir = Path('outputs/kaggle_batch1')
pth_files = list(output_dir.rglob('*.pth'))
processed_numbers = set()
for pth_file in pth_files:
    try:
        num = int(pth_file.stem)
        processed_numbers.add(num)
    except ValueError:
        continue

# Calculate progress
total = len(image_numbers)
processed = len(processed_numbers)
missing = total - processed
progress_pct = (processed / total * 100) if total > 0 else 0

print(f'Progress: {processed}/{total} images processed ({progress_pct:.1f}%)')
print(f'Remaining: {missing} images')
print(f'Total .pth files: {len(pth_files)}')

