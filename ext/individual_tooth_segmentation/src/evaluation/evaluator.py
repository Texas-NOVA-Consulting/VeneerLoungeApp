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
    