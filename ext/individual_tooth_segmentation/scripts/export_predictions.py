"""Export segmentation predictions from saved *.pth outputs.

Usage:
    python scripts/export_predictions.py \
        --outputs-dir outputs/kaggle_batch1/25-11-09 \
        --dest-dir predictions/kaggle_batch1

The script scans for directories containing the pickled dictionaries emitted by
`main.py`. For each entry it looks for segmentation results (either `lbl_reg`
or `phi_res`) and writes a mask to the destination directory using the same
six-digit stem as the source.
"""

from __future__ import annotations

import argparse
import pickle
from pathlib import Path
from typing import Optional

import numpy as np
import imageio.v2 as imageio


def extract_mask(payload: dict) -> Optional[np.ndarray]:
    """Return a mask array if one is present in the payload."""

    if "lbl_reg" in payload:
        mask = np.asarray(payload["lbl_reg"], dtype=np.uint16)
        return mask

    if "phi_res" in payload:
        phi = np.asarray(payload["phi_res"])
        if phi.size == 0:
            return None
        mask = (phi <= 0).astype(np.uint8)
        return mask

    return None


def export_masks(outputs_dir: Path, dest_dir: Path, overwrite: bool = False) -> None:
    dest_dir.mkdir(parents=True, exist_ok=True)

    pth_files = sorted(outputs_dir.glob("*/??????.pth"))
    if not pth_files:
        print(f"No prediction files found under {outputs_dir}")
        return

    exported = 0
    skipped = 0

    for pth_file in pth_files:
        with pth_file.open("rb") as fh:
            payload = pickle.load(fh)

        mask = extract_mask(payload)
        if mask is None:
            skipped += 1
            print(f"[skip] {pth_file}: no final mask (phi_res/lbl_reg missing)")
            continue

        dest_path = dest_dir / f"{pth_file.stem}.png"
        if dest_path.exists() and not overwrite:
            print(f"[keep] {dest_path} exists; use --overwrite to replace")
            continue

        imageio.imwrite(dest_path, mask)
        exported += 1
        print(f"[save] {dest_path}")

    print(f"Export complete. Saved {exported} mask(s); skipped {skipped}.")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export predicted masks from .pth outputs")
    parser.add_argument(
        "--outputs-dir",
        type=Path,
        required=True,
        help="Directory created by main.py (e.g. outputs/kaggle_batch1/25-11-09)",
    )
    parser.add_argument(
        "--dest-dir",
        type=Path,
        required=True,
        help="Destination directory for exported PNG masks",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing mask files in the destination directory",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    export_masks(args.outputs_dir, args.dest_dir, overwrite=args.overwrite)


if __name__ == "__main__":
    main()
