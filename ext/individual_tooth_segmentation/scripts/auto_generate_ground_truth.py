from __future__ import annotations

import argparse
import json
import pickle
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from datetime import datetime

import numpy as np
import imageio.v2 as imageio
import cv2
from matplotlib import pyplot as plt


def extract_mask_from_pth(pth_path: Path) -> Optional[np.ndarray]:
    """Extract segmentation mask from .pth file."""
    try:
        with pth_path.open("rb") as fh:
            payload = pickle.load(fh)
        
        # Priority 1: Final labeled regions (best quality)
        if "lbl_reg" in payload:
            mask = np.asarray(payload["lbl_reg"], dtype=np.uint16)
            if mask.max() > 255:
                mask_normalized = (mask > 0).astype(np.uint8) * 255
            else:
                mask_normalized = (mask > 0).astype(np.uint8) * 255
            return mask_normalized
        if "phi_res" in payload:
            phi = np.asarray(payload["phi_res"])
            if phi.size == 0:
                return None
            mask = (phi <= 0).astype(np.uint8)
            return mask * 255
        if "per" in payload:
            per = np.asarray(payload["per"])
            mask = (per > 0.5).astype(np.uint8) * 255
            return mask
        
        # Priority 4: Pseudo edge region (per0) - least preferred
        if "per0" in payload:
            per0 = np.asarray(payload["per0"])
            mask = (per0 > 0.5).astype(np.uint8) * 255
            return mask
        
        return None
    except Exception as e:
        print(f"Error loading {pth_path}: {e}")
        return None


def find_all_predictions(outputs_dir: Path) -> Dict[str, Path]:
    """Find all .pth files and map image numbers to paths."""
    predictions = {}
    
    # Search recursively for .pth files
    for pth_file in outputs_dir.rglob("*.pth"):
        try:
            stem = pth_file.stem
            img_num = int(stem)
            if img_num not in predictions:
                predictions[img_num] = pth_file
        except ValueError:
            continue
    
    return predictions


def create_review_visualization(image: np.ndarray, prediction: np.ndarray, 
                                save_path: Path, image_id: str):
    """Create a side-by-side visualization for review."""
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    
    # Original image
    axes[0].imshow(image)
    axes[0].set_title(f'Original Image {image_id}')
    axes[0].axis('off')
    
    # Prediction overlay
    axes[1].imshow(image)
    if prediction.max() > 0:
        # Create colored overlay
        overlay = np.zeros_like(image)
        overlay[prediction > 0] = [255, 0, 0]  # Red overlay
        axes[1].imshow(overlay, alpha=0.5)
    axes[1].set_title('Prediction Overlay')
    axes[1].axis('off')
    
    # Prediction mask
    axes[2].imshow(prediction, cmap='gray')
    axes[2].set_title('Prediction Mask')
    axes[2].axis('off')
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=150, bbox_inches='tight')
    plt.close()


def batch_extract_predictions(outputs_dir: Path, images_dir: Path, 
                              gt_dir: Path, review_dir: Path):
    """Extract all predictions and create review visualizations."""
    gt_dir.mkdir(parents=True, exist_ok=True)
    review_dir.mkdir(parents=True, exist_ok=True)
    
    predictions = find_all_predictions(outputs_dir)
    print(f"Found {len(predictions)} predictions")
    
    metadata = {
        'created': datetime.now().isoformat(),
        'total_predictions': len(predictions),
        'approved': [],
        'rejected': [],
        'pending': []
    }
    
    extracted = 0
    skipped = 0
    
    for img_num, pth_path in sorted(predictions.items()):
        img_id_6d = f"{img_num:06d}"
        img_id_5d = f"{img_num:05d}"  
        img_id_raw = str(img_num)  
        
        image_files = list(images_dir.glob(f"{img_id_6d}.*"))
        if not image_files:
            image_files = list(images_dir.glob(f"{img_id_5d}.*"))
        if not image_files:
            image_files = list(images_dir.glob(f"{img_id_raw}.*"))
        if not image_files:
            # Try with leading zeros but fewer digits
            for digits in [4, 3, 2]:
                pattern = f"{img_num:0{digits}d}.*"
                image_files = list(images_dir.glob(pattern))
                if image_files:
                    break
        
        if not image_files:
            print(f"[skip] No image found for image number {img_num} (tried {img_id_6d}, {img_id_5d}, {img_id_raw})")
            skipped += 1
            continue
        
        # Use the 6-digit format for consistency in output
        img_id = img_id_6d
        
        image_path = image_files[0]
        
        # Extract prediction
        prediction = extract_mask_from_pth(pth_path)
        if prediction is None:
            print(f"[skip] No mask in {pth_path}")
            skipped += 1
            continue
        
        # Load original image
        try:
            image = imageio.imread(image_path)
            if image.ndim == 3 and image.shape[2] == 4:
                image = image[..., :3]  # Remove alpha channel
        except Exception as e:
            print(f"[skip] Error loading image {image_path}: {e}")
            skipped += 1
            continue
        
        # Save prediction as potential ground truth
        gt_path = gt_dir / f"{img_id}.png"
        imageio.imwrite(gt_path, prediction)
        
        # Create review visualization
        review_path = review_dir / f"{img_id}_review.png"
        create_review_visualization(image, prediction, review_path, img_id)
        
        # Add to pending review
        metadata['pending'].append({
            'image_id': img_id,
            'image_path': str(image_path),
            'gt_path': str(gt_path),
            'review_path': str(review_path),
            'prediction_path': str(pth_path)
        })
        
        extracted += 1
        if extracted % 10 == 0:
            print(f"Extracted {extracted} predictions...")
    
    # Save metadata
    metadata_path = gt_dir.parent / 'gt_metadata.json'
    with metadata_path.open('w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\nExtraction complete:")
    print(f"  - Extracted: {extracted}")
    print(f"  - Skipped: {skipped}")
    print(f"  - Review visualizations: {review_dir}")
    print(f"  - Ground truth (pending review): {gt_dir}")
    print(f"  - Metadata: {metadata_path}")
    
    return metadata


def interactive_review(metadata_path: Path, review_dir: Path, gt_dir: Path):
    """Interactive review of predictions."""
    with metadata_path.open('r') as f:
        metadata = json.load(f)
    
    pending = metadata['pending']
    if not pending:
        print("No predictions pending review!")
        return
    
    print(f"\n{'='*60}")
    print(f"Interactive Review Mode")
    print(f"{'='*60}")
    print(f"Total pending: {len(pending)}")
    print(f"\nCommands:")
    print(f"  'y' or Enter - Approve (use as ground truth)")
    print(f"  'n' - Reject (needs correction)")
    print(f"  's' - Skip (review later)")
    print(f"  'q' - Quit and save progress")
    print(f"{'='*60}\n")
    
    approved = []
    rejected = []
    remaining = []
    
    for i, item in enumerate(pending):
        review_path = Path(item['review_path'])
        if not review_path.exists():
            print(f"[skip] Review image not found: {review_path}")
            remaining.append(item)
            continue
        
        print(f"\n[{i+1}/{len(pending)}] Image: {item['image_id']}")
        print(f"Review image: {review_path}")
        print(f"Open the review image to see the prediction.")
        
        while True:
            response = input("Approve (y), Reject (n), Skip (s), Quit (q): ").strip().lower()
            
            if response in ['y', 'yes', '']:
                approved.append(item)
                print(f"✓ Approved {item['image_id']}")
                break
            elif response in ['n', 'no']:
                rejected.append(item)
                print(f"✗ Rejected {item['image_id']}")
                break
            elif response in ['s', 'skip']:
                remaining.append(item)
                print(f"→ Skipped {item['image_id']}")
                break
            elif response in ['q', 'quit']:
                # Add remaining items back
                remaining.extend(pending[i+1:])
                print(f"\nSaving progress...")
                break
            else:
                print("Invalid input. Please enter y, n, s, or q.")
        
        if response in ['q', 'quit']:
            break
    
    # Update metadata
    metadata['approved'].extend(approved)
    metadata['rejected'].extend(rejected)
    metadata['pending'] = remaining
    metadata['last_review'] = datetime.now().isoformat()
    
    # Save updated metadata
    with metadata_path.open('w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\nReview session complete:")
    print(f"  - Approved: {len(approved)}")
    print(f"  - Rejected: {len(rejected)}")
    print(f"  - Remaining: {len(remaining)}")
    print(f"\nNext steps:")
    print(f"  - Approved predictions are in: {gt_dir}")
    print(f"  - Rejected predictions need manual correction")
    print(f"  - Run this script again to continue review")


def create_quality_report(metadata_path: Path, gt_dir: Path):
    """Create a report of prediction quality."""
    with metadata_path.open('r') as f:
        metadata = json.load(f)
    
    total = metadata['total_predictions']
    approved = len(metadata.get('approved', []))
    rejected = len(metadata.get('rejected', []))
    pending = len(metadata.get('pending', []))
    
    approval_rate = (approved / total * 100) if total > 0 else 0
    
    report = f"""
# Ground Truth Generation Report

## Summary
- Total Predictions: {total}
- Approved (Use as GT): {approved} ({approval_rate:.1f}%)
- Rejected (Need Correction): {rejected}
- Pending Review: {pending}

## Status
- Created: {metadata.get('created', 'unknown')}
- Last Review: {metadata.get('last_review', 'never')}

## Next Steps
1. Review pending predictions using interactive mode
2. For rejected predictions, manually correct them
3. Use approved predictions as ground truth for evaluation
"""
    
    report_path = gt_dir.parent / 'gt_generation_report.md'
    report_path.write_text(report)
    print(f"\nQuality report saved to: {report_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Auto-generate ground truth from model predictions"
    )
    parser.add_argument(
        "--outputs-dir",
        type=Path,
        required=True,
        help="Directory with .pth prediction files (e.g. outputs/kaggle_batch1/25-11-17)",
    )
    parser.add_argument(
        "--images-dir",
        type=Path,
        required=True,
        help="Directory with original images",
    )
    parser.add_argument(
        "--gt-dir",
        type=Path,
        default=Path("dataset/ground_truth/auto_generated"),
        help="Directory to save ground truth masks",
    )
    parser.add_argument(
        "--review-dir",
        type=Path,
        default=Path("dataset/ground_truth/review_images"),
        help="Directory to save review visualizations",
    )
    parser.add_argument(
        "--review-mode",
        choices=["interactive", "batch", "none"],
        default="interactive",
        help="Review mode: interactive (review now), batch (review later), none (skip review)",
    )
    parser.add_argument(
        "--continue-review",
        action="store_true",
        help="Continue previous review session",
    )
    
    args = parser.parse_args()
    
    # Step 1: Extract all predictions
    print("Step 1: Extracting predictions...")
    metadata_path = args.gt_dir.parent / 'gt_metadata.json'
    
    if args.continue_review and metadata_path.exists():
        print("Continuing previous review session...")
        with metadata_path.open('r') as f:
            metadata = json.load(f)
    else:
        metadata = batch_extract_predictions(
            args.outputs_dir,
            args.images_dir,
            args.gt_dir,
            args.review_dir
        )
    
    # Step 2: Review (if requested)
    if args.review_mode == "interactive":
        print("\nStep 2: Starting interactive review...")
        interactive_review(metadata_path, args.review_dir, args.gt_dir)
    elif args.review_mode == "batch":
        print("\nStep 2: Batch mode - review visualizations saved to:")
        print(f"  {args.review_dir}")
        print("\nReview the images and update gt_metadata.json manually,")
        print("or run with --review-mode interactive to review now.")
    
    # Step 3: Generate report
    print("\nStep 3: Generating quality report...")
    create_quality_report(metadata_path, args.gt_dir)
    
    print("\n✓ Ground truth generation complete!")
    print(f"\nApproved ground truth masks: {args.gt_dir}")
    print(f"Use these for evaluation and model refinement.")


if __name__ == "__main__":
    main()

