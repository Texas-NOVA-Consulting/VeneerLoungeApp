import numpy as np
from typing import Tuple, Dict, List

def compute_iou(pred: np.ndarray, gt: np.ndarray) -> float:
    """Intersection Over Union"""
    pred = pred.astype(bool)
    gt = gt.astype(bool)
    intersection = np.logical_and(pred, gt).sum()
    union = np.logical_or(pred, gt).sum()

    if union == 0:
        return 1.0 if intersection == 0 else 0.0
    return float(intersection/union)

def compute_dice(pred: np.ndarray, gt: np.ndarray) -> float:
    """Dice Coefficient"""
    pred = pred.astype(bool)
    gt = gt.astype(bool)
    intersection = np.logical_and(pred, gt).sum()
    if (pred.sum() + gt.sum()) == 0:
        return 1.0
    return float(2.0 * intersection / (pred.sum() + gt.sum()))

def compute_pixel_accuracy(pred: np.ndarray, gt: np.ndarray) -> float:
    return float((pred==gt).sum()/pred.size)

def compute_precision_recall_f1(pred: np.ndarray, gt: np.ndarray) -> Tuple[float, float, float]:
    pred = pred.astype(bool)
    gt = gt.astype(bool)
    tp = np.logical_and(pred, gt).sum()
    fp = np.logical_and(pred, np.logical_not(gt)).sum()
    fn = np.logical_and(np.logical_not(pred), gt).sum()

    precision = tp / (tp + fp) if tp + fp > 0 else 1.0
    recall = tp / (tp + fn) if tp + fn > 0 else 1.0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall > 0 else 0.0
    return float(precision), float(recall), float(f1)

def compute_per_tooth_metrics(pred: np.ndarray, gt: np.ndarray) -> Dict:
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
    for label in set(pred_labels) | set(gt_labels):
        pred_mask = (pred == label)
        gt_mask = (gt == label)
        
        metrics['tooth_iou'][int(label)] = compute_iou(pred_mask, gt_mask)
        metrics['tooth_dice'][int(label)] = compute_dice(pred_mask, gt_mask)
        prec, rec, _ = compute_precision_recall_f1(pred_mask, gt_mask)
        metrics['tooth_precision'][int(label)] = prec
        metrics['tooth_recall'][int(label)] = rec
    
    return metrics


