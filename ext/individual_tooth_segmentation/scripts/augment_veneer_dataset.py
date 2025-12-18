from PIL import Image, ImageEnhance
import numpy as np
import random
from pathlib import Path

def augment_pair(before_img, after_img):
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