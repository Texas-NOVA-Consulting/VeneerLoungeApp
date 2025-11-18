# Stage 1: Comprehensive Evaluation - Implementation Guide

## Overview
Build a comprehensive evaluation system that computes multiple metrics for your segmentation predictions.

## File Structure to Create

```
ext/individual_tooth_segmentation/
├── src/
│   ├── metrics/
│   │   ├── __init__.py
│   │   ├── segmentation_metrics.py    # Core metric functions
│   │   └── boundary_metrics.py        # Boundary-specific metrics
│   └── evaluation/
│       ├── __init__.py
│       ├── evaluator.py               # Main evaluation class
│       └── visualizer.py              # Visualization helpers
├── scripts/
│   └── comprehensive_evaluation.py    # Main script to run
└── config/
    └── evaluation_config.yaml         # Evaluation settings
```

## Step-by-Step Implementation

### Step 1: Create Metrics Module

**File: `src/metrics/__init__.py`**
```python
from .segmentation_metrics import (
    compute_iou,
    compute_dice,
    compute_pixel_accuracy,
    compute_precision_recall_f1,
    compute_per_tooth_metrics
)
from .boundary_metrics import (
    compute_hausdorff_distance,
    extract_boundary
)

__all__ = [
    'compute_iou',
    'compute_dice',
    'compute_pixel_accuracy',
    'compute_precision_recall_f1',
    'compute_per_tooth_metrics',
    'compute_hausdorff_distance',
    'extract_boundary'
]
```

**File: `src/metrics/segmentation_metrics.py`**
```python
"""
Core segmentation metrics for evaluating tooth segmentation.
"""
import numpy as np
from typing import Tuple, Dict, List


def compute_iou(pred: np.ndarray, gt: np.ndarray) -> float:
    """
    Compute Intersection over Union (IoU).
    
    Args:
        pred: Binary prediction mask (0 or 1)
        gt: Binary ground truth mask (0 or 1)
    
    Returns:
        IoU score (0.0 to 1.0)
    """
    pred = pred.astype(bool)
    gt = gt.astype(bool)
    
    intersection = np.logical_and(pred, gt).sum()
    union = np.logical_or(pred, gt).sum()
    
    if union == 0:
        return 1.0 if intersection == 0 else 0.0
    
    return float(intersection / union)


def compute_dice(pred: np.ndarray, gt: np.ndarray) -> float:
    """
    Compute Dice Coefficient (F1 score for segmentation).
    
    Args:
        pred: Binary prediction mask
        gt: Binary ground truth mask
    
    Returns:
        Dice score (0.0 to 1.0)
    """
    pred = pred.astype(bool)
    gt = gt.astype(bool)
    
    intersection = np.logical_and(pred, gt).sum()
    
    if pred.sum() + gt.sum() == 0:
        return 1.0
    
    return float(2.0 * intersection / (pred.sum() + gt.sum()))


def compute_pixel_accuracy(pred: np.ndarray, gt: np.ndarray) -> float:
    """
    Compute pixel-wise accuracy.
    
    Args:
        pred: Binary prediction mask
        gt: Binary ground truth mask
    
    Returns:
        Pixel accuracy (0.0 to 1.0)
    """
    return float((pred == gt).sum() / pred.size)


def compute_precision_recall_f1(pred: np.ndarray, gt: np.ndarray) -> Tuple[float, float, float]:
    """
    Compute precision, recall, and F1 score.
    
    Args:
        pred: Binary prediction mask
        gt: Binary ground truth mask
    
    Returns:
        Tuple of (precision, recall, f1)
    """
    pred = pred.astype(bool)
    gt = gt.astype(bool)
    
    tp = np.logical_and(pred, gt).sum()
    fp = np.logical_and(pred, np.logical_not(gt)).sum()
    fn = np.logical_and(np.logical_not(pred), gt).sum()
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 1.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 1.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0
    
    return float(precision), float(recall), float(f1)


def compute_per_tooth_metrics(pred: np.ndarray, gt: np.ndarray) -> Dict:
    """
    Compute metrics for each individual tooth.
    
    Args:
        pred: Multi-class prediction mask (0=background, 1,2,3...=teeth)
        gt: Multi-class ground truth mask
    
    Returns:
        Dictionary with per-tooth metrics
    """
    pred_labels = np.unique(pred[pred > 0])
    gt_labels = np.unique(gt[gt > 0])
    
    metrics = {
        'detected_teeth': len(pred_labels),
        'actual_teeth': len(gt_labels),
        'tooth_iou': {},
        'tooth_dice': {},
        'tooth_precision': {},
        'tooth_recall': {}
    }
    
    # Compute metrics for each tooth label
    for label in set(pred_labels) | set(gt_labels):
        pred_mask = (pred == label)
        gt_mask = (gt == label)
        
        metrics['tooth_iou'][int(label)] = compute_iou(pred_mask, gt_mask)
        metrics['tooth_dice'][int(label)] = compute_dice(pred_mask, gt_mask)
        prec, rec, _ = compute_precision_recall_f1(pred_mask, gt_mask)
        metrics['tooth_precision'][int(label)] = prec
        metrics['tooth_recall'][int(label)] = rec
    
    return metrics
```

**File: `src/metrics/boundary_metrics.py`**
```python
"""
Boundary-specific metrics for segmentation evaluation.
"""
import numpy as np
from scipy.ndimage import binary_erosion
from skimage.metrics import hausdorff_distance


def extract_boundary(mask: np.ndarray) -> np.ndarray:
    """
    Extract boundary pixels from a binary mask.
    
    Args:
        mask: Binary mask
    
    Returns:
        Binary mask with only boundary pixels
    """
    mask = mask.astype(bool)
    eroded = binary_erosion(mask)
    boundary = mask & (~eroded)
    return boundary.astype(np.uint8)


def compute_hausdorff_distance(pred: np.ndarray, gt: np.ndarray) -> float:
    """
    Compute Hausdorff distance between boundaries.
    
    Args:
        pred: Binary prediction mask
        gt: Binary ground truth mask
    
    Returns:
        Hausdorff distance (lower is better)
    """
    pred_boundary = extract_boundary(pred)
    gt_boundary = extract_boundary(gt)
    
    if pred_boundary.sum() == 0 or gt_boundary.sum() == 0:
        return float('inf')
    
    try:
        # Get coordinates of boundary points
        pred_coords = np.argwhere(pred_boundary > 0)
        gt_coords = np.argwhere(gt_boundary > 0)
        
        if len(pred_coords) == 0 or len(gt_coords) == 0:
            return float('inf')
        
        # Compute Hausdorff distance
        distance = hausdorff_distance(pred_coords, gt_coords)
        return float(distance)
    except Exception as e:
        print(f"Error computing Hausdorff distance: {e}")
        return float('inf')
```

### Step 2: Create Evaluation Class

**File: `src/evaluation/evaluator.py`**
```python
"""
Comprehensive evaluation class for segmentation results.
"""
from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict
import json
import pandas as pd
import numpy as np
import imageio.v2 as imageio

from ..metrics.segmentation_metrics import (
    compute_iou, compute_dice, compute_pixel_accuracy,
    compute_precision_recall_f1, compute_per_tooth_metrics
)
from ..metrics.boundary_metrics import compute_hausdorff_distance


@dataclass
class EvaluationResult:
    """Container for evaluation results for a single image."""
    image_id: str
    iou: float
    dice: float
    precision: float
    recall: float
    f1: float
    pixel_accuracy: float
    hausdorff_distance: float
    per_tooth_metrics: Optional[Dict] = None
    category: str = "unknown"
    
    def to_dict(self):
        """Convert to dictionary for JSON/CSV export."""
        result = asdict(self)
        if self.per_tooth_metrics:
            # Flatten per-tooth metrics for CSV
            result['detected_teeth'] = self.per_tooth_metrics.get('detected_teeth', 0)
            result['actual_teeth'] = self.per_tooth_metrics.get('actual_teeth', 0)
        return result


class ComprehensiveEvaluator:
    """Main evaluation class."""
    
    def __init__(
        self,
        pred_dir: Path,
        gt_dir: Path,
        metadata_path: Optional[Path] = None,
        multiclass: bool = False
    ):
        """
        Initialize evaluator.
        
        Args:
            pred_dir: Directory with prediction PNG masks
            gt_dir: Directory with ground truth PNG masks
            metadata_path: Optional path to metadata JSON file
            multiclass: Whether to compute per-tooth metrics
        """
        self.pred_dir = Path(pred_dir)
        self.gt_dir = Path(gt_dir)
        self.multiclass = multiclass
        self.metadata = self._load_metadata(metadata_path) if metadata_path else {}
    
    def _load_metadata(self, metadata_path: Path) -> Dict:
        """Load metadata JSON file."""
        if not metadata_path or not metadata_path.exists():
            return {}
        with metadata_path.open('r') as f:
            return json.load(f)
    
    def _load_mask(self, path: Path) -> np.ndarray:
        """Load mask from PNG file."""
        mask = imageio.imread(path)
        if mask.ndim == 3:
            mask = mask[..., 0]  # Take first channel if RGB
        return np.asarray(mask)
    
    def evaluate_single(
        self,
        pred_path: Path,
        gt_path: Path,
        image_id: Optional[str] = None
    ) -> EvaluationResult:
        """
        Evaluate a single image.
        
        Args:
            pred_path: Path to prediction mask
            gt_path: Path to ground truth mask
            image_id: Optional image ID (extracted from filename if not provided)
        
        Returns:
            EvaluationResult object
        """
        if image_id is None:
            image_id = pred_path.stem
        
        # Load masks
        pred = self._load_mask(pred_path)
        gt = self._load_mask(gt_path)
        
        # Ensure same shape
        if pred.shape != gt.shape:
            print(f"Warning: Shape mismatch for {image_id}: pred={pred.shape}, gt={gt.shape}")
            # Resize prediction to match ground truth
            from skimage.transform import resize
            pred = resize(pred, gt.shape, order=0, preserve_range=True).astype(gt.dtype)
        
        # Convert to binary for overall metrics
        pred_binary = (pred > 0).astype(np.uint8)
        gt_binary = (gt > 0).astype(np.uint8)
        
        # Compute metrics
        iou = compute_iou(pred_binary, gt_binary)
        dice = compute_dice(pred_binary, gt_binary)
        pixel_acc = compute_pixel_accuracy(pred_binary, gt_binary)
        precision, recall, f1 = compute_precision_recall_f1(pred_binary, gt_binary)
        hausdorff = compute_hausdorff_distance(pred_binary, gt_binary)
        
        # Per-tooth metrics (if multiclass)
        per_tooth = None
        if self.multiclass:
            per_tooth = compute_per_tooth_metrics(pred, gt)
        
        # Get category from metadata
        category = self.metadata.get(image_id, {}).get('category', 'unknown')
        
        return EvaluationResult(
            image_id=image_id,
            iou=iou,
            dice=dice,
            precision=precision,
            recall=recall,
            f1=f1,
            pixel_accuracy=pixel_acc,
            hausdorff_distance=hausdorff,
            per_tooth_metrics=per_tooth,
            category=category
        )
    
    def evaluate_all(self) -> List[EvaluationResult]:
        """
        Evaluate all images in the prediction directory.
        
        Returns:
            List of EvaluationResult objects
        """
        results = []
        pred_files = sorted(self.pred_dir.glob("*.png"))
        
        print(f"Evaluating {len(pred_files)} images...")
        
        for pred_path in pred_files:
            gt_path = self.gt_dir / pred_path.name
            
            if not gt_path.exists():
                print(f"Warning: No ground truth for {pred_path.name}, skipping")
                continue
            
            try:
                result = self.evaluate_single(pred_path, gt_path)
                results.append(result)
                
                # Print progress
                if len(results) % 10 == 0:
                    print(f"  Evaluated {len(results)}/{len(pred_files)} images...")
                    
            except Exception as e:
                print(f"Error evaluating {pred_path.name}: {e}")
                continue
        
        return results
    
    def generate_summary(self, results: List[EvaluationResult]) -> Dict:
        """Generate summary statistics."""
        if not results:
            return {}
        
        df = pd.DataFrame([r.to_dict() for r in results])
        
        summary = {
            'total_images': len(results),
            'mean_iou': float(df['iou'].mean()),
            'std_iou': float(df['iou'].std()),
            'mean_dice': float(df['dice'].mean()),
            'std_dice': float(df['dice'].std()),
            'mean_f1': float(df['f1'].mean()),
            'std_f1': float(df['f1'].std()),
            'mean_precision': float(df['precision'].mean()),
            'std_precision': float(df['precision'].std()),
            'mean_recall': float(df['recall'].mean()),
            'std_recall': float(df['recall'].std()),
            'mean_pixel_accuracy': float(df['pixel_accuracy'].mean()),
            'mean_hausdorff': float(df[df['hausdorff_distance'] != float('inf')]['hausdorff_distance'].mean()) if (df['hausdorff_distance'] != float('inf')).any() else None
        }
        
        return summary
    
    def save_results(
        self,
        results: List[EvaluationResult],
        output_dir: Path,
        save_csv: bool = True,
        save_json: bool = True
    ):
        """Save evaluation results to files."""
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Save CSV
        if save_csv:
            df = pd.DataFrame([r.to_dict() for r in results])
            csv_path = output_dir / 'evaluation_results.csv'
            df.to_csv(csv_path, index=False)
            print(f"Saved CSV results to: {csv_path}")
        
        # Save JSON
        if save_json:
            json_path = output_dir / 'evaluation_results.json'
            results_dict = {
                'summary': self.generate_summary(results),
                'results': [r.to_dict() for r in results]
            }
            with json_path.open('w') as f:
                json.dump(results_dict, f, indent=2)
            print(f"Saved JSON results to: {json_path}")
```

### Step 3: Create Main Evaluation Script

**File: `scripts/comprehensive_evaluation.py`**
```python
#!/usr/bin/env python3
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
```

### Step 4: Create Directory Structure

Run these commands to create the directories:

```bash
cd ext/individual_tooth_segmentation
mkdir -p src/metrics src/evaluation results/evaluations
touch src/metrics/__init__.py src/evaluation/__init__.py
```

### Step 5: Install Required Dependencies

```bash
pip install scikit-image pandas
```

### Step 6: Run Your First Evaluation

```bash
# First, export your predictions to PNG format
python scripts/export_predictions.py \
    --outputs-dir outputs/kaggle_batch1/25-11-17 \
    --dest-dir predictions/kaggle_batch1

# Then run comprehensive evaluation
python scripts/comprehensive_evaluation.py \
    --pred-dir predictions/kaggle_batch1 \
    --gt-dir dataset/ground_truth/auto_generated \
    --output-dir results/evaluations
```

## What Each File Does

1. **`segmentation_metrics.py`**: Core metric functions (IoU, Dice, Precision, Recall, F1)
2. **`boundary_metrics.py`**: Boundary-specific metrics (Hausdorff distance)
3. **`evaluator.py`**: Main evaluation class that orchestrates everything
4. **`comprehensive_evaluation.py`**: Command-line script to run evaluations

## Next Steps After Implementation

1. Test with a few images first
2. Check the CSV/JSON output format
3. Add visualization functions (see Stage 1 guide)
4. Add category-wise breakdown
5. Add error analysis (Stage 2)

## Tips

- Start with binary masks first (multiclass=False)
- Test each metric function individually
- Use small test set first (5-10 images)
- Check for shape mismatches between pred and GT
- Handle edge cases (empty masks, all zeros, etc.)

Good luck! 🚀

