"""
Comprehensive evaluation script for segmentation results.

Usage:
    python scripts/comprehensive_evaluation.py \
        --pred-dir predictions/kaggle_batch1 \
        --gt-dir dataset/ground_truth/auto_generated \
        --output-dir results/evaluations \
        --multiclass
"""
import argparse
from pathlib import Path
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.evaluation.evaluator import ComprehensiveEvaluator


def main():
    parser = argparse.ArgumentParser(
        description="Comprehensive evaluation of segmentation results"
    )
    parser.add_argument(
        "--pred-dir",
        type=Path,
        required=True,
        help="Directory with prediction PNG masks"
    )
    parser.add_argument(
        "--gt-dir",
        type=Path,
        required=True,
        help="Directory with ground truth PNG masks"
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("results/evaluations"),
        help="Directory to save evaluation results"
    )
    parser.add_argument(
        "--metadata",
        type=Path,
        help="Optional metadata JSON file"
    )
    parser.add_argument(
        "--multiclass",
        action="store_true",
        help="Compute per-tooth metrics (for multi-class masks)"
    )
    
    args = parser.parse_args()
    
    # Initialize evaluator
    evaluator = ComprehensiveEvaluator(
        pred_dir=args.pred_dir,
        gt_dir=args.gt_dir,
        metadata_path=args.metadata,
        multiclass=args.multiclass
    )
    
    # Run evaluation
    print("Starting comprehensive evaluation...")
    results = evaluator.evaluate_all()
    
    if not results:
        print("No results to evaluate!")
        return
    
    # Generate summary
    summary = evaluator.generate_summary(results)
    
    print("\n" + "="*60)
    print("Evaluation Summary")
    print("="*60)
    print(f"Total Images: {summary['total_images']}")
    print(f"Mean IoU: {summary['mean_iou']:.4f} ± {summary['std_iou']:.4f}")
    print(f"Mean Dice: {summary['mean_dice']:.4f} ± {summary['std_dice']:.4f}")
    print(f"Mean F1: {summary['mean_f1']:.4f} ± {summary['std_f1']:.4f}")
    print(f"Mean Precision: {summary['mean_precision']:.4f} ± {summary['std_precision']:.4f}")
    print(f"Mean Recall: {summary['mean_recall']:.4f} ± {summary['std_recall']:.4f}")
    print(f"Mean Pixel Accuracy: {summary['mean_pixel_accuracy']:.4f}")
    if summary['mean_hausdorff']:
        print(f"Mean Hausdorff Distance: {summary['mean_hausdorff']:.2f}")
    print("="*60)
    
    # Save results
    evaluator.save_results(results, args.output_dir)
    
    print("\n✓ Evaluation complete!")


if __name__ == "__main__":
    main()