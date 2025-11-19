from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict
import json
import pandas as pd
import numpy as np
import imageio.v2 as imageio

from ..metrics import (
    compute_iou,
    compute_dice,
    compute_pixel_accuracy,
    compute_precision_recall_f1,
    compute_per_tooth_metrics,
)
from ..metrics.boundary_metrics import compute_hausdorff_distance

@dataclass
class EvaluationResult:
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
        result = asdict(self)
        if self.per_tooth_metrics:
            result['detected_teeth'] = self.per_tooth_metrics.get('detected_teeth', 0)
            result['actual_teeth'] = self.per_tooth_metrics.get('actual_teeth', 0)
        return result

class ComprehensiveEvaluator:
    def __init__(
        self,
        pred_dir: Path,
        gt_dir: Path,
        metadata_path: Optional[Path] = None,
        multiclass: bool = False
    ):
        """
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
        if not metadata_path or not metadata_path.exists():
            return {}
        with metadata_path.open('r') as f:
            return json.load(f)
    
    def _load_mask(self, path: Path) -> np.ndarray:
        mask = imageio.imread(path)
        if mask.ndim == 3:
            mask = mask[..., 0]
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
        
        pred = self._load_mask(pred_path)
        gt = self._load_mask(gt_path)
        
        if pred.shape != gt.shape:
            print(f"Warning: Shape mismatch for {image_id}: pred={pred.shape}, gt={gt.shape}")
            from skimage.transform import resize
            pred = resize(pred, gt.shape, order=0, preserve_range=True).astype(gt.dtype)
        
        pred_binary = (pred > 0).astype(np.uint8)
        gt_binary = (gt > 0).astype(np.uint8)
        iou = compute_iou(pred_binary, gt_binary)
        dice = compute_dice(pred_binary, gt_binary)
        pixel_acc = compute_pixel_accuracy(pred_binary, gt_binary)
        precision, recall, f1 = compute_precision_recall_f1(pred_binary, gt_binary)
        hausdorff = compute_hausdorff_distance(pred_binary, gt_binary)
        
        per_tooth = None
        if self.multiclass:
            per_tooth = compute_per_tooth_metrics(pred, gt)
        
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