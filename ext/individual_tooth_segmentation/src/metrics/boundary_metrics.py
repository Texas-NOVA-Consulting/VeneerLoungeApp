import numpy as np
from scipy.ndimage import binary_erosion
from skimage.metrics import hausdorff_distance

def extract_boundary(mask: np.ndarray) -> np.ndarray:
    mask = mask.astype(bool)
    eroded = binary_erosion(mask)
    boundary = mask & (~eroded)
    return boundary.astype(np.uint8)

def compute_hausdorff_distance(pred: np.ndarray, gt: np.ndarray) -> float:
    pred_boundary = extract_boundary(pred)
    gt_boundary = extract_boundary(gt)
    if pred_boundary.sum() == 0 or gt_boundary.sum() == 0:
        return float('inf')
    try:
        pred_coords = np.argwhere(pred_boundary > 0)
        gt_coords = np.argwhere(gt_boundary > 0)
        if len(pred_coords) == 0 or len(gt_coords) == 0:
            return float('inf')
        return float(hausdorff_distance(pred_coords, gt_coords))
    except Exception as e:
        print(f"Error computing Hausdorff distance: {e}")
        return float('inf')