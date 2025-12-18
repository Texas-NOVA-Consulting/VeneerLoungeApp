# 🦷 Veneer Preview Generation Implementation Plan

## Table of Contents
1. [Overview](#overview)
2. [Architecture Design](#architecture-design)
3. [Dataset Preparation](#dataset-preparation)
4. [Model Setup & Training](#model-setup--training)
5. [Integration with Tooth Segmentation](#integration-with-tooth-segmentation)
6. [API Integration](#api-integration)
7. [Testing & Validation](#testing--validation)
8. [Deployment Strategy](#deployment-strategy)
9. [Performance Optimization](#performance-optimization)

---

## Overview

### Why pix2pix/CycleGAN for Veneer Preview?

**Current Approach (Replicate API):**
- ✅ Quick to implement
- ❌ Ongoing API costs
- ❌ Limited control over model behavior
- ❌ Dependency on external service
- ❌ No integration with your tooth segmentation

**Proposed Approach (pix2pix):**
- ✅ Self-hosted, no API costs
- ✅ Full control over model training
- ✅ Can integrate with tooth segmentation masks
- ✅ Customizable for different veneer shades/styles
- ✅ Better privacy (data stays local)
- ✅ Can fine-tune on your specific dental images

### Why pix2pix over CycleGAN?

**pix2pix** is recommended because:
1. **Paired Training Data**: You have before/after veneer images (e.g., `before1.jpg`/`after1.jpg`)
2. **Precise Control**: Better for medical/dental applications where accuracy matters
3. **Conditional Generation**: Can condition on tooth segmentation masks for better results
4. **Shade Variations**: Can train multiple models for different veneer shades

**CycleGAN** would be used if:
- You only had unpaired images
- You wanted more artistic/stylistic variations
- Less precision was acceptable

---

## Architecture Design

```
┌─────────────────┐
│  User Uploads   │
│  Smile Image    │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────┐
│  Tooth Segmentation     │  ← Your existing model
│  (Individual Teeth)     │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Image Preprocessing     │
│  - Align & Crop         │
│  - Normalize            │
│  - Combine with masks   │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────────────┐
│  pix2pix Generator       │  ← New model
│  (Veneer Application)   │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Post-processing        │
│  - Blend with original  │
│  - Color correction     │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Veneer Preview Result  │
└─────────────────────────┘
```

### Why This Architecture?

1. **Tooth Segmentation First**: Ensures veneers are applied only to teeth, not gums/lips
2. **Conditional Input**: Segmentation masks guide the model to focus on correct regions
3. **Post-processing**: Blends generated veneers naturally with original image
4. **Modular Design**: Each component can be improved independently

---

## Dataset Preparation

### Step 1: Organize Your Data

**Why:** Proper data organization is crucial for training. The model needs consistent, high-quality paired images.

**Directory Structure:**
```
data/
├── veneer_dataset/
│   ├── train/
│   │   ├── A/          # Before images
│   │   │   ├── 001.jpg
│   │   │   ├── 002.jpg
│   │   │   └── ...
│   │   └── B/          # After images (paired)
│   │       ├── 001.jpg
│   │       ├── 002.jpg
│   │       └── ...
│   ├── test/
│   │   ├── A/
│   │   └── B/
│   └── val/
│       ├── A/
│       └── B/
```

**Code to Create Structure:**
```bash
# Run this in your terminal
mkdir -p data/veneer_dataset/{train,test,val}/{A,B}
```

### Step 2: Data Collection Script

**Why:** Automate pairing of before/after images from your existing data folder.

**File: `scripts/prepare_veneer_dataset.py`**

```python
"""
Prepares paired veneer dataset from existing before/after images.
This script:
1. Finds matching before/after image pairs
2. Aligns and preprocesses them
3. Splits into train/test/val sets
"""

import os
import shutil
from pathlib import Path
from PIL import Image
import numpy as np
from sklearn.model_selection import train_test_split

def find_image_pairs(data_dir):
    """
    Finds matching before/after image pairs.
    
    Why: Your images have naming patterns like:
    - before1.jpg / after1.jpg
    - 39-female-before-porcelain-veneers.jpg / 39-female-after-porcelain-veneers.jpg
    """
    data_path = Path(data_dir)
    images = list(data_path.glob("*.jpg")) + list(data_path.glob("*.png"))
    
    pairs = []
    for img in images:
        name = img.stem.lower()
        
        # Look for before/after patterns
        if 'before' in name:
            after_name = name.replace('before', 'after')
            after_path = data_path / f"{after_name}{img.suffix}"
            if after_path.exists():
                pairs.append((img, after_path))
        elif 'after' in name:
            before_name = name.replace('after', 'before')
            before_path = data_path / f"{before_name}{img.suffix}"
            if before_path.exists():
                pairs.append((before_path, img))
    
    return pairs

def align_images(img1_path, img2_path, target_size=(256, 256)):
    """
    Aligns and resizes two images to same dimensions.
    
    Why: pix2pix requires paired images to be the same size.
    Also ensures consistent input dimensions for training.
    """
    img1 = Image.open(img1_path).convert('RGB')
    img2 = Image.open(img2_path).convert('RGB')
    
    # Resize to target size (pix2pix standard is 256x256)
    img1 = img1.resize(target_size, Image.LANCZOS)
    img2 = img2.resize(target_size, Image.LANCZOS)
    
    return img1, img2

def prepare_dataset(source_dir, output_dir, train_ratio=0.7, val_ratio=0.15):
    """
    Main function to prepare dataset.
    
    Why: Splits data into train/val/test sets to:
    - Train the model (train)
    - Validate during training (val)
    - Test final performance (test)
    """
    pairs = find_image_pairs(source_dir)
    print(f"Found {len(pairs)} image pairs")
    
    if len(pairs) == 0:
        print("No pairs found! Check your image naming.")
        return
    
    # Split into train/val/test
    train_pairs, temp_pairs = train_test_split(
        pairs, test_size=(1 - train_ratio), random_state=42
    )
    val_pairs, test_pairs = train_test_split(
        temp_pairs, test_size=(val_ratio / (1 - train_ratio)), random_state=42
    )
    
    # Create directories
    for split_name, split_pairs in [
        ('train', train_pairs),
        ('val', val_pairs),
        ('test', test_pairs)
    ]:
        split_dir = Path(output_dir) / split_name
        (split_dir / 'A').mkdir(parents=True, exist_ok=True)
        (split_dir / 'B').mkdir(parents=True, exist_ok=True)
        
        for idx, (before_path, after_path) in enumerate(split_pairs):
            before_img, after_img = align_images(before_path, after_path)
            
            # Save with consistent naming
            before_img.save(split_dir / 'A' / f"{idx:04d}.jpg")
            after_img.save(split_dir / 'B' / f"{idx:04d}.jpg")
        
        print(f"{split_name}: {len(split_pairs)} pairs")
    
    print(f"\nDataset prepared in {output_dir}")
    print(f"Total pairs: {len(pairs)}")

if __name__ == "__main__":
    # Adjust paths to your data directory
    source_dir = "data/annotate_batch1"
    output_dir = "data/veneer_dataset"
    
    prepare_dataset(source_dir, output_dir)
```

**How to Run:**
```bash
cd /Users/joshuawu/VeneerLoungeApp
python scripts/prepare_veneer_dataset.py
```

### Step 3: Data Augmentation

**Why:** Increases dataset size and improves model generalization. Dental images can vary in lighting, angle, etc.

**File: `scripts/augment_veneer_dataset.py`**

```python
"""
Augments veneer dataset with transformations.
Why: Increases dataset size and helps model generalize to:
- Different lighting conditions
- Various angles
- Different image qualities
"""

from PIL import Image, ImageEnhance
import numpy as np
from pathlib import Path
import random

def augment_pair(before_img, after_img):
    """
    Applies same augmentation to both images.
    
    Why: Must keep before/after pairs aligned.
    Same transformation applied to both maintains correspondence.
    """
    # Random horizontal flip (50% chance)
    if random.random() > 0.5:
        before_img = before_img.transpose(Image.FLIP_LEFT_RIGHT)
        after_img = after_img.transpose(Image.FLIP_LEFT_RIGHT)
    
    # Random brightness adjustment
    if random.random() > 0.5:
        factor = random.uniform(0.8, 1.2)
        enhancer = ImageEnhance.Brightness(before_img)
        before_img = enhancer.enhance(factor)
        enhancer = ImageEnhance.Brightness(after_img)
        after_img = enhancer.enhance(factor)
    
    # Random contrast adjustment
    if random.random() > 0.5:
        factor = random.uniform(0.8, 1.2)
        enhancer = ImageEnhance.Contrast(before_img)
        before_img = enhancer.enhance(factor)
        enhancer = ImageEnhance.Contrast(after_img)
        after_img = enhancer.enhance(factor)
    
    return before_img, after_img

def augment_dataset(dataset_dir, num_augmentations=2):
    """
    Creates augmented versions of training data.
    
    Why: Only augment training data, not validation/test.
    Keeps validation/test sets clean for accurate evaluation.
    """
    train_dir = Path(dataset_dir) / "train"
    
    before_images = sorted((train_dir / "A").glob("*.jpg"))
    after_images = sorted((train_dir / "B").glob("*.jpg"))
    
    for aug_idx in range(num_augmentations):
        for before_path, after_path in zip(before_images, after_images):
            before_img = Image.open(before_path)
            after_img = Image.open(after_path)
            
            aug_before, aug_after = augment_pair(before_img, after_img)
            
            # Save augmented images
            new_idx = len(before_images) + aug_idx * len(before_images) + before_images.index(before_path)
            aug_before.save(train_dir / "A" / f"{new_idx:04d}.jpg")
            aug_after.save(train_dir / "B" / f"{new_idx:04d}.jpg")
    
    print(f"Created {num_augmentations} augmented versions")

if __name__ == "__main__":
    augment_dataset("data/veneer_dataset", num_augmentations=2)
```

---

## Model Setup & Training

### Step 1: Install Dependencies

**Why:** pix2pix requires specific PyTorch and image processing libraries.

**File: `ext/veneer_preview_generation/requirements.txt`**

```txt
torch>=2.0.0
torchvision>=0.15.0
numpy>=1.21.0
Pillow>=9.0.0
scikit-image>=0.19.0
tensorboard>=2.10.0
dominate>=2.6.0
visdom>=0.1.8
```

**Installation:**
```bash
cd ext/veneer_preview_generation
pip install -r requirements.txt
```

### Step 2: Clone and Setup pix2pix

**Why:** Use the proven implementation from the repository.

```bash
cd ext
git clone https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix.git
cd pytorch-CycleGAN-and-pix2pix
```

### Step 3: Custom Dataset Class

**Why:** Adapt pix2pix to work with your tooth segmentation masks as additional input.

**File: `ext/veneer_preview_generation/datasets/veneer_dataset.py`**

```python
"""
Custom dataset class for veneer preview generation.
Why: Integrates tooth segmentation masks as conditional input.
This helps the model focus on teeth regions.
"""

import os
from data.base_dataset import BaseDataset, get_params, get_transform
from data.image_folder import make_dataset
from PIL import Image
import torch

class VeneerDataset(BaseDataset):
    """
    Dataset for veneer preview generation with segmentation masks.
    
    Why custom class:
    1. Loads before images (A)
    2. Loads after images (B) - target
    3. Optionally loads tooth segmentation masks (C) - condition
    """
    
    def __init__(self, opt):
        BaseDataset.__init__(self, opt)
        self.dir_A = os.path.join(opt.dataroot, opt.phase + 'A')  # Before
        self.dir_B = os.path.join(opt.dataroot, opt.phase + 'B')  # After
        self.dir_C = os.path.join(opt.dataroot, opt.phase + 'C')  # Masks (optional)
        
        self.A_paths = sorted(make_dataset(self.dir_A, opt.max_dataset_size))
        self.B_paths = sorted(make_dataset(self.dir_B, opt.max_dataset_size))
        
        # Check if masks directory exists
        self.use_masks = opt.use_masks and os.path.exists(self.dir_C)
        if self.use_masks:
            self.C_paths = sorted(make_dataset(self.dir_C, opt.max_dataset_size))
            assert len(self.A_paths) == len(self.C_paths), \
                "Number of images and masks must match"
        
        assert len(self.A_paths) == len(self.B_paths), \
            "Number of before and after images must match"
    
    def __getitem__(self, index):
        """
        Returns a dictionary containing:
        - A: before image
        - B: after image (target)
        - C: segmentation mask (if available)
        - A_paths: path to before image
        """
        A_path = self.A_paths[index]
        B_path = self.B_paths[index]
        
        A_img = Image.open(A_path).convert('RGB')
        B_img = Image.open(B_path).convert('RGB')
        
        # Apply same transform to both images
        transform_params = get_params(self.opt, A_img.size)
        A_transform = get_transform(self.opt, transform_params, grayscale=(self.opt.input_nc == 1))
        B_transform = get_transform(self.opt, transform_params, grayscale=(self.opt.output_nc == 1))
        
        A = A_transform(A_img)
        B = B_transform(B_img)
        
        result = {'A': A, 'B': B, 'A_paths': A_path}
        
        # Add segmentation mask if available
        if self.use_masks:
            C_path = self.C_paths[index]
            C_img = Image.open(C_path).convert('L')  # Grayscale mask
            C_transform = get_transform(self.opt, transform_params, grayscale=True)
            C = C_transform(C_img)
            result['C'] = C
        
        return result
    
    def __len__(self):
        """Returns the number of images in the dataset."""
        return len(self.A_paths)
```

### Step 4: Modified Generator with Mask Conditioning

**Why:** Incorporate tooth segmentation masks to guide veneer application.

**File: `ext/veneer_preview_generation/models/veneer_pix2pix_model.py`**

```python
"""
Modified pix2pix model that uses segmentation masks.
Why: Conditions the generator on tooth masks for better results.
"""

import torch
from .pix2pix_model import Pix2PixModel

class VeneerPix2PixModel(Pix2PixModel):
    """
    Extends pix2pix to use segmentation masks.
    
    Why extend instead of rewrite:
    - Reuses proven pix2pix architecture
    - Adds mask conditioning on top
    - Easier to maintain and debug
    """
    
    def __init__(self, opt):
        super().__init__(opt)
        self.use_masks = opt.use_masks
    
    def set_input(self, input):
        """
        Sets input data, including optional masks.
        
        Why: Prepares data for forward pass.
        Combines input image with mask if available.
        """
        AtoB = self.opt.direction == 'AtoB'
        self.real_A = input['A' if AtoB else 'B'].to(self.device)
        self.real_B = input['B' if AtoB else 'A'].to(self.device)
        self.image_paths = input['A_paths']
        
        # Combine input with mask if available
        if self.use_masks and 'C' in input:
            mask = input['C'].to(self.device)
            # Concatenate mask as additional channel
            self.real_A = torch.cat([self.real_A, mask], dim=1)
            # Update input channels
            if hasattr(self, 'netG'):
                # Generator expects input_nc + 1 channels (RGB + mask)
                pass
    
    def get_current_visuals(self):
        """
        Returns current visualization images.
        Why: For tensorboard/visdom visualization during training.
        """
        visual_ret = super().get_current_visuals()
        
        if self.use_masks and 'C' in self.input:
            visual_ret['mask'] = self.input['C']
        
        return visual_ret
```

### Step 5: Training Script

**Why:** Orchestrates the training process with proper hyperparameters for dental images.

**File: `ext/veneer_preview_generation/train_veneer.py`**

```python
"""
Training script for veneer preview generation.
Why: Centralized script to train the model with optimal settings.
"""

import argparse
from options.train_options import TrainOptions
from data import create_dataset
from models import create_model
from util.visualizer import Visualizer
from util.html import save_html
import time

def main():
    """
    Main training loop.
    
    Why structured this way:
    1. Parse options (hyperparameters)
    2. Create dataset (loads images)
    3. Create model (initializes generator/discriminator)
    4. Train loop (iterates over data)
    5. Save checkpoints (for resuming training)
    """
    opt = TrainOptions().parse()
    
    # Create dataset
    dataset = create_dataset(opt)
    dataset_size = len(dataset)
    print(f'Number of training images: {dataset_size}')
    
    # Create model
    model = create_model(opt)
    model.setup(opt)
    
    # Visualizer for monitoring
    visualizer = Visualizer(opt)
    total_iters = 0
    
    # Training loop
    for epoch in range(opt.epoch_count, opt.n_epochs + opt.n_epochs_decay + 1):
        epoch_start_time = time.time()
        iter_data_time = time.time()
        epoch_iter = 0
        
        for i, data in enumerate(dataset):
            iter_start_time = time.time()
            
            if total_iters % opt.print_freq == 0:
                t_data = iter_start_time - iter_data_time
            
            total_iters += opt.batch_size
            epoch_iter += opt.batch_size
            model.set_input(data)
            model.optimize_parameters()
            
            # Display and save
            if total_iters % opt.display_freq == 0:
                save_result = total_iters % opt.update_html_freq == 0
                model.compute_visuals()
                visualizer.display_current_results(
                    model.get_current_visuals(), epoch, save_result
                )
            
            # Print losses
            if total_iters % opt.print_freq == 0:
                losses = model.get_current_losses()
                t_comp = (time.time() - iter_start_time) / opt.batch_size
                visualizer.print_current_losses(
                    epoch, epoch_iter, losses, t_comp, t_data
                )
            
            # Save checkpoint
            if total_iters % opt.save_latest_freq == 0:
                print(f'Saving latest model (epoch {epoch}, total_iters {total_iters})')
                model.save_networks('latest')
            
            iter_data_time = time.time()
        
        # Save checkpoint at end of epoch
        if epoch % opt.save_epoch_freq == 0:
            print(f'Saving model at end of epoch {epoch}')
            model.save_networks('latest')
            model.save_networks(epoch)
        
        print(f'End of epoch {epoch} / {opt.n_epochs + opt.n_epochs_decay} '
              f'\t Time Taken: {time.time() - epoch_start_time} sec')
        
        # Update learning rates
        model.update_learning_rate()

if __name__ == '__main__':
    main()
```

### Step 6: Training Configuration

**Why:** Optimal hyperparameters for dental veneer generation.

**File: `ext/veneer_preview_generation/options/veneer_train_options.py`**

```python
"""
Training options specific to veneer preview generation.
Why: Tuned hyperparameters for dental image domain.
"""

from .train_options import TrainOptions

class VeneerTrainOptions(TrainOptions):
    def initialize(self, parser):
        parser = TrainOptions.initialize(self, parser)
        
        # Dataset options
        parser.add_argument('--dataroot', type=str, 
                          default='../../data/veneer_dataset',
                          help='Path to veneer dataset')
        parser.add_argument('--name', type=str, default='veneer_pix2pix',
                          help='Name of experiment (for saving checkpoints)')
        parser.add_argument('--model', type=str, default='pix2pix',
                          help='Model type (pix2pix)')
        parser.add_argument('--direction', type=str, default='AtoB',
                          help='AtoB: before->after, BtoA: after->before')
        
        # Network architecture
        parser.add_argument('--netG', type=str, default='unet_256',
                          help='Generator architecture [resnet_9blocks | unet_256 | unet_128]')
        parser.add_argument('--netD', type=str, default='basic',
                          help='Discriminator architecture [basic | n_layers | pixel]')
        parser.add_argument('--input_nc', type=int, default=3,
                          help='Input image channels (3 for RGB, 4 if using masks)')
        parser.add_argument('--output_nc', type=int, default=3,
                          help='Output image channels (3 for RGB)')
        
        # Training parameters (tuned for dental images)
        parser.add_argument('--batch_size', type=int, default=4,
                          help='Batch size (smaller for dental images due to detail)')
        parser.add_argument('--n_epochs', type=int, default=200,
                          help='Number of epochs')
        parser.add_argument('--n_epochs_decay', type=int, default=200,
                          help='Number of epochs to decay learning rate')
        parser.add_argument('--lr', type=float, default=0.0002,
                          help='Initial learning rate')
        parser.add_argument('--lr_policy', type=str, default='linear',
                          help='Learning rate policy [linear | step | plateau | cosine]')
        
        # Loss weights (important for dental precision)
        parser.add_argument('--lambda_L1', type=float, default=100.0,
                          help='Weight for L1 loss (higher = more precise)')
        parser.add_argument('--lambda_GAN', type=float, default=1.0,
                          help='Weight for GAN loss')
        
        # Segmentation mask option
        parser.add_argument('--use_masks', action='store_true',
                          help='Use tooth segmentation masks as condition')
        
        return parser
```

### Step 7: Training Command

**Why:** Single command to start training with all settings.

```bash
cd ext/veneer_preview_generation

python train_veneer.py \
    --dataroot ../../data/veneer_dataset \
    --name veneer_pix2pix \
    --model pix2pix \
    --direction AtoB \
    --netG unet_256 \
    --netD basic \
    --batch_size 4 \
    --n_epochs 200 \
    --n_epochs_decay 200 \
    --lr 0.0002 \
    --lambda_L1 100.0 \
    --use_masks \
    --display_id 0 \
    --gpu_ids 0
```

**Explanation of Key Parameters:**
- `--lambda_L1 100.0`: High weight ensures precise veneer placement (critical for dental)
- `--batch_size 4`: Smaller batch for detailed dental images
- `--use_masks`: Enables mask conditioning
- `--n_epochs 200`: Sufficient for convergence (adjust based on dataset size)

---

## Integration with Tooth Segmentation

### Step 1: Generate Masks for Training Data

**Why:** Use your existing segmentation model to create masks for training pix2pix.

**File: `scripts/generate_masks_for_training.py`**

```python
"""
Generates tooth segmentation masks for veneer training data.
Why: Uses your existing segmentation model to create masks
that will condition the pix2pix generator.
"""

import torch
import torch.nn.functional as F
from PIL import Image
import numpy as np
from pathlib import Path
import sys

# Add your segmentation model path
sys.path.append('../individual_tooth_segmentation')
from src.network.teethSeg import TeethSegmentationNet

def load_segmentation_model(checkpoint_path):
    """
    Loads your trained tooth segmentation model.
    
    Why: Reuses your existing model instead of training new one.
    """
    model = TeethSegmentationNet()
    checkpoint = torch.load(checkpoint_path, map_location='cpu')
    model.load_state_dict(checkpoint['model_state_dict'])
    model.eval()
    return model

def generate_mask(image_path, model, device='cuda'):
    """
    Generates tooth segmentation mask for an image.
    
    Why: Creates binary mask of teeth regions.
    This mask will guide pix2pix to apply veneers only to teeth.
    """
    # Load and preprocess image
    img = Image.open(image_path).convert('RGB')
    img_array = np.array(img)
    
    # Resize to model input size (adjust to your model's input size)
    img_tensor = torch.from_numpy(img_array).permute(2, 0, 1).float()
    img_tensor = F.interpolate(
        img_tensor.unsqueeze(0), 
        size=(256, 256), 
        mode='bilinear'
    ).squeeze(0)
    img_tensor = img_tensor / 255.0
    
    # Generate mask
    with torch.no_grad():
        img_tensor = img_tensor.unsqueeze(0).to(device)
        output = model(img_tensor)
        mask = torch.sigmoid(output) > 0.5
        mask = mask.squeeze().cpu().numpy().astype(np.uint8) * 255
    
    return Image.fromarray(mask, mode='L')

def process_dataset(dataset_dir, checkpoint_path, output_dir):
    """
    Processes all images in dataset to generate masks.
    
    Why: Batch processing for efficiency.
    Creates mask directory (C) for each split.
    """
    model = load_segmentation_model(checkpoint_path)
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)
    
    for split in ['train', 'val', 'test']:
        input_dir = Path(dataset_dir) / split / 'A'
        output_mask_dir = Path(output_dir) / split / 'C'
        output_mask_dir.mkdir(parents=True, exist_ok=True)
        
        for img_path in input_dir.glob('*.jpg'):
            mask = generate_mask(img_path, model, device)
            mask.save(output_mask_dir / img_path.name)
            print(f"Generated mask for {img_path.name}")

if __name__ == "__main__":
    dataset_dir = "data/veneer_dataset"
    checkpoint_path = "ext/individual_tooth_segmentation/checkpoints/CP_teeth_seg.pth"
    output_dir = "data/veneer_dataset"
    
    process_dataset(dataset_dir, checkpoint_path, output_dir)
```

### Step 2: Inference Pipeline

**Why:** Combines segmentation and veneer generation in production.

**File: `ext/veneer_preview_generation/inference.py`**

```python
"""
Inference pipeline for veneer preview generation.
Why: Combines tooth segmentation with veneer generation
for end-to-end processing.
"""

import torch
from PIL import Image
import numpy as np
import sys
from pathlib import Path

# Import your segmentation model
sys.path.append('../individual_tooth_segmentation')
from src.network.teethSeg import TeethSegmentationNet

# Import pix2pix model
from models import create_model
from options.test_options import TestOptions

class VeneerPreviewGenerator:
    """
    End-to-end veneer preview generator.
    
    Why class-based:
    - Loads models once (efficient)
    - Encapsulates preprocessing/postprocessing
    - Easy to integrate into API
    """
    
    def __init__(self, segmentation_checkpoint, pix2pix_checkpoint, device='cuda'):
        self.device = torch.device(device if torch.cuda.is_available() else 'cpu')
        
        # Load segmentation model
        self.seg_model = TeethSegmentationNet()
        seg_state = torch.load(segmentation_checkpoint, map_location=self.device)
        self.seg_model.load_state_dict(seg_state['model_state_dict'])
        self.seg_model.to(self.device)
        self.seg_model.eval()
        
        # Load pix2pix model
        opt = TestOptions().parse()
        opt.checkpoints_dir = str(Path(pix2pix_checkpoint).parent)
        opt.name = Path(pix2pix_checkpoint).parent.name
        opt.model = 'pix2pix'
        opt.netG = 'unet_256'
        opt.use_masks = True
        
        self.pix2pix_model = create_model(opt)
        self.pix2pix_model.load_networks('latest')
        self.pix2pix_model.eval()
    
    def generate_mask(self, image):
        """
        Generates tooth segmentation mask.
        
        Why: First step - identifies teeth regions.
        """
        # Preprocess image
        img_tensor = self._preprocess_image(image)
        
        with torch.no_grad():
            output = self.seg_model(img_tensor)
            mask = torch.sigmoid(output) > 0.5
            mask = mask.squeeze().cpu().numpy().astype(np.uint8) * 255
        
        return Image.fromarray(mask, mode='L')
    
    def generate_veneer_preview(self, image, mask=None):
        """
        Generates veneer preview.
        
        Why: Main function - combines segmentation and generation.
        """
        # Generate mask if not provided
        if mask is None:
            mask = self.generate_mask(image)
        
        # Prepare input
        input_data = self._prepare_input(image, mask)
        
        # Generate veneer preview
        with torch.no_grad():
            self.pix2pix_model.set_input(input_data)
            self.pix2pix_model.test()
            result = self.pix2pix_model.get_current_visuals()['fake_B']
        
        # Post-process
        output_image = self._postprocess(result)
        
        return output_image
    
    def _preprocess_image(self, image):
        """Preprocesses image for segmentation model."""
        if isinstance(image, Image.Image):
            image = np.array(image)
        
        img_tensor = torch.from_numpy(image).permute(2, 0, 1).float()
        img_tensor = torch.nn.functional.interpolate(
            img_tensor.unsqueeze(0), 
            size=(256, 256), 
            mode='bilinear'
        ).squeeze(0) / 255.0
        
        return img_tensor.unsqueeze(0).to(self.device)
    
    def _prepare_input(self, image, mask):
        """Prepares input for pix2pix model."""
        # Resize to 256x256
        image = image.resize((256, 256), Image.LANCZOS)
        mask = mask.resize((256, 256), Image.LANCZOS)
        
        # Convert to tensors
        from data.base_dataset import get_transform
        from options.test_options import TestOptions
        
        opt = TestOptions().parse()
        transform = get_transform(opt, {}, grayscale=False)
        mask_transform = get_transform(opt, {}, grayscale=True)
        
        img_tensor = transform(image)
        mask_tensor = mask_transform(mask)
        
        return {
            'A': img_tensor.unsqueeze(0),
            'B': img_tensor.unsqueeze(0),  # Dummy, not used in test
            'C': mask_tensor.unsqueeze(0),
            'A_paths': ['input']
        }
    
    def _postprocess(self, tensor):
        """Converts model output to PIL Image."""
        # Denormalize
        img = tensor.squeeze().cpu().numpy()
        img = (img + 1) / 2.0  # [-1, 1] to [0, 1]
        img = np.clip(img, 0, 1)
        img = (img * 255).astype(np.uint8)
        img = np.transpose(img, (1, 2, 0))
        
        return Image.fromarray(img)

# Example usage
if __name__ == "__main__":
    generator = VeneerPreviewGenerator(
        segmentation_checkpoint="ext/individual_tooth_segmentation/checkpoints/CP_teeth_seg.pth",
        pix2pix_checkpoint="ext/veneer_preview_generation/checkpoints/veneer_pix2pix/latest_net_G.pth"
    )
    
    input_image = Image.open("path/to/smile_image.jpg")
    preview = generator.generate_veneer_preview(input_image)
    preview.save("veneer_preview.jpg")
```

---

## API Integration

### Step 1: Python Service Wrapper

**Why:** Creates a service layer that can be called from your Express backend.

**File: `services/veneer-preview/veneer_service.py`**

```python
"""
Veneer preview service for API integration.
Why: Wraps the inference pipeline in a service that can be
called from your Express backend.
"""

import base64
import io
from PIL import Image
from pathlib import Path
import sys

# Add paths
sys.path.append(str(Path(__file__).parent.parent.parent / 'ext' / 'veneer_preview_generation'))
from inference import VeneerPreviewGenerator

class VeneerPreviewService:
    """
    Service class for veneer preview generation.
    
    Why service pattern:
    - Loads models once (singleton)
    - Handles image format conversion
    - Easy error handling
    - Can be called from multiple API endpoints
    """
    
    def __init__(self):
        """Initialize service with model paths."""
        self.generator = None
        self._initialize_generator()
    
    def _initialize_generator(self):
        """
        Lazy initialization of generator.
        
        Why: Models are large - only load when needed.
        Can add caching/reloading logic here.
        """
        if self.generator is None:
            seg_checkpoint = Path(__file__).parent.parent.parent / \
                "ext/individual_tooth_segmentation/checkpoints/CP_teeth_seg.pth"
            pix2pix_checkpoint = Path(__file__).parent.parent.parent / \
                "ext/veneer_preview_generation/checkpoints/veneer_pix2pix/latest_net_G.pth"
            
            self.generator = VeneerPreviewGenerator(
                str(seg_checkpoint),
                str(pix2pix_checkpoint)
            )
    
    def generate_from_base64(self, base64_image, shade=None):
        """
        Generates veneer preview from base64 encoded image.
        
        Why: Your frontend sends base64 images.
        This converts and processes them.
        
        Args:
            base64_image: Base64 encoded image string
            shade: Optional veneer shade (for future multi-model support)
        
        Returns:
            Base64 encoded preview image
        """
        try:
            # Decode base64 image
            image_data = base64.b64decode(base64_image.split(',')[1])
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
            
            # Generate preview
            preview = self.generator.generate_veneer_preview(image)
            
            # Convert back to base64
            buffer = io.BytesIO()
            preview.save(buffer, format='JPEG', quality=95)
            preview_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            
            return f"data:image/jpeg;base64,{preview_base64}"
        
        except Exception as e:
            raise Exception(f"Error generating veneer preview: {str(e)}")
    
    def generate_from_file(self, file_path, output_path=None):
        """
        Generates veneer preview from file path.
        
        Why: Alternative interface for file-based processing.
        Useful for batch processing or testing.
        """
        image = Image.open(file_path).convert('RGB')
        preview = self.generator.generate_veneer_preview(image)
        
        if output_path:
            preview.save(output_path)
        
        return preview

# Singleton instance
_veneer_service = None

def get_veneer_service():
    """
    Gets singleton instance of veneer service.
    
    Why singleton:
    - Models are expensive to load
    - Only one instance needed
    - Shared across requests
    """
    global _veneer_service
    if _veneer_service is None:
        _veneer_service = VeneerPreviewService()
    return _veneer_service
```

### Step 2: Express API Endpoint

**Why:** Integrates Python service with your existing Express backend.

**File: `VeneerApp-main/backend/services/veneer-preview-api.js`**

```javascript
/**
 * Express API endpoint for veneer preview generation.
 * Why: Replaces Replicate API calls with local model inference.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

/**
 * Calls Python service to generate veneer preview.
 * 
 * Why Python subprocess:
 * - Your models are in Python (PyTorch)
 * - Express is Node.js
 * - Spawn Python process to run inference
 * 
 * Alternative: Use Python HTTP server (Flask/FastAPI) and call via HTTP
 */
async function generateVeneerPreview(imageBase64, shade = null) {
  return new Promise((resolve, reject) => {
    // Path to Python service script
    const pythonScript = path.join(
      __dirname,
      '../../services/veneer-preview/veneer_api_server.py'
    );
    
    // Spawn Python process
    const python = spawn('python3', [pythonScript, imageBase64, shade || '']);
    
    let output = '';
    let error = '';
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process failed: ${error}`));
        return;
      }
      
      try {
        const result = JSON.parse(output);
        resolve(result.preview);
      } catch (e) {
        reject(new Error(`Failed to parse result: ${output}`));
      }
    });
  });
}

/**
 * Express route handler.
 * Why: Drop-in replacement for Replicate API endpoint.
 */
async function handleVeneerPreview(req, res) {
  try {
    const { image, shade } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }
    
    // Generate preview
    const preview = await generateVeneerPreview(image, shade);
    
    // Return in same format as Replicate API
    res.json({ output: [preview] });
    
  } catch (error) {
    console.error('Veneer preview error:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { handleVeneerPreview, generateVeneerPreview };
```

### Step 3: Python API Server (Alternative)

**Why:** More efficient than subprocess - runs as persistent server.

**File: `services/veneer-preview/veneer_api_server.py`**

```python
"""
Python HTTP server for veneer preview generation.
Why: More efficient than subprocess - models stay loaded in memory.
Can handle multiple requests without reloading.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
from pathlib import Path

# Add service path
sys.path.append(str(Path(__file__).parent))
from veneer_service import get_veneer_service

app = Flask(__name__)
CORS(app)  # Allow requests from your frontend

# Initialize service (loads models)
service = get_veneer_service()

@app.route('/api/veneer-preview', methods=['POST'])
def generate_preview():
    """
    API endpoint for veneer preview generation.
    
    Why REST API:
    - Standard HTTP interface
    - Easy to call from Express
    - Can add authentication/rate limiting
    """
    try:
        data = request.json
        image_base64 = data.get('image')
        shade = data.get('shade')
        
        if not image_base64:
            return jsonify({'error': 'Image is required'}), 400
        
        # Generate preview
        preview = service.generate_from_base64(image_base64, shade)
        
        return jsonify({
            'output': [preview],
            'success': True
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

if __name__ == '__main__':
    # Run on port 5001 (different from Express on 3000)
    app.run(host='0.0.0.0', port=5001, debug=False)
```

### Step 4: Update Express Backend

**Why:** Replace Replicate API calls with local service.

**File: `VeneerApp-main/backend/index.js` (modifications)**

```javascript
// Add at top
const axios = require('axios');
const { handleVeneerPreview } = require('./services/veneer-preview-api');

// Replace the /api/simulate endpoint
app.post('/api/simulate', async (req, res) => {
  const { image, prompt, negative_prompt, num_outputs = 1 } = req.body;

  // Input validation
  if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Invalid image format' });
  }

  try {
    // Option 1: Call Python subprocess (slower, simpler)
    // const preview = await generateVeneerPreview(image);
    
    // Option 2: Call Python HTTP server (faster, recommended)
    const response = await axios.post('http://localhost:5001/api/veneer-preview', {
      image: image,
      shade: prompt || null
    });
    
    // Return in same format as before (for frontend compatibility)
    return res.json({ output: response.data.output });
    
  } catch (error) {
    console.error('Veneer preview error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to generate veneer preview' 
    });
  }
});
```

---

## Testing & Validation

### Step 1: Test Dataset Evaluation

**Why:** Measure model performance before deployment.

**File: `scripts/evaluate_veneer_model.py`**

```python
"""
Evaluates veneer preview model on test set.
Why: Quantifies model performance with metrics:
- PSNR (Peak Signal-to-Noise Ratio)
- SSIM (Structural Similarity Index)
- LPIPS (Learned Perceptual Image Patch Similarity)
"""

import torch
from torchmetrics.image import PeakSignalNoiseRatio, StructuralSimilarityIndexMeasure
from pathlib import Path
from PIL import Image
import numpy as np
from inference import VeneerPreviewGenerator

def evaluate_model(generator, test_dir, device='cuda'):
    """
    Evaluates model on test set.
    
    Why evaluation:
    - Measures how close generated images are to ground truth
    - Identifies areas for improvement
    - Tracks progress during training
    """
    test_images = sorted((Path(test_dir) / 'A').glob('*.jpg'))
    test_targets = sorted((Path(test_dir) / 'B').glob('*.jpg'))
    
    psnr_metric = PeakSignalNoiseRatio().to(device)
    ssim_metric = StructuralSimilarityIndexMeasure().to(device)
    
    psnr_scores = []
    ssim_scores = []
    
    for img_path, target_path in zip(test_images, test_targets):
        # Load images
        input_img = Image.open(img_path).convert('RGB')
        target_img = Image.open(target_path).convert('RGB')
        
        # Generate preview
        preview = generator.generate_veneer_preview(input_img)
        
        # Convert to tensors for metrics
        preview_tensor = torch.from_numpy(
            np.array(preview)
        ).permute(2, 0, 1).float().unsqueeze(0) / 255.0
        target_tensor = torch.from_numpy(
            np.array(target_img)
        ).permute(2, 0, 1).float().unsqueeze(0) / 255.0
        
        # Calculate metrics
        psnr = psnr_metric(preview_tensor, target_tensor)
        ssim = ssim_metric(preview_tensor, target_tensor)
        
        psnr_scores.append(psnr.item())
        ssim_scores.append(ssim.item())
    
    return {
        'psnr_mean': np.mean(psnr_scores),
        'psnr_std': np.std(psnr_scores),
        'ssim_mean': np.mean(ssim_scores),
        'ssim_std': np.std(ssim_scores)
    }

if __name__ == "__main__":
    generator = VeneerPreviewGenerator(
        "ext/individual_tooth_segmentation/checkpoints/CP_teeth_seg.pth",
        "ext/veneer_preview_generation/checkpoints/veneer_pix2pix/latest_net_G.pth"
    )
    
    results = evaluate_model(generator, "data/veneer_dataset/test")
    print(f"PSNR: {results['psnr_mean']:.2f} ± {results['psnr_std']:.2f}")
    print(f"SSIM: {results['ssim_mean']:.4f} ± {results['ssim_std']:.4f}")
```

### Step 2: Visual Quality Assessment

**Why:** Automated visual inspection of results.

**File: `scripts/visual_inspection.py`**

```python
"""
Creates side-by-side comparison images.
Why: Visual inspection is crucial for dental applications.
Helps identify artifacts, misalignments, etc.
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
from inference import VeneerPreviewGenerator

def create_comparison(input_path, output_dir):
    """
    Creates before/after/generated comparison.
    
    Why: Visual inspection helps catch:
    - Unnatural colors
    - Misaligned veneers
    - Artifacts
    - Quality issues
    """
    generator = VeneerPreviewGenerator(
        "ext/individual_tooth_segmentation/checkpoints/CP_teeth_seg.pth",
        "ext/veneer_preview_generation/checkpoints/veneer_pix2pix/latest_net_G.pth"
    )
    
    input_img = Image.open(input_path).convert('RGB')
    preview = generator.generate_veneer_preview(input_img)
    
    # Create side-by-side comparison
    width, height = input_img.size
    comparison = Image.new('RGB', (width * 2, height))
    comparison.paste(input_img, (0, 0))
    comparison.paste(preview, (width, 0))
    
    # Add labels
    draw = ImageDraw.Draw(comparison)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
    except:
        font = ImageFont.load_default()
    
    draw.text((10, 10), "Before", fill=(255, 255, 255), font=font)
    draw.text((width + 10, 10), "Generated", fill=(255, 255, 255), font=font)
    
    comparison.save(Path(output_dir) / f"comparison_{Path(input_path).stem}.jpg")

if __name__ == "__main__":
    create_comparison("path/to/test_image.jpg", "results/comparisons")
```

---

## Deployment Strategy

### Step 1: Model Optimization

**Why:** Reduce model size and inference time for production.

**File: `scripts/optimize_model.py`**

```python
"""
Optimizes model for production deployment.
Why: Reduces model size and speeds up inference.
"""

import torch
from torch.utils.mobile import optimize_for_mobile

def optimize_pix2pix_model(checkpoint_path, output_path):
    """
    Optimizes pix2pix model for deployment.
    
    Why optimization:
    - Smaller file size (faster loading)
    - Faster inference
    - Lower memory usage
    - Can use TorchScript for deployment
    """
    # Load model
    from models.networks import define_G
    opt = type('Args', (), {
        'netG': 'unet_256',
        'ngf': 64,
        'input_nc': 4,  # RGB + mask
        'output_nc': 3
    })()
    
    model = define_G(opt.input_nc, opt.output_nc, opt.ngf, opt.netG, 'batch', False, 'normal', 0.02, [0])
    checkpoint = torch.load(checkpoint_path, map_location='cpu')
    model.load_state_dict(checkpoint)
    model.eval()
    
    # Create example input
    example_input = torch.rand(1, 4, 256, 256)
    
    # Trace model
    traced_model = torch.jit.trace(model, example_input)
    
    # Optimize for mobile (also works for server)
    optimized_model = optimize_for_mobile(traced_model)
    
    # Save
    optimized_model._save_for_lite_interpreter(output_path)
    print(f"Optimized model saved to {output_path}")

if __name__ == "__main__":
    optimize_pix2pix_model(
        "checkpoints/veneer_pix2pix/latest_net_G.pth",
        "checkpoints/veneer_pix2pix/optimized.ptl"
    )
```

### Step 2: Docker Container

**Why:** Consistent deployment environment.

**File: `Dockerfile.veneer-service`**

```dockerfile
# Dockerfile for veneer preview service
# Why: Ensures consistent environment across deployments

FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements
COPY services/veneer-preview/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy service code
COPY services/veneer-preview/ ./services/veneer-preview/
COPY ext/ ./ext/

# Copy models (or mount as volume)
COPY ext/veneer_preview_generation/checkpoints/ ./checkpoints/

# Expose port
EXPOSE 5001

# Run service
CMD ["python", "services/veneer-preview/veneer_api_server.py"]
```

### Step 3: AWS Lambda Deployment (Optional)

**Why:** Serverless deployment for cost efficiency.

**File: `serverless/veneer-preview-lambda.py`**

```python
"""
AWS Lambda handler for veneer preview generation.
Why: Serverless deployment - pay per request.
Good for variable traffic.
"""

import json
import base64
import boto3
from inference import VeneerPreviewGenerator

# Initialize generator (Lambda keeps it warm)
generator = None

def lambda_handler(event, context):
    """
    Lambda handler function.
    
    Why Lambda:
    - Auto-scaling
    - Pay per request
    - No server management
    """
    global generator
    
    # Lazy load (Lambda containers are reused)
    if generator is None:
        # Load from S3 or EFS
        generator = VeneerPreviewGenerator(
            "/mnt/efs/models/segmentation.pth",
            "/mnt/efs/models/pix2pix.pth"
        )
    
    try:
        # Parse request
        body = json.loads(event['body'])
        image_base64 = body['image']
        
        # Generate preview
        preview = generator.generate_from_base64(image_base64)
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'output': [preview],
                'success': True
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'success': False
            })
        }
```

---

## Performance Optimization

### Step 1: Caching Strategy

**Why:** Avoid regenerating previews for same images.

**File: `services/veneer-preview/cache.py`**

```python
"""
Caching layer for veneer previews.
Why: Avoids redundant computation for same/similar images.
"""

import hashlib
import json
from pathlib import Path
from PIL import Image
import base64

class PreviewCache:
    """
    Simple file-based cache for veneer previews.
    
    Why caching:
    - Same image = same preview (deterministic)
    - Faster response for repeated requests
    - Reduces GPU usage
    """
    
    def __init__(self, cache_dir="cache/veneer_previews"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
    
    def _get_cache_key(self, image_base64, shade=None):
        """Generates cache key from image and shade."""
        key_data = image_base64 + (shade or '')
        return hashlib.md5(key_data.encode()).hexdigest()
    
    def get(self, image_base64, shade=None):
        """Gets cached preview if exists."""
        key = self._get_cache_key(image_base64, shade)
        cache_file = self.cache_dir / f"{key}.json"
        
        if cache_file.exists():
            with open(cache_file) as f:
                return json.load(f)['preview']
        
        return None
    
    def set(self, image_base64, preview, shade=None):
        """Caches preview."""
        key = self._get_cache_key(image_base64, shade)
        cache_file = self.cache_dir / f"{key}.json"
        
        with open(cache_file, 'w') as f:
            json.dump({'preview': preview}, f)

# Usage in service
cache = PreviewCache()

def generate_with_cache(image_base64, shade=None):
    # Check cache first
    cached = cache.get(image_base64, shade)
    if cached:
        return cached
    
    # Generate if not cached
    preview = service.generate_from_base64(image_base64, shade)
    cache.set(image_base64, preview, shade)
    
    return preview
```

### Step 2: Batch Processing

**Why:** Process multiple images efficiently.

**File: `scripts/batch_process.py`**

```python
"""
Batch processing for multiple images.
Why: More efficient GPU utilization.
"""

from pathlib import Path
from inference import VeneerPreviewGenerator
from concurrent.futures import ThreadPoolExecutor
import torch

def process_batch(image_paths, output_dir, batch_size=4):
    """
    Processes images in batches.
    
    Why batching:
    - Better GPU utilization
    - Faster overall processing
    - Can parallelize with multiple GPUs
    """
    generator = VeneerPreviewGenerator(...)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Process in batches
    for i in range(0, len(image_paths), batch_size):
        batch = image_paths[i:i+batch_size]
        
        # Process batch (can parallelize)
        with ThreadPoolExecutor(max_workers=batch_size) as executor:
            futures = []
            for img_path in batch:
                future = executor.submit(
                    generator.generate_veneer_preview,
                    Image.open(img_path)
                )
                futures.append((img_path, future))
            
            # Save results
            for img_path, future in futures:
                preview = future.result()
                preview.save(output_path / f"{Path(img_path).stem}_preview.jpg")

if __name__ == "__main__":
    image_dir = Path("data/test_images")
    image_paths = list(image_dir.glob("*.jpg"))
    process_batch(image_paths, "results/batch_previews")
```

---

## Summary & Next Steps

### Implementation Checklist

- [ ] **Phase 1: Data Preparation** (Week 1)
  - [ ] Organize before/after image pairs
  - [ ] Run data preparation script
  - [ ] Generate segmentation masks for training data
  - [ ] Split into train/val/test sets
  - [ ] Apply data augmentation

- [ ] **Phase 2: Model Training** (Week 2-3)
  - [ ] Set up pix2pix repository
  - [ ] Create custom dataset class
  - [ ] Modify generator for mask conditioning
  - [ ] Train initial model
  - [ ] Evaluate on test set
  - [ ] Fine-tune hyperparameters

- [ ] **Phase 3: Integration** (Week 4)
  - [ ] Create inference pipeline
  - [ ] Integrate with tooth segmentation
  - [ ] Build Python service
  - [ ] Create Express API endpoint
  - [ ] Test end-to-end flow

- [ ] **Phase 4: Deployment** (Week 5)
  - [ ] Optimize models
  - [ ] Set up Docker container
  - [ ] Deploy to AWS/cloud
  - [ ] Add caching layer
  - [ ] Monitor performance

### Expected Results

- **Training Time**: 2-3 days on GPU (depending on dataset size)
- **Inference Time**: ~0.5-1 second per image (on GPU)
- **Model Size**: ~100-200 MB (compressed)
- **Accuracy**: PSNR > 25 dB, SSIM > 0.85 (target metrics)

### Key Benefits

1. **Cost Savings**: No API fees after initial setup
2. **Privacy**: All processing stays local
3. **Customization**: Can fine-tune for specific veneer styles
4. **Integration**: Works with your tooth segmentation
5. **Scalability**: Can deploy on-premise or cloud

### Troubleshooting Tips

- **Poor Quality Results**: Increase training epochs, add more data, adjust `lambda_L1`
- **Slow Inference**: Use GPU, optimize model, implement caching
- **Memory Issues**: Reduce batch size, use gradient checkpointing
- **Artifacts**: Increase `lambda_L1`, add post-processing, check data quality

---

## Additional Resources

- [pix2pix Paper](https://arxiv.org/abs/1611.07004)
- [pytorch-CycleGAN-and-pix2pix Repository](https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix)
- [PyTorch Documentation](https://pytorch.org/docs/stable/index.html)
- [Image-to-Image Translation Tutorial](https://pytorch.org/tutorials/beginner/dcgan_faces_tutorial.html)

---

**Good luck with your implementation!** 🦷✨

