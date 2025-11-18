import argparse
from pathlib import Path
import subprocess
import sys


def main():
    parser = argparse.ArgumentParser(
        description="One-command setup of ground truth from predictions"
    )
    parser.add_argument(
        "--outputs-dir",
        type=Path,
        required=True,
        help="Directory with .pth prediction files",
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
        help="Ground truth output directory",
    )
    
    args = parser.parse_args()
    
    print("="*60)
    print("Setting up Ground Truth from Predictions")
    print("="*60)
    
    # Step 1: Extract predictions
    print("\n[1/3] Extracting predictions from .pth files...")
    extract_script = Path(__file__).parent / "auto_generate_ground_truth.py"
    
    cmd = [
        sys.executable,
        str(extract_script),
        "--outputs-dir", str(args.outputs_dir),
        "--images-dir", str(args.images_dir),
        "--gt-dir", str(args.gt_dir),
        "--review-mode", "batch"  # Don't review interactively yet
    ]
    
    result = subprocess.run(cmd)
    if result.returncode != 0:
        print("Error extracting predictions!")
        return
    
    print("\n[2/3] Predictions extracted!")
    print(f"  - Ground truth masks: {args.gt_dir}")
    print(f"  - Review images: {args.gt_dir.parent / 'review_images'}")
    
    # Step 2: Instructions
    print("\n[3/3] Setup complete!")
    print("\n" + "="*60)
    print("Next Steps:")
    print("="*60)
    print("\n1. Review the predictions:")
    print(f"   python scripts/auto_generate_ground_truth.py \\")
    print(f"       --outputs-dir {args.outputs_dir} \\")
    print(f"       --images-dir {args.images_dir} \\")
    print(f"       --gt-dir {args.gt_dir} \\")
    print(f"       --review-mode interactive \\")
    print(f"       --continue-review")
    print("\n2. Or use the quick review script:")
    print(f"   python scripts/quick_review_predictions.py \\")
    print(f"       --predictions-dir {args.gt_dir} \\")
    print(f"       --images-dir {args.images_dir}")
    print("\n3. Once approved, use the ground truth for evaluation:")
    print(f"   python scripts/evaluate_segmentation.py \\")
    print(f"       --pred-dir predictions/kaggle_batch1 \\")
    print(f"       --gt-dir {args.gt_dir} \\")
    print(f"       --multiclass")
    print("\n" + "="*60)


if __name__ == "__main__":
    main()

