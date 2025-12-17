"""
Prepare data for ControlNet training.

This script converts the veneer dataset into the format needed for ControlNet:
- Before images (source)
- After images (target)
- Segmentation masks (condition)
- Optional: Edge maps, depth maps

ControlNet uses these to learn tooth transformation while preserving facial structure.
"""

import argparse
from pathlib import Path
import json
import numpy as np
from PIL import Image
import cv2
from tqdm import tqdm


class ControlNetDataPreparator:
    """
    Prepares veneer dataset for ControlNet training.

    Creates a dataset with:
    - source: before images
    - target: after images
    - conditioning: segmentation masks + optional edge maps
    - prompt: text description for each image
    """

    def __init__(self, dataset_dir, output_dir):
        """
        Initialize the data preparator.

        Args:
            dataset_dir: Path to veneer dataset (with A, B, C folders)
            output_dir: Path to save ControlNet-format dataset
        """
        self.dataset_dir = Path(dataset_dir)
        self.output_dir = Path(output_dir)

    def create_edge_map(self, image, low_threshold=100, high_threshold=200):
        """
        Create edge map using Canny edge detection.

        Why: Edges help ControlNet understand tooth boundaries and structure.

        Args:
            image: PIL Image
            low_threshold: Canny low threshold
            high_threshold: Canny high threshold

        Returns:
            PIL Image of edge map
        """
        # Convert to numpy array
        img_array = np.array(image)

        # Convert to grayscale
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)

        # Apply Canny edge detection
        edges = cv2.Canny(gray, low_threshold, high_threshold)

        # Convert back to PIL
        edge_image = Image.fromarray(edges, mode='L')

        return edge_image

    def combine_conditions(self, mask, edges=None):
        """
        Combine multiple conditioning inputs into one image.

        Why: ControlNet can use multiple conditions simultaneously.
        We combine mask + edges into different channels.

        Args:
            mask: PIL Image of segmentation mask
            edges: PIL Image of edge map (optional)

        Returns:
            PIL Image with combined conditions
        """
        # Start with mask
        combined = np.array(mask)

        if edges is not None:
            # Stack mask and edges
            edges_array = np.array(edges)

            # Create 3-channel image: R=mask, G=edges, B=zeros
            combined = np.stack([
                combined,
                edges_array,
                np.zeros_like(combined)
            ], axis=-1).astype(np.uint8)
        else:
            # Just use mask in all channels
            combined = np.stack([combined] * 3, axis=-1).astype(np.uint8)

        return Image.fromarray(combined)

    def create_prompt(self, image_path):
        """
        Create text prompt for the image.

        Why: ControlNet can be guided by text prompts.
        Helps the model understand what transformation to apply.

        Args:
            image_path: Path to image file

        Returns:
            Text prompt string
        """
        # Default prompt for veneer application
        prompts = [
            "professional dental veneers, white teeth, perfect smile, high quality, detailed",
            "cosmetic dentistry, bright white veneers, natural looking teeth, photorealistic",
            "perfect white teeth with porcelain veneers, beautiful smile, professional photo",
            "dental transformation with veneers, aligned white teeth, natural appearance"
        ]

        # Use filename hash to deterministically pick a prompt variation
        import hashlib
        hash_val = int(hashlib.md5(str(image_path).encode()).hexdigest(), 16)
        prompt = prompts[hash_val % len(prompts)]

        return prompt

    def process_split(self, split_name, use_edges=True):
        """
        Process one split (train/val/test) of the dataset.

        Args:
            split_name: Name of split ('train', 'val', or 'test')
            use_edges: Whether to include edge maps
        """
        split_input = self.dataset_dir / split_name
        split_output = self.output_dir / split_name

        # Check if split exists
        if not split_input.exists():
            print(f"Warning: {split_input} does not exist, skipping...")
            return

        # Create output directories
        (split_output / 'source').mkdir(parents=True, exist_ok=True)
        (split_output / 'target').mkdir(parents=True, exist_ok=True)
        (split_output / 'conditioning').mkdir(parents=True, exist_ok=True)

        # Get all images
        source_images = sorted((split_input / 'A').glob('*.jpg'))
        target_images = sorted((split_input / 'B').glob('*.jpg'))
        mask_images = sorted((split_input / 'C').glob('*.jpg')) if (split_input / 'C').exists() else []

        if len(mask_images) == 0:
            print(f"Warning: No masks found in {split_input / 'C'}")
            print("Please run generate_masks_for_training.py first!")
            return

        # Metadata for each image
        metadata = []

        print(f"\nProcessing {split_name} split: {len(source_images)} images")

        for idx, (source_path, target_path, mask_path) in enumerate(
            tqdm(zip(source_images, target_images, mask_images), total=len(source_images))
        ):
            try:
                # Load images
                source_img = Image.open(source_path).convert('RGB')
                target_img = Image.open(target_path).convert('RGB')
                mask_img = Image.open(mask_path).convert('L')

                # Create edge map from source image
                edges_img = None
                if use_edges:
                    edges_img = self.create_edge_map(source_img)

                # Combine conditions
                condition_img = self.combine_conditions(mask_img, edges_img)

                # Generate prompt
                prompt = self.create_prompt(source_path)

                # Save images
                filename = f"{idx:04d}.jpg"
                source_img.save(split_output / 'source' / filename, quality=95)
                target_img.save(split_output / 'target' / filename, quality=95)
                condition_img.save(split_output / 'conditioning' / filename, quality=95)

                # Add to metadata
                metadata.append({
                    'file_name': filename,
                    'text': prompt,
                    'source': f'source/{filename}',
                    'target': f'target/{filename}',
                    'conditioning_image': f'conditioning/{filename}'
                })

            except Exception as e:
                print(f"\nError processing {source_path.name}: {str(e)}")
                continue

        # Save metadata
        metadata_path = split_output / 'metadata.jsonl'
        with open(metadata_path, 'w') as f:
            for item in metadata:
                f.write(json.dumps(item) + '\n')

        print(f"✓ Completed {split_name}: {len(metadata)} samples saved to {split_output}")

    def prepare_all_splits(self, use_edges=True):
        """
        Process all splits of the dataset.

        Args:
            use_edges: Whether to include edge maps as additional conditioning
        """
        print("=" * 60)
        print("ControlNet Data Preparation")
        print("=" * 60)

        for split in ['train', 'val', 'test']:
            self.process_split(split, use_edges)

        print("\n" + "=" * 60)
        print("✓ Data preparation complete!")
        print(f"Output saved to: {self.output_dir}")
        print("=" * 60)


def main():
    """Main function."""
    parser = argparse.ArgumentParser(
        description='Prepare veneer dataset for ControlNet training'
    )
    parser.add_argument(
        '--dataset',
        type=str,
        required=True,
        help='Path to veneer dataset (with A, B, C folders)'
    )
    parser.add_argument(
        '--output',
        type=str,
        required=True,
        help='Output directory for ControlNet-format dataset'
    )
    parser.add_argument(
        '--no-edges',
        action='store_true',
        help='Do not include edge maps in conditioning'
    )

    args = parser.parse_args()

    # Create preparator
    preparator = ControlNetDataPreparator(args.dataset, args.output)

    # Process all splits
    preparator.prepare_all_splits(use_edges=not args.no_edges)


if __name__ == "__main__":
    main()
