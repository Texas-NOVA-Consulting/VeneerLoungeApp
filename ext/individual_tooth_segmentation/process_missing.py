#!/usr/bin/env python3
"""
Script to process images that did not successfully generate a .pth file.
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path
from os.path import join, splitext

def find_missing_images():
    """Find images that don't have corresponding .pth files."""
    # Get all image numbers from processed directory
    processed_dir = Path('dataset/kaggle_batch1_processed')
    image_files = (list(processed_dir.glob('*.jpg')) + 
                   list(processed_dir.glob('*.png')) + 
                   list(processed_dir.glob('*.jpeg')) + 
                   list(processed_dir.glob('*.jfif')))
    
    image_numbers = set()
    image_paths = {}
    for img_file in image_files:
        try:
            num = int(img_file.stem)
            image_numbers.add(num)
            image_paths[num] = img_file
        except ValueError:
            continue

    # Get all .pth files (check all dates)
    output_dir = Path('outputs/kaggle_batch1')
    pth_files = list(output_dir.rglob('*.pth'))
    processed_numbers = set()
    for pth_file in pth_files:
        try:
            num = int(pth_file.stem)
            processed_numbers.add(num)
        except ValueError:
            continue

    # Find missing
    missing = sorted(image_numbers - processed_numbers)
    missing_paths = {num: image_paths[num] for num in missing}
    
    print(f'Total images in processed: {len(image_numbers)}')
    print(f'Images with .pth files: {len(processed_numbers)}')
    print(f'Missing .pth files: {len(missing)}')
    
    return missing, missing_paths

def copy_images_to_active(missing_paths):
    """Copy missing images to the active dataset directory."""
    active_dir = Path('dataset/kaggle_batch1')
    active_dir.mkdir(parents=True, exist_ok=True)
    
    copied = 0
    for num, src_path in missing_paths.items():
        # Keep the original filename format (e.g., 00000.jpg)
        dst_path = active_dir / src_path.name
        if not dst_path.exists():
            shutil.copy2(src_path, dst_path)
            copied += 1
            if copied % 50 == 0:
                print(f'Copied {copied} images...')
    
    print(f'Copied {copied} images to {active_dir}')
    return copied

def get_processed_numbers():
    """Get set of all processed image numbers."""
    output_dir = Path('outputs/kaggle_batch1')
    pth_files = list(output_dir.rglob('*.pth'))
    processed_numbers = set()
    for pth_file in pth_files:
        try:
            num = int(pth_file.stem)
            processed_numbers.add(num)
        except ValueError:
            continue
    return processed_numbers

def process_images(missing_numbers, missing_paths, batch_size=20):
    """Process missing images using main.py in batches."""
    config_file = 'config/kaggle_batch1.yaml'
    active_dir = Path('dataset/kaggle_batch1')
    active_dir.mkdir(parents=True, exist_ok=True)
    
    # Use venv Python if available, otherwise use sys.executable
    venv_python = Path(__file__).parent.parent.parent / 'venv' / 'bin' / 'python'
    if venv_python.exists():
        python_cmd = str(venv_python)
    else:
        python_cmd = sys.executable
    
    total_missing = len(missing_numbers)
    print(f'Processing {total_missing} images in batches of {batch_size}...')
    print(f'Using Python: {python_cmd}\n')
    
    # Split into batches
    batches = [missing_numbers[i:i+batch_size] for i in range(0, len(missing_numbers), batch_size)]
    total_batches = len(batches)
    
    all_processed = []
    all_failed = []
    
    for batch_idx, batch_numbers in enumerate(batches, 1):
        print(f'\n{"="*60}')
        print(f'Batch {batch_idx}/{total_batches} - Processing images: {batch_numbers[:5]}{"..." if len(batch_numbers) > 5 else ""}')
        print(f'{"="*60}')
        
        # Copy only this batch to active directory
        batch_copied = 0
        for num in batch_numbers:
            if num in missing_paths:
                src_path = missing_paths[num]
                dst_path = active_dir / src_path.name
                if not dst_path.exists():
                    shutil.copy2(src_path, dst_path)
                    batch_copied += 1
        
        if batch_copied > 0:
            print(f'Copied {batch_copied} new images to active directory')
        
        # Process this batch
        try:
            result = subprocess.run(
                [python_cmd, 'main.py', '--ALL', '--cfg', config_file],
                cwd=Path.cwd(),
                text=True,
                capture_output=False
            )
            
            # Check progress after this batch
            processed_numbers = get_processed_numbers()
            batch_processed = [num for num in batch_numbers if num in processed_numbers]
            batch_failed = [num for num in batch_numbers if num not in processed_numbers]
            
            all_processed.extend(batch_processed)
            all_failed.extend(batch_failed)
            
            # Show progress
            total_processed_so_far = len(all_processed)
            progress_pct = (total_processed_so_far / total_missing * 100) if total_missing > 0 else 0
            
            print(f'\nBatch {batch_idx} Results:')
            print(f'  - Successfully processed: {len(batch_processed)}/{len(batch_numbers)}')
            print(f'  - Failed: {len(batch_failed)}')
            print(f'\nOverall Progress: {total_processed_so_far}/{total_missing} ({progress_pct:.1f}%)')
            print(f'  - Total processed: {total_processed_so_far}')
            print(f'  - Total failed: {len(all_failed)}')
            print(f'  - Remaining: {total_missing - total_processed_so_far - len(all_failed)}')
            
            if result.returncode != 0:
                print(f'  ⚠️  Warning: Process exited with code {result.returncode}')
            
        except KeyboardInterrupt:
            print('\n\nProcessing interrupted by user')
            print(f'Processed {len(all_processed)} images before interruption')
            return len(all_processed), sorted(set(missing_numbers) - set(all_processed))
        except Exception as e:
            print(f'\n  ❌ Error in batch {batch_idx}: {e}')
            all_failed.extend(batch_numbers)
            continue
        
        # Clean up processed images from active directory to save space
        for num in batch_processed:
            if num in missing_paths:
                dst_path = active_dir / missing_paths[num].name
                if dst_path.exists():
                    dst_path.unlink()
    
    return len(all_processed), sorted(all_failed)

if __name__ == '__main__':
    print('=== Finding Missing Images ===')
    missing_numbers, missing_paths = find_missing_images()
    
    if not missing_numbers:
        print('No missing images found!')
        sys.exit(0)
    
    # Process in batches (no need to copy all at once)
    print(f'\n=== Processing Missing Images in Batches ===')
    processed, failed = process_images(missing_numbers, missing_paths, batch_size=20)
    
    print(f'\n{"="*60}')
    print('=== Final Summary ===')
    print(f'{"="*60}')
    print(f'Total processed successfully: {processed}/{len(missing_numbers)}')
    print(f'Failed to process: {len(failed)}')
    
    if failed:
        print(f'\n⚠️  Warning: {len(failed)} images failed to process.')
        if len(failed) <= 20:
            print(f'Failed image numbers: {failed}')
        else:
            print(f'Failed image numbers (first 20): {failed[:20]}...')
        sys.exit(1)
    else:
        print('\n✅ All images processed successfully!')

