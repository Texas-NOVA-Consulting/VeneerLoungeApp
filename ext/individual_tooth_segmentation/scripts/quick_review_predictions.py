import argparse
import json
from pathlib import Path
from typing import List, Dict
import imageio.v2 as imageio
import matplotlib.pyplot as plt
import numpy as np


def create_side_by_side(image_path: Path, pred_path: Path) -> np.ndarray:
    """Create side-by-side comparison image."""
    image = imageio.imread(image_path)
    if image.ndim == 3 and image.shape[2] == 4:
        image = image[..., :3]
    
    pred = imageio.imread(pred_path)
    if pred.ndim == 3:
        pred = pred[..., 0]
    
    # Create overlay
    overlay = image.copy()
    mask = pred > 0
    overlay[mask] = overlay[mask] * 0.5 + np.array([255, 0, 0]) * 0.5
    
    # Combine side by side
    h, w = image.shape[:2]
    combined = np.zeros((h, w * 2, 3), dtype=np.uint8)
    combined[:, :w] = image
    combined[:, w:] = overlay.astype(np.uint8)
    
    return combined


def quick_review(predictions_dir: Path, images_dir: Path, output_json: Path):
    """Quick review interface."""
    pred_files = sorted(predictions_dir.glob("*.png"))
    
    if not pred_files:
        print(f"No predictions found in {predictions_dir}")
        return
    
    approved = []
    rejected = []
    
    print(f"\n{'='*60}")
    print(f"Quick Review Mode - {len(pred_files)} predictions")
    print(f"{'='*60}")
    print("Commands:")
    print("  'y' or Enter - Approve (correct prediction)")
    print("  'n' - Reject (incorrect, needs correction)")
    print("  's' - Skip (review later)")
    print("  'q' - Quit and save")
    print(f"{'='*60}\n")
    
    for i, pred_path in enumerate(pred_files):
        img_id = pred_path.stem
        
        # Find corresponding image
        image_files = list(images_dir.glob(f"{img_id}.*"))
        if not image_files:
            image_files = list(images_dir.glob(f"{int(img_id)}.*"))
        
        if not image_files:
            print(f"[{i+1}/{len(pred_files)}] {img_id}: Image not found, skipping")
            continue
        
        image_path = image_files[0]
        
        # Create visualization
        try:
            combined = create_side_by_side(image_path, pred_path)
            
            # Show image
            plt.figure(figsize=(12, 6))
            plt.imshow(combined)
            plt.title(f"Image {img_id} - Prediction Overlay")
            plt.axis('off')
            plt.tight_layout()
            
            # Save temp image for viewing
            temp_path = predictions_dir / f"{img_id}_temp_review.png"
            plt.savefig(temp_path, dpi=100, bbox_inches='tight')
            plt.close()
            
            print(f"\n[{i+1}/{len(pred_files)}] Image: {img_id}")
            print(f"Review image saved to: {temp_path}")
            print("Open it to see the prediction overlay.")
            
        except Exception as e:
            print(f"[{i+1}/{len(pred_files)}] {img_id}: Error creating visualization: {e}")
            continue
        
        while True:
            response = input("Approve (y), Reject (n), Skip (s), Quit (q): ").strip().lower()
            
            if response in ['y', 'yes', '']:
                approved.append({
                    'image_id': img_id,
                    'prediction_path': str(pred_path),
                    'image_path': str(image_path)
                })
                print(f"✓ Approved")
                break
            elif response in ['n', 'no']:
                rejected.append({
                    'image_id': img_id,
                    'prediction_path': str(pred_path),
                    'image_path': str(image_path),
                    'reason': 'needs_correction'
                })
                print(f"✗ Rejected")
                break
            elif response in ['s', 'skip']:
                print(f"→ Skipped")
                break
            elif response in ['q', 'quit']:
                print(f"\nSaving progress...")
                break
            else:
                print("Invalid input. Please enter y, n, s, or q.")
        
        if response in ['q', 'quit']:
            break
    
    # Save results
    results = {
        'approved': approved,
        'rejected': rejected,
        'total_reviewed': len(approved) + len(rejected),
        'total_predictions': len(pred_files)
    }
    
    output_json.parent.mkdir(parents=True, exist_ok=True)
    with output_json.open('w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n{'='*60}")
    print(f"Review Complete")
    print(f"{'='*60}")
    print(f"Approved: {len(approved)}")
    print(f"Rejected: {len(rejected)}")
    print(f"Results saved to: {output_json}")
    print(f"\nNext: Use approved predictions as ground truth for evaluation!")


def main():
    parser = argparse.ArgumentParser(
        description="Quick review of predictions to create ground truth"
    )
    parser.add_argument(
        "--predictions-dir",
        type=Path,
        required=True,
        help="Directory with prediction PNG files",
    )
    parser.add_argument(
        "--images-dir",
        type=Path,
        required=True,
        help="Directory with original images",
    )
    parser.add_argument(
        "--output-json",
        type=Path,
        default=Path("dataset/approved_predictions.json"),
        help="Output JSON file with approved/rejected list",
    )
    
    args = parser.parse_args()
    quick_review(args.predictions_dir, args.images_dir, args.output_json)


if __name__ == "__main__":
    main()

