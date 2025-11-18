# Comprehensive Guide: Accuracy Testing & Model Refinement

## Table of Contents
1. [Current State Analysis](#current-state-analysis)
2. [Accuracy Testing Framework](#accuracy-testing-framework)
3. [Model Refinement Pipeline](#model-refinement-pipeline)
4. [Implementation Structure](#implementation-structure)
5. [Metrics & Evaluation](#metrics--evaluation)
6. [Data Collection Strategy](#data-collection-strategy)
7. [Training/Fine-tuning Approach](#trainingfine-tuning-approach)
8. [Code Examples](#code-examples)

---

## Current State Analysis

### What You Have
- **Model**: ResNeSt50_TC (ResNeSt-50 backbone with U-Net decoder)
- **Checkpoint**: `checkpoints/CP_teeth_seg.pth` (pretrained)
- **Pipeline**: 4-stage segmentation (PseudoER → InitContour → Snake → TEM)
- **Evaluation Script**: Basic IoU/F1 metrics (`scripts/evaluate_segmentation.py`)
- **Output Format**: `.pth` files with intermediate results, PNG masks

### What's Missing
1. **Ground Truth Dataset**: No systematic GT collection
2. **Comprehensive Metrics**: Limited to basic IoU/F1
3. **Error Analysis**: No failure case categorization
4. **Model Training Code**: Only inference, no training loop
5. **Validation Framework**: No train/val/test splits
6. **Hyperparameter Tuning**: No systematic optimization

---

## Accuracy Testing Framework

### 1. Test Dataset Structure

Create a structured test dataset:

```
dataset/
├── test_set/
│   ├── images/          # Test images
│   ├── ground_truth/    # Manually annotated masks
│   └── metadata.json    # Image metadata, difficulty ratings
├── validation_set/      # For hyperparameter tuning
└── train_set/          # For fine-tuning (if needed)
```

### 2. Ground Truth Collection Strategy

**✅ RECOMMENDED: Automated from Predictions**
I've created scripts that automatically extract predictions and let you review them:
- `scripts/auto_generate_ground_truth.py` - Full workflow
- `scripts/quick_review_predictions.py` - Simple review interface
- `scripts/setup_ground_truth_from_predictions.py` - One-command setup

**Quick Start:**
```bash
# Step 1: Extract all predictions automatically
python scripts/setup_ground_truth_from_predictions.py \
    --outputs-dir outputs/kaggle_batch1/25-11-17 \
    --images-dir dataset/kaggle_batch1_processed

# Step 2: Review predictions (interactive)
python scripts/auto_generate_ground_truth.py \
    --outputs-dir outputs/kaggle_batch1/25-11-17 \
    --images-dir dataset/kaggle_batch1_processed \
    --review-mode interactive \
    --continue-review
```

**How it works:**
1. Scripts automatically extract all predictions from `.pth` files
2. Creates review visualizations (image + prediction overlay)
3. You review and mark as "correct" or "needs correction"
4. Correct predictions become your ground truth automatically
5. No manual annotation needed - just review!

**Other Options:**
- **Option B: Expert Review** - Have dentist review predictions
- **Option C: Manual Correction** - Only correct the rejected predictions

### 3. Test Categories

Create test categories to understand failure modes:

```python
TEST_CATEGORIES = {
    'lighting': ['good', 'poor', 'shadow'],
    'angle': ['frontal', 'side', 'oblique'],
    'occlusion': ['none', 'partial', 'heavy'],
    'teeth_count': ['few', 'normal', 'many'],
    'image_quality': ['high', 'medium', 'low']
}
```

---

## Model Refinement Pipeline

### Stage 1: Comprehensive Evaluation

**File**: `scripts/comprehensive_evaluation.py`

**Features**:
- Per-image metrics (IoU, Precision, Recall, F1, Dice)
- Per-tooth metrics (individual tooth segmentation accuracy)
- Category-wise performance breakdown
- Failure case identification
- Visual comparison generation

**Metrics to Compute**:
```python
# Per-image metrics
- IoU (Intersection over Union)
- Dice Coefficient
- Precision, Recall, F1
- Boundary Accuracy (Hausdorff Distance)
- Pixel Accuracy

# Per-tooth metrics
- Tooth Detection Rate
- Tooth Segmentation Accuracy
- Tooth Count Accuracy
- Individual Tooth IoU

# Aggregate metrics
- Mean IoU (mIoU)
- Mean F1 (mF1)
- Weighted metrics (by difficulty)
```

### Stage 2: Error Analysis

**File**: `scripts/error_analysis.py`

**Analyze**:
1. **False Positives**: Where model predicts teeth but there are none
2. **False Negatives**: Where teeth exist but aren't detected
3. **Boundary Errors**: Teeth detected but boundaries incorrect
4. **Merge Errors**: Multiple teeth segmented as one
5. **Split Errors**: One tooth segmented as multiple

**Output**:
- Error heatmaps
- Category-wise error distribution
- Common failure patterns
- Recommendations for improvement

### Stage 3: Model Training/Fine-tuning

**File**: `scripts/train_model.py`

**Approach**:
1. **Transfer Learning**: Fine-tune pretrained ResNeSt50_TC
2. **Data Augmentation**: Rotation, scaling, brightness, contrast
3. **Loss Functions**: 
   - Binary Cross-Entropy (BCE)
   - Dice Loss
   - Focal Loss (for hard examples)
   - Combined Loss (BCE + Dice)
4. **Training Strategy**:
   - Freeze encoder, train decoder first
   - Then fine-tune entire network
   - Use learning rate scheduling

### Stage 4: Hyperparameter Optimization

**File**: `scripts/hyperparameter_tuning.py`

**Parameters to Tune**:
- Learning rate (1e-5 to 1e-3)
- Batch size (4, 8, 16)
- Loss function weights
- Augmentation parameters
- Optimizer (Adam, AdamW, SGD)
- Learning rate schedule

**Method**: Grid search or Bayesian optimization (Optuna)

---

## Implementation Structure

### Recommended File Structure

```
ext/individual_tooth_segmentation/
├── scripts/
│   ├── comprehensive_evaluation.py      # Full evaluation suite
│   ├── error_analysis.py                # Failure case analysis
│   ├── train_model.py                   # Training loop
│   ├── hyperparameter_tuning.py         # HP optimization
│   ├── visualize_results.py             # Visualization tools
│   └── collect_ground_truth.py          # GT collection helpers
├── src/
│   ├── metrics/
│   │   ├── __init__.py
│   │   ├── segmentation_metrics.py      # All metric functions
│   │   └── boundary_metrics.py          # Boundary-specific metrics
│   ├── training/
│   │   ├── __init__.py
│   │   ├── trainer.py                   # Training class
│   │   ├── losses.py                    # Loss functions
│   │   └── augmentations.py             # Data augmentation
│   └── evaluation/
│       ├── __init__.py
│       ├── evaluator.py                 # Evaluation class
│       └── visualizer.py                # Result visualization
├── config/
│   ├── training_config.yaml             # Training hyperparameters
│   └── evaluation_config.yaml           # Evaluation settings
└── results/
    ├── evaluations/                     # Evaluation reports
    ├── checkpoints/                     # Trained models
    └── visualizations/                  # Result images
```

---

## Metrics & Evaluation

### Core Metrics Implementation

```python
# src/metrics/segmentation_metrics.py

import numpy as np
from typing import Tuple, Dict
from skimage.metrics import hausdorff_distance

def compute_iou(pred: np.ndarray, gt: np.ndarray) -> float:
    """Intersection over Union"""
    intersection = np.logical_and(pred, gt).sum()
    union = np.logical_or(pred, gt).sum()
    return intersection / union if union > 0 else 0.0

def compute_dice(pred: np.ndarray, gt: np.ndarray) -> float:
    """Dice Coefficient"""
    intersection = np.logical_and(pred, gt).sum()
    return 2.0 * intersection / (pred.sum() + gt.sum()) if (pred.sum() + gt.sum()) > 0 else 0.0

def compute_hausdorff_distance(pred: np.ndarray, gt: np.ndarray) -> float:
    """Boundary accuracy using Hausdorff distance"""
    pred_boundary = extract_boundary(pred)
    gt_boundary = extract_boundary(gt)
    if pred_boundary.sum() == 0 or gt_boundary.sum() == 0:
        return float('inf')
    return hausdorff_distance(pred_boundary, gt_boundary)

def compute_pixel_accuracy(pred: np.ndarray, gt: np.ndarray) -> float:
    """Pixel-wise accuracy"""
    return (pred == gt).sum() / pred.size

def compute_per_tooth_metrics(pred: np.ndarray, gt: np.ndarray) -> Dict:
    """Compute metrics for each individual tooth"""
    pred_labels = np.unique(pred[pred > 0])
    gt_labels = np.unique(gt[gt > 0])
    
    metrics = {
        'detected_teeth': len(pred_labels),
        'actual_teeth': len(gt_labels),
        'tooth_iou': {},
        'tooth_dice': {}
    }
    
    for label in set(pred_labels) | set(gt_labels):
        pred_mask = (pred == label)
        gt_mask = (gt == label)
        metrics['tooth_iou'][label] = compute_iou(pred_mask, gt_mask)
        metrics['tooth_dice'][label] = compute_dice(pred_mask, gt_mask)
    
    return metrics
```

### Comprehensive Evaluation Class

```python
# src/evaluation/evaluator.py

from pathlib import Path
from typing import List, Dict
import numpy as np
import pandas as pd
from dataclasses import dataclass

@dataclass
class EvaluationResult:
    image_id: str
    iou: float
    dice: float
    precision: float
    recall: float
    f1: float
    hausdorff: float
    pixel_accuracy: float
    per_tooth_metrics: Dict
    category: str

class ComprehensiveEvaluator:
    def __init__(self, pred_dir: Path, gt_dir: Path, metadata_path: Path = None):
        self.pred_dir = pred_dir
        self.gt_dir = gt_dir
        self.metadata = self._load_metadata(metadata_path) if metadata_path else {}
        
    def evaluate_all(self) -> pd.DataFrame:
        """Evaluate all images and return DataFrame"""
        results = []
        
        for pred_path in sorted(self.pred_dir.glob("*.png")):
            gt_path = self.gt_dir / pred_path.name
            if not gt_path.exists():
                continue
                
            result = self.evaluate_single(pred_path, gt_path)
            results.append(result)
        
        return pd.DataFrame([vars(r) for r in results])
    
    def evaluate_single(self, pred_path: Path, gt_path: Path) -> EvaluationResult:
        """Evaluate a single image"""
        pred = load_mask(pred_path)
        gt = load_mask(gt_path)
        
        # Compute all metrics
        iou = compute_iou(pred > 0, gt > 0)
        dice = compute_dice(pred > 0, gt > 0)
        precision, recall, f1 = compute_prf(pred > 0, gt > 0)
        hausdorff = compute_hausdorff_distance(pred > 0, gt > 0)
        pixel_acc = compute_pixel_accuracy(pred > 0, gt > 0)
        per_tooth = compute_per_tooth_metrics(pred, gt)
        
        category = self.metadata.get(pred_path.stem, {}).get('category', 'unknown')
        
        return EvaluationResult(
            image_id=pred_path.stem,
            iou=iou, dice=dice,
            precision=precision, recall=recall, f1=f1,
            hausdorff=hausdorff,
            pixel_accuracy=pixel_acc,
            per_tooth_metrics=per_tooth,
            category=category
        )
    
    def generate_report(self, df: pd.DataFrame, output_path: Path):
        """Generate comprehensive evaluation report"""
        report = f"""
# Evaluation Report

## Overall Statistics
- Total Images: {len(df)}
- Mean IoU: {df['iou'].mean():.4f} ± {df['iou'].std():.4f}
- Mean Dice: {df['dice'].mean():.4f} ± {df['dice'].std():.4f}
- Mean F1: {df['f1'].mean():.4f} ± {df['f1'].std():.4f}
- Mean Precision: {df['precision'].mean():.4f} ± {df['precision'].std():.4f}
- Mean Recall: {df['recall'].mean():.4f} ± {df['recall'].std():.4f}

## Category-wise Performance
{self._category_breakdown(df)}

## Worst Performing Images
{self._worst_performers(df)}

## Best Performing Images
{self._best_performers(df)}
"""
        output_path.write_text(report)
```

---

## Data Collection Strategy

### Ground Truth Collection Script

```python
# scripts/collect_ground_truth.py

"""
Helper script for collecting and managing ground truth annotations
"""

import json
from pathlib import Path
from typing import Dict, List

class GroundTruthCollector:
    def __init__(self, dataset_dir: Path):
        self.dataset_dir = dataset_dir
        self.metadata_path = dataset_dir / 'metadata.json'
        self.metadata = self._load_metadata()
    
    def add_annotation(self, image_id: str, gt_path: Path, 
                      category: str, difficulty: str, notes: str = ""):
        """Add ground truth annotation with metadata"""
        self.metadata[image_id] = {
            'gt_path': str(gt_path),
            'category': category,
            'difficulty': difficulty,
            'notes': notes,
            'annotated_date': datetime.now().isoformat()
        }
        self._save_metadata()
    
    def create_test_split(self, test_ratio: float = 0.2):
        """Create train/test split"""
        all_ids = list(self.metadata.keys())
        np.random.shuffle(all_ids)
        split_idx = int(len(all_ids) * test_ratio)
        return {
            'test': all_ids[:split_idx],
            'train': all_ids[split_idx:]
        }
```

---

## Training/Fine-tuning Approach

### Training Configuration

```yaml
# config/training_config.yaml

model:
  architecture: "ResNeSt50_TC"
  pretrained: true
  freeze_encoder: false  # Set to true for first stage

data:
  train_dir: "dataset/train_set/images"
  train_gt_dir: "dataset/train_set/ground_truth"
  val_dir: "dataset/validation_set/images"
  val_gt_dir: "dataset/validation_set/ground_truth"
  batch_size: 8
  num_workers: 4

augmentation:
  rotation: [-15, 15]
  scale: [0.9, 1.1]
  brightness: [0.8, 1.2]
  contrast: [0.8, 1.2]
  flip_horizontal: true
  flip_vertical: false

training:
  epochs: 100
  learning_rate: 1e-4
  weight_decay: 1e-5
  optimizer: "AdamW"
  scheduler: "CosineAnnealingLR"
  loss_function: "combined"  # bce, dice, focal, combined
  loss_weights:
    bce: 0.5
    dice: 0.5

checkpoint:
  save_dir: "results/checkpoints"
  save_frequency: 10  # Save every N epochs
  best_metric: "val_iou"  # Metric to track for best model
```

### Training Loop Structure

```python
# src/training/trainer.py

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from pathlib import Path
import yaml

class ModelTrainer:
    def __init__(self, config_path: Path):
        self.config = self._load_config(config_path)
        self.model = self._build_model()
        self.optimizer = self._build_optimizer()
        self.scheduler = self._build_scheduler()
        self.criterion = self._build_loss()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
    def train_epoch(self, dataloader: DataLoader) -> Dict[str, float]:
        """Train for one epoch"""
        self.model.train()
        metrics = {'loss': 0.0, 'iou': 0.0, 'dice': 0.0}
        
        for batch_idx, (images, masks) in enumerate(dataloader):
            images = images.to(self.device)
            masks = masks.to(self.device)
            
            # Forward pass
            outputs = self.model(images)
            loss = self.criterion(outputs, masks)
            
            # Backward pass
            self.optimizer.zero_grad()
            loss.backward()
            self.optimizer.step()
            
            # Compute metrics
            with torch.no_grad():
                pred_binary = (outputs > 0.5).float()
                iou = compute_iou_tensor(pred_binary, masks)
                dice = compute_dice_tensor(pred_binary, masks)
            
            metrics['loss'] += loss.item()
            metrics['iou'] += iou.item()
            metrics['dice'] += dice.item()
        
        # Average metrics
        for key in metrics:
            metrics[key] /= len(dataloader)
        
        return metrics
    
    def validate(self, dataloader: DataLoader) -> Dict[str, float]:
        """Validate on validation set"""
        self.model.eval()
        metrics = {'loss': 0.0, 'iou': 0.0, 'dice': 0.0}
        
        with torch.no_grad():
            for images, masks in dataloader:
                images = images.to(self.device)
                masks = masks.to(self.device)
                
                outputs = self.model(images)
                loss = self.criterion(outputs, masks)
                
                pred_binary = (outputs > 0.5).float()
                iou = compute_iou_tensor(pred_binary, masks)
                dice = compute_dice_tensor(pred_binary, masks)
                
                metrics['loss'] += loss.item()
                metrics['iou'] += iou.item()
                metrics['dice'] += dice.item()
        
        for key in metrics:
            metrics[key] /= len(dataloader)
        
        return metrics
    
    def train(self):
        """Main training loop"""
        train_loader = self._build_dataloader('train')
        val_loader = self._build_dataloader('val')
        
        best_val_iou = 0.0
        
        for epoch in range(self.config['training']['epochs']):
            train_metrics = self.train_epoch(train_loader)
            val_metrics = self.validate(val_loader)
            
            self.scheduler.step()
            
            print(f"Epoch {epoch+1}/{self.config['training']['epochs']}")
            print(f"Train - Loss: {train_metrics['loss']:.4f}, IoU: {train_metrics['iou']:.4f}")
            print(f"Val - Loss: {val_metrics['loss']:.4f}, IoU: {val_metrics['iou']:.4f}")
            
            # Save best model
            if val_metrics['iou'] > best_val_iou:
                best_val_iou = val_metrics['iou']
                self._save_checkpoint(epoch, val_metrics, is_best=True)
            
            # Periodic checkpoint
            if (epoch + 1) % self.config['checkpoint']['save_frequency'] == 0:
                self._save_checkpoint(epoch, val_metrics, is_best=False)
```

### Loss Functions

```python
# src/training/losses.py

import torch
import torch.nn as nn
import torch.nn.functional as F

class DiceLoss(nn.Module):
    def __init__(self, smooth=1.0):
        super().__init__()
        self.smooth = smooth
    
    def forward(self, pred, target):
        pred_flat = pred.view(-1)
        target_flat = target.view(-1)
        intersection = (pred_flat * target_flat).sum()
        dice = (2. * intersection + self.smooth) / (pred_flat.sum() + target_flat.sum() + self.smooth)
        return 1 - dice

class FocalLoss(nn.Module):
    def __init__(self, alpha=0.25, gamma=2.0):
        super().__init__()
        self.alpha = alpha
        self.gamma = gamma
    
    def forward(self, pred, target):
        bce = F.binary_cross_entropy(pred, target, reduction='none')
        pt = torch.exp(-bce)
        focal_loss = self.alpha * (1 - pt) ** self.gamma * bce
        return focal_loss.mean()

class CombinedLoss(nn.Module):
    def __init__(self, bce_weight=0.5, dice_weight=0.5):
        super().__init__()
        self.bce = nn.BCELoss()
        self.dice = DiceLoss()
        self.bce_weight = bce_weight
        self.dice_weight = dice_weight
    
    def forward(self, pred, target):
        bce_loss = self.bce(pred, target)
        dice_loss = self.dice(pred, target)
        return self.bce_weight * bce_loss + self.dice_weight * dice_loss
```

---

## Code Examples

### Example 1: Running Comprehensive Evaluation

```python
# scripts/run_evaluation.py

from pathlib import Path
from src.evaluation.evaluator import ComprehensiveEvaluator
import pandas as pd

# Setup paths
pred_dir = Path("outputs/kaggle_batch1/25-11-17")
gt_dir = Path("dataset/test_set/ground_truth")
metadata_path = Path("dataset/test_set/metadata.json")
output_dir = Path("results/evaluations")

# Run evaluation
evaluator = ComprehensiveEvaluator(pred_dir, gt_dir, metadata_path)
results_df = evaluator.evaluate_all()

# Save results
results_df.to_csv(output_dir / "evaluation_results.csv", index=False)

# Generate report
evaluator.generate_report(results_df, output_dir / "evaluation_report.md")

# Print summary
print(f"Mean IoU: {results_df['iou'].mean():.4f}")
print(f"Mean F1: {results_df['f1'].mean():.4f}")
```

### Example 2: Training a Model

```python
# scripts/run_training.py

from pathlib import Path
from src.training.trainer import ModelTrainer

config_path = Path("config/training_config.yaml")
trainer = ModelTrainer(config_path)
trainer.train()
```

### Example 3: Error Analysis

```python
# scripts/run_error_analysis.py

from pathlib import Path
from src.evaluation.error_analyzer import ErrorAnalyzer

pred_dir = Path("outputs/kaggle_batch1/25-11-17")
gt_dir = Path("dataset/test_set/ground_truth")
output_dir = Path("results/error_analysis")

analyzer = ErrorAnalyzer(pred_dir, gt_dir)
error_report = analyzer.analyze_errors()
analyzer.visualize_errors(output_dir)
analyzer.generate_recommendations(output_dir / "recommendations.md")
```

---

## Next Steps Checklist

### Phase 1: Evaluation Setup (Week 1)
- [ ] Create test dataset structure
- [ ] Collect/annotate 50-100 ground truth images
- [ ] Implement comprehensive metrics
- [ ] Run baseline evaluation
- [ ] Generate initial error analysis

### Phase 2: Error Analysis (Week 2)
- [ ] Categorize failure cases
- [ ] Identify common error patterns
- [ ] Create visualization tools
- [ ] Document findings

### Phase 3: Model Refinement (Week 3-4)
- [ ] Implement training pipeline
- [ ] Create data augmentation
- [ ] Fine-tune model on collected data
- [ ] Validate improvements

### Phase 4: Optimization (Week 5)
- [ ] Hyperparameter tuning
- [ ] Model architecture experiments
- [ ] Final evaluation
- [ ] Documentation

---

## Key Libraries to Install

```bash
pip install torch torchvision
pip install scikit-image  # For Hausdorff distance
pip install pandas  # For data management
pip install matplotlib seaborn  # For visualization
pip install optuna  # For hyperparameter optimization
pip install tensorboard  # For training visualization
```

---

## Tips & Best Practices

1. **Start Small**: Begin with 20-30 annotated images for initial testing
2. **Iterate**: Use evaluation → error analysis → refinement cycle
3. **Version Control**: Track model versions and their performance
4. **Visualization**: Always visualize predictions alongside ground truth
5. **Documentation**: Keep detailed logs of experiments and results
6. **Reproducibility**: Use random seeds and save all configurations

---

## Questions to Answer

As you implement, track answers to:
1. What are the most common failure modes?
2. Which image categories perform worst?
3. What improvements does fine-tuning provide?
4. Which loss function works best?
5. What augmentation strategies help most?
6. How much data is needed for improvement?

Good luck with your implementation! 🚀

