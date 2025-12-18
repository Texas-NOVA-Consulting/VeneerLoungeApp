"""
Inference pipeline for Pix2pix veneer generation.

This script loads a trained model and generates veneer previews from input images.
Optimized for fast batch processing with GPU acceleration.
"""

import os
import argparse
from pathlib import Path
import torch
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm
import time

# Import model
import sys
sys.path.append(str(Path(__file__).parent))
from models.networks import UNetGenerator


class VeneerPix2PixGenerator:
    """
    Inference class for Pix2pix veneer generation.

    Handles:
    - Model loading
    - Image preprocessing
    - Inference
    - Post-processing
    """

    def __init__(self, checkpoint_path, device='auto', use_half_precision=False):
        """
        Initialize the generator.

        Args:
            checkpoint_path: Path to model checkpoint
            device: Device to run inference on ('auto', 'cuda', 'mps', or 'cpu')
            use_half_precision: Use FP16 for faster inference (GPU only)
        """
        # Auto-detect best device
        if device == 'auto':
            if torch.cuda.is_available():
                self.device = torch.device('cuda')
            elif torch.backends.mps.is_available():
                self.device = torch.device('mps')
            else:
                self.device = torch.device('cpu')
        else:
            self.device = torch.device(device)

        self.use_half_precision = use_half_precision and self.device.type in ['cuda', 'mps']
        print(f"Initializing Pix2pix generator on {self.device}...")
        if self.use_half_precision:
            print(f"Using half precision (FP16) for faster inference")

        # Load model
        self.netG = UNetGenerator(input_nc=3, output_nc=3, ngf=64)
        self._load_checkpoint(checkpoint_path)
        self.netG = self.netG.to(self.device)

        # Apply half precision if enabled
        if self.use_half_precision:
            self.netG = self.netG.half()

        self.netG.eval()

        # Define transforms
        self.transform = transforms.Compose([
            transforms.Resize((256, 256), interpolation=transforms.InterpolationMode.BICUBIC),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ])

        print(f"✓ Generator loaded successfully")

    def _load_checkpoint(self, checkpoint_path):
        """
        Load model weights from checkpoint.

        Args:
            checkpoint_path: Path to checkpoint file
        """
        checkpoint_path = Path(checkpoint_path)
        if not checkpoint_path.exists():
            raise FileNotFoundError(f"Checkpoint not found: {checkpoint_path}")

        checkpoint = torch.load(checkpoint_path, map_location=self.device)

        # Handle different checkpoint formats
        if 'netG_state_dict' in checkpoint:
            state_dict = checkpoint['netG_state_dict']
        else:
            state_dict = checkpoint

        self.netG.load_state_dict(state_dict)

    def preprocess(self, image):
        """
        Preprocess input image.

        Args:
            image: PIL Image or numpy array

        Returns:
            Preprocessed tensor
        """
        if isinstance(image, np.ndarray):
            image = Image.fromarray(image)

        if not isinstance(image, Image.Image):
            raise TypeError("Input must be PIL Image or numpy array")

        # Convert to RGB
        image = image.convert('RGB')

        # Apply transforms
        tensor = self.transform(image)
        tensor = tensor.unsqueeze(0)  # Add batch dimension

        return tensor

    def postprocess(self, tensor):
        """
        Postprocess output tensor to PIL Image.

        Args:
            tensor: Output tensor from model

        Returns:
            PIL Image
        """
        # Remove batch dimension
        tensor = tensor.squeeze(0)

        # Denormalize from [-1, 1] to [0, 1]
        tensor = (tensor + 1) / 2.0
        tensor = torch.clamp(tensor, 0, 1)

        # Convert to numpy
        array = tensor.cpu().numpy()
        array = np.transpose(array, (1, 2, 0))

        # Convert to uint8
        array = (array * 255).astype(np.uint8)

        # Convert to PIL Image
        image = Image.fromarray(array)

        return image

    @torch.no_grad()
    def generate(self, image, return_pil=True):
        """
        Generate veneer preview from input image.

        Args:
            image: Input image (PIL Image, numpy array, or file path)
            return_pil: Whether to return PIL Image (True) or tensor (False)

        Returns:
            Generated veneer preview
        """
        # Load image if path provided
        if isinstance(image, (str, Path)):
            image = Image.open(image)

        # Preprocess
        input_tensor = self.preprocess(image).to(self.device)

        # Apply half precision if enabled
        if self.use_half_precision:
            input_tensor = input_tensor.half()

        # Generate
        output_tensor = self.netG(input_tensor)

        # Postprocess
        if return_pil:
            output = self.postprocess(output_tensor)
        else:
            output = output_tensor

        return output

    @torch.no_grad()
    def generate_batch(self, images, batch_size=8, return_pil=True):
        """
        Generate veneer previews for a batch of images using true batching.

        Args:
            images: List of input images (PIL Images, numpy arrays, or file paths)
            batch_size: Number of images to process at once (higher = faster but more memory)
            return_pil: Whether to return PIL Images

        Returns:
            List of generated previews
        """
        outputs = []
        for i in range(0, len(images), batch_size):
            batch = images[i:i + batch_size]
            tensors = []
            for img in batch:
                if isinstance(img, (str, Path)):
                    img = Image.open(img)
                tensor = self.preprocess(img)
                tensors.append(tensor)
            batch_tensor = torch.cat(tensors, dim=0).to(self.device)
            
            if self.use_half_precision:
                batch_tensor = batch_tensor.half()

            output_tensor = self.netG(batch_tensor)

            for j in range(output_tensor.shape[0]):
                if return_pil:
                    outputs.append(self.postprocess(output_tensor[j:j+1]))
                else:
                    outputs.append(output_tensor[j])

        return outputs

    def generate_and_save(self, input_path, output_path, quality=90):
        """
        Generate veneer preview and save to file.

        Args:
            input_path: Path to input image
            output_path: Path to save output image
            quality: JPEG quality (lower = faster save, smaller file)
        """
        output = self.generate(input_path, return_pil=True)
        output.save(output_path, quality=quality)
        return str(output_path)

    def generate_comparison(self, input_path, output_path, quality=90):
        """
        Generate side-by-side comparison image.

        Args:
            input_path: Path to input image
            output_path: Path to save comparison image
            quality: JPEG quality
        """
        # Load input
        input_image = Image.open(input_path).convert('RGB')
        input_image = input_image.resize((256, 256), Image.Resampling.LANCZOS)

        # Generate preview
        preview = self.generate(input_image, return_pil=True)

        # Create side-by-side comparison
        comparison = Image.new('RGB', (512, 256))
        comparison.paste(input_image, (0, 0))
        comparison.paste(preview, (256, 0))

        # Save
        comparison.save(output_path, quality=quality)
        return str(output_path)

    def process_directory_batch(self, image_files, output_dir, batch_size=8,
                                quality=90, show_progress=True):
        """
        Process a directory of images using fast batch processing.

        This is the FASTEST way to process many images!

        Args:
            image_files: List of input image paths
            output_dir: Directory to save output images
            batch_size: Number of images to process at once
            quality: JPEG quality for output
            show_progress: Show progress bar

        Returns:
            List of output paths
        """
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        output_paths = []
        iterator = tqdm(range(0, len(image_files), batch_size),
                       desc="Processing batches") if show_progress else range(0, len(image_files), batch_size)

        start_time = time.time()

        for i in iterator:
            batch_files = image_files[i:i + batch_size]

            # Generate batch
            outputs = self.generate_batch(batch_files, batch_size=len(batch_files), return_pil=True)

            # Save outputs (can be parallelized for I/O)
            for img_file, output_img in zip(batch_files, outputs):
                img_file = Path(img_file)
                out_file = output_dir / f"{img_file.stem}_veneer{img_file.suffix}"
                output_img.save(out_file, quality=quality)
                output_paths.append(str(out_file))

        elapsed = time.time() - start_time
        imgs_per_sec = len(image_files) / elapsed if elapsed > 0 else 0
        print(f"✓ Processed {len(image_files)} images in {elapsed:.2f}s ({imgs_per_sec:.1f} imgs/sec)")

        return output_paths

    def process_directory_parallel_io(self, image_files, output_dir, batch_size=8,
                                     num_workers=4, quality=90, show_progress=True):
        """
        Process images with parallel I/O for even faster performance.

        Best for CPU or when I/O is the bottleneck.

        Args:
            image_files: List of input image paths
            output_dir: Directory to save output images
            batch_size: Number of images per GPU batch
            num_workers: Number of parallel workers for I/O
            quality: JPEG quality
            show_progress: Show progress bar

        Returns:
            List of output paths
        """
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        def process_batch(batch_files):
            """Process a batch of files."""
            outputs = self.generate_batch(batch_files, batch_size=len(batch_files), return_pil=True)
            paths = []
            for img_file, output_img in zip(batch_files, outputs):
                img_file = Path(img_file)
                out_file = output_dir / f"{img_file.stem}_veneer{img_file.suffix}"
                output_img.save(out_file, quality=quality)
                paths.append(str(out_file))
            return paths

        # Create batches
        batches = [image_files[i:i + batch_size] for i in range(0, len(image_files), batch_size)]

        output_paths = []
        start_time = time.time()

        # Process batches in parallel
        with ThreadPoolExecutor(max_workers=num_workers) as executor:
            if show_progress:
                from concurrent.futures import as_completed
                futures = [executor.submit(process_batch, batch) for batch in batches]
                for future in tqdm(as_completed(futures), total=len(batches), desc="Processing"):
                    output_paths.extend(future.result())
            else:
                results = executor.map(process_batch, batches)
                for paths in results:
                    output_paths.extend(paths)

        elapsed = time.time() - start_time
        imgs_per_sec = len(image_files) / elapsed if elapsed > 0 else 0
        print(f"✓ Processed {len(image_files)} images in {elapsed:.2f}s ({imgs_per_sec:.1f} imgs/sec)")

        return output_paths


def main():
    parser = argparse.ArgumentParser(
        description='Generate veneer previews with Pix2pix - OPTIMIZED FOR SPEED!',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    parser.add_argument('--checkpoint', type=str, required=True,
                       help='Path to model checkpoint')
    parser.add_argument('--input', type=str, required=True,
                       help='Path to input image or directory')
    parser.add_argument('--output', type=str, required=True,
                       help='Path to save output image or directory')
    parser.add_argument('--comparison', action='store_true',
                       help='Generate side-by-side comparison')
    parser.add_argument('--device', type=str, default='auto',
                       choices=['auto', 'cuda', 'mps', 'cpu'],
                       help='Device to run inference on (auto = best available)')
    parser.add_argument('--batch-size', type=int, default=8,
                       help='Batch size for processing (higher = faster but more memory)')
    parser.add_argument('--half-precision', action='store_true',
                       help='Use FP16 for 2x faster inference (GPU only)')
    parser.add_argument('--num-workers', type=int, default=4,
                       help='Number of parallel workers for I/O')
    parser.add_argument('--quality', type=int, default=90,
                       help='JPEG quality (1-100, lower = faster)')
    parser.add_argument('--fast', action='store_true',
                       help='Enable all speed optimizations (batch + parallel I/O)')

    args = parser.parse_args()

    print("=" * 60)
    print("Pix2pix Veneer Preview Generation - OPTIMIZED")
    print("=" * 60)
    print(f"Checkpoint: {args.checkpoint}")
    print(f"Input: {args.input}")
    print(f"Output: {args.output}")
    print(f"Batch size: {args.batch_size}")
    print(f"Quality: {args.quality}")
    print()

    # Initialize generator
    generator = VeneerPix2PixGenerator(
        args.checkpoint,
        device=args.device,
        use_half_precision=args.half_precision
    )

    # Process single image or directory
    input_path = Path(args.input)
    output_path = Path(args.output)

    if input_path.is_file():
        # Single image
        print("Processing single image...")
        if args.comparison:
            result = generator.generate_comparison(str(input_path), str(output_path), quality=args.quality)
        else:
            result = generator.generate_and_save(str(input_path), str(output_path), quality=args.quality)
        print(f"✓ Saved to {result}")

    elif input_path.is_dir():
        # Directory of images
        output_path.mkdir(parents=True, exist_ok=True)

        image_extensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']
        image_files = []
        for ext in image_extensions:
            image_files.extend(input_path.glob(f'*{ext}'))

        # Sort for consistent ordering
        image_files = sorted([str(f) for f in image_files])

        if len(image_files) == 0:
            print(f"❌ No images found in {input_path}")
            return

        print(f"Found {len(image_files)} images")
        print()

        # Choose processing method based on flags
        if args.fast or len(image_files) > 10:
            print("🚀 Using FAST mode (batch + parallel I/O)")
            generator.process_directory_parallel_io(
                image_files,
                output_path,
                batch_size=args.batch_size,
                num_workers=args.num_workers,
                quality=args.quality,
                show_progress=True
            )
        else:
            print("🚀 Using batch processing")
            generator.process_directory_batch(
                image_files,
                output_path,
                batch_size=args.batch_size,
                quality=args.quality,
                show_progress=True
            )

    else:
        print(f"❌ Input path not found: {input_path}")
        return

    print()
    print("=" * 60)
    print("✓ Generation complete!")
    print("=" * 60)


if __name__ == '__main__':
    main()
