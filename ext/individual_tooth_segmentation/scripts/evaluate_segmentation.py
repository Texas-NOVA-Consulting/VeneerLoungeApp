from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

import numpy as np
import imageio.v2 as imageio


@dataclass
class Metrics:
    image_id: str
    iou: float
    precision: float
    recall: float
    f1: float


def load_mask(path: Path) -> np.ndarray:
    mask = imageio.imread(path)
    if mask.ndim == 3:
        mask = mask[..., 0]
    return np.asarray(mask)


def logical_metrics(pred: np.ndarray, gt: np.ndarray) -> Tuple[float, float, float, float]:
    pred = pred.astype(bool)
    gt = gt.astype(bool)
    tp = np.logical_and(pred, gt).sum()
    fp = np.logical_and(pred, np.logical_not(gt)).sum()
    fn = np.logical_and(np.logical_not(pred), gt).sum()
    if tp + fp + fn == 0:
        iou = 1.0
    else:
        iou = tp / (tp + fp + fn)
    precision = tp / (tp + fp) if tp + fp > 0 else 1.0
    recall = tp / (tp + fn) if tp + fn > 0 else 1.0
    if precision + recall == 0:
        f1 = 0.0
    else:
        f1 = 2 * precision * recall / (precision + recall)
    return iou, precision, recall, f1


def evaluate_binary(pred_path: Path, gt_path: Path) -> Metrics:
    pred = load_mask(pred_path) > 0
    gt = load_mask(gt_path) > 0
    iou, precision, recall, f1 = logical_metrics(pred, gt)
    return Metrics(pred_path.stem, iou, precision, recall, f1)


def unique_labels(mask: np.ndarray) -> List[int]:
    return sorted(int(v) for v in np.unique(mask) if v != 0)


def evaluate_multiclass(pred_path: Path, gt_path: Path) -> Metrics:
    pred = load_mask(pred_path)
    gt = load_mask(gt_path)

    labels_pred = unique_labels(pred)
    labels_gt = unique_labels(gt)
    common = sorted(set(labels_pred) & set(labels_gt))

    if not common:
        return Metrics(pred_path.stem, 0.0, 0.0, 0.0, 0.0)

    scores: List[float] = []
    for label in common:
        scores.append(logical_metrics(pred == label, gt == label)[0])

    mean_iou = float(np.mean(scores))
    iou, precision, recall, f1 = logical_metrics(pred > 0, gt > 0)
    return Metrics(pred_path.stem, mean_iou, precision, recall, f1)


def evaluate_directory(pred_dir: Path, gt_dir: Path, multiclass: bool) -> List[Metrics]:
    entries: List[Metrics] = []
    for pred_path in sorted(pred_dir.glob("*.png")):
        gt_path = gt_dir / pred_path.name
        if not gt_path.exists():
            print(f"[warn] Missing ground-truth mask for {pred_path.name}; skipping")
            continue
        if multiclass:
            entry = evaluate_multiclass(pred_path, gt_path)
        else:
            entry = evaluate_binary(pred_path, gt_path)
        entries.append(entry)
        print(
            f"[metric] {entry.image_id}: IoU={entry.iou:.4f}, "
            f"Precision={entry.precision:.4f}, Recall={entry.recall:.4f}, F1={entry.f1:.4f}"
        )
    return entries


def write_report(entries: Iterable[Metrics], report_path: Path) -> None:
    import csv

    report_path.parent.mkdir(parents=True, exist_ok=True)
    with report_path.open("w", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(["image_id", "iou", "precision", "recall", "f1"])
        for entry in entries:
            writer.writerow([entry.image_id, entry.iou, entry.precision, entry.recall, entry.f1])


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Compute IoU/F1 scores for segmentation masks")
    parser.add_argument("--pred-dir", type=Path, required=True, help="Directory with predicted PNG masks")
    parser.add_argument("--gt-dir", type=Path, required=True, help="Directory with ground-truth masks")
    parser.add_argument("--report", type=Path, help="Optional path to save a CSV report")
    parser.add_argument(
        "--multiclass",
        action="store_true",
        help="Treat masks as multi-label and average IoU across labels",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    entries = evaluate_directory(args.pred_dir, args.gt_dir, multiclass=args.multiclass)
    if not entries:
        print("No metrics computed (check file names and directories).")
        return

    mean_iou = float(np.mean([e.iou for e in entries]))
    mean_precision = float(np.mean([e.precision for e in entries]))
    mean_recall = float(np.mean([e.recall for e in entries]))
    mean_f1 = float(np.mean([e.f1 for e in entries]))

    print("\nSummary:")
    print(f"  Mean IoU: {mean_iou:.4f}")
    print(f"  Mean Precision: {mean_precision:.4f}")
    print(f"  Mean Recall: {mean_recall:.4f}")
    print(f"  Mean F1: {mean_f1:.4f}")

    if args.report:
        write_report(entries, args.report)
        print(f"Saved CSV report to {args.report}")


if __name__ == "__main__":
    main()
