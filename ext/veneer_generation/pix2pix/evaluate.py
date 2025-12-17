"""
Evaluation script for Pix2pix veneer generation model.

Calculates metrics:
- PSNR (Peak Signal-to-Noise Ratio)
- SSIM (Structural Similarity Index)
- L1 Loss
"""

import argparse
from pathlib import Path
import torch
from torch.utils.data import DataLoader
from torchmetrics.image import PeakSignalNoiseRatio, StructuralSimilarityIndexMeasure
from tqdm import tqdm
import numpy as np
import matplotlib.pyplot as plt

import sys
sys.path.append(str(Path(__file__).parent))
from data.veneer_dataset import VeneerDataset
from inference_pix2pix import VeneerPix2PixGenerator


class ModelEvaluator:
    """
    Evaluator for veneer generation model.

    Calculates quality metrics on test set.
    """

    def __init__(self, generator, device='cuda'):
        """
        Args:
            generator: VeneerPix2PixGenerator instance
            device: Device to run evaluation on
        """
        self.generator = generator
        self.device = torch.device(device if torch.cuda.is_available() else 'cpu')

        # Initialize metrics
        self.psnr_metric = PeakSignalNoiseRatio().to(self.device)
        self.ssim_metric = StructuralSimilarityIndexMeasure().to(self.device)

    def evaluate_dataset(self, dataset):
        """
        Evaluate model on entire dataset.

        Args:
            dataset: VeneerDataset instance

        Returns:
            Dictionary of metrics
        """
        psnr_scores = []
        ssim_scores = []
        l1_losses = []

        print(f"Evaluating on {len(dataset)} samples...")

        for i in tqdm(range(len(dataset))):
            data = dataset[i]

            # Get input and target
            input_tensor = data['A'].unsqueeze(0).to(self.device)
            target_tensor = data['B'].unsqueeze(0).to(self.device)

            # Generate prediction
            with torch.no_grad():
                pred_tensor = self.generator.netG(input_tensor)

            # Convert to [0, 1] range for metrics
            pred_norm = (pred_tensor + 1) / 2.0
            target_norm = (target_tensor + 1) / 2.0

            # Calculate metrics
            psnr = self.psnr_metric(pred_norm, target_norm)
            ssim = self.ssim_metric(pred_norm, target_norm)
            l1 = torch.abs(pred_tensor - target_tensor).mean()

            psnr_scores.append(psnr.item())
            ssim_scores.append(ssim.item())
            l1_losses.append(l1.item())

        # Calculate statistics
        results = {
            'psnr_mean': np.mean(psnr_scores),
            'psnr_std': np.std(psnr_scores),
            'psnr_min': np.min(psnr_scores),
            'psnr_max': np.max(psnr_scores),
            'ssim_mean': np.mean(ssim_scores),
            'ssim_std': np.std(ssim_scores),
            'ssim_min': np.min(ssim_scores),
            'ssim_max': np.max(ssim_scores),
            'l1_mean': np.mean(l1_losses),
            'l1_std': np.std(l1_losses),
        }

        return results

    def generate_comparison_grid(self, dataset, output_path, num_samples=8):
        """
        Generate grid of before/after/generated comparisons.

        Args:
            dataset: VeneerDataset instance
            output_path: Path to save comparison image
            num_samples: Number of samples to show
        """
        num_samples = min(num_samples, len(dataset))

        fig, axes = plt.subplots(num_samples, 3, figsize=(12, 4 * num_samples))

        if num_samples == 1:
            axes = axes.reshape(1, -1)

        for i in range(num_samples):
            data = dataset[i]

            # Get images
            input_tensor = data['A'].unsqueeze(0).to(self.device)
            target_tensor = data['B'].unsqueeze(0).to(self.device)

            with torch.no_grad():
                pred_tensor = self.generator.netG(input_tensor)

            # Convert to numpy
            input_img = self._tensor_to_numpy(input_tensor)
            target_img = self._tensor_to_numpy(target_tensor)
            pred_img = self._tensor_to_numpy(pred_tensor)

            # Plot
            axes[i, 0].imshow(input_img)
            axes[i, 0].set_title('Before')
            axes[i, 0].axis('off')

            axes[i, 1].imshow(pred_img)
            axes[i, 1].set_title('Generated')
            axes[i, 1].axis('off')

            axes[i, 2].imshow(target_img)
            axes[i, 2].set_title('Ground Truth')
            axes[i, 2].axis('off')

        plt.tight_layout()
        plt.savefig(output_path, dpi=150, bbox_inches='tight')
        print(f"✓ Saved comparison grid to {output_path}")
        plt.close()

    def _tensor_to_numpy(self, tensor):
        """Convert tensor to numpy array for visualization."""
        tensor = tensor.squeeze().cpu()
        tensor = (tensor + 1) / 2.0  # Denormalize
        tensor = torch.clamp(tensor, 0, 1)
        array = tensor.numpy()
        array = np.transpose(array, (1, 2, 0))
        return array


def main():
    parser = argparse.ArgumentParser(description='Evaluate Pix2pix veneer model')

    parser.add_argument('--checkpoint', type=str, required=True,
                       help='Path to model checkpoint')
    parser.add_argument('--dataset', type=str, default='../../../data/veneer_dataset',
                       help='Path to dataset root')
    parser.add_argument('--phase', type=str, default='test',
                       choices=['train', 'val', 'test'],
                       help='Dataset split to evaluate on')
    parser.add_argument('--output', type=str, default='evaluation_results',
                       help='Output directory for results')
    parser.add_argument('--num_samples', type=int, default=8,
                       help='Number of samples for comparison grid')
    parser.add_argument('--device', type=str, default='cuda',
                       choices=['cuda', 'cpu'],
                       help='Device to run evaluation on')

    args = parser.parse_args()

    print("=" * 60)
    print("Pix2pix Model Evaluation")
    print("=" * 60)
    print(f"Checkpoint: {args.checkpoint}")
    print(f"Dataset: {args.dataset}")
    print(f"Phase: {args.phase}")
    print()

    # Create output directory
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Load model
    print("Loading model...")
    generator = VeneerPix2PixGenerator(args.checkpoint, device=args.device)

    # Load dataset
    script_dir = Path(__file__).parent
    dataset_root = Path(args.dataset)
    if not dataset_root.is_absolute():
        dataset_root = script_dir / dataset_root

    print(f"Loading dataset from {dataset_root}...")
    dataset = VeneerDataset(dataset_root, phase=args.phase)

    # Create evaluator
    evaluator = ModelEvaluator(generator, device=args.device)

    # Run evaluation
    print()
    results = evaluator.evaluate_dataset(dataset)

    # Print results
    print()
    print("=" * 60)
    print("Evaluation Results")
    print("=" * 60)
    print(f"PSNR:  {results['psnr_mean']:.2f} ± {results['psnr_std']:.2f} dB")
    print(f"       Range: [{results['psnr_min']:.2f}, {results['psnr_max']:.2f}]")
    print(f"SSIM:  {results['ssim_mean']:.4f} ± {results['ssim_std']:.4f}")
    print(f"       Range: [{results['ssim_min']:.4f}, {results['ssim_max']:.4f}]")
    print(f"L1:    {results['l1_mean']:.4f} ± {results['l1_std']:.4f}")
    print("=" * 60)

    # Save results to file
    results_file = output_dir / 'metrics.txt'
    with open(results_file, 'w') as f:
        f.write("Evaluation Results\n")
        f.write("=" * 60 + "\n")
        f.write(f"Checkpoint: {args.checkpoint}\n")
        f.write(f"Dataset: {args.dataset}\n")
        f.write(f"Phase: {args.phase}\n")
        f.write(f"Num samples: {len(dataset)}\n")
        f.write("\n")
        f.write(f"PSNR:  {results['psnr_mean']:.2f} ± {results['psnr_std']:.2f} dB\n")
        f.write(f"       Range: [{results['psnr_min']:.2f}, {results['psnr_max']:.2f}]\n")
        f.write(f"SSIM:  {results['ssim_mean']:.4f} ± {results['ssim_std']:.4f}\n")
        f.write(f"       Range: [{results['ssim_min']:.4f}, {results['ssim_max']:.4f}]\n")
        f.write(f"L1:    {results['l1_mean']:.4f} ± {results['l1_std']:.4f}\n")

    print(f"\n✓ Results saved to {results_file}")

    # Generate comparison grid
    print(f"\nGenerating comparison grid...")
    comparison_path = output_dir / 'comparison_grid.png'
    evaluator.generate_comparison_grid(dataset, comparison_path, num_samples=args.num_samples)

    print()
    print("=" * 60)
    print("✓ Evaluation complete!")
    print("=" * 60)


if __name__ == '__main__':
    main()
