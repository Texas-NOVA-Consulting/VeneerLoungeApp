"""
Train ControlNet for veneer preview generation.

This script fine-tunes a ControlNet model on the veneer dataset.
ControlNet learns to transform "before" teeth images to "after" images
while being guided by segmentation masks and edge maps.

Key features:
- Fine-tunes from pretrained Stable Diffusion
- Uses tooth segmentation as conditioning
- Supports multi-GPU training with accelerate
- Includes validation and checkpointing
"""

import argparse
import logging
import math
import os
from pathlib import Path
import json

import torch
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
from tqdm.auto import tqdm

from diffusers import (
    ControlNetModel,
    StableDiffusionControlNetInpaintPipeline,
    UNet2DConditionModel,
    DDPMScheduler,
    AutoencoderKL
)
from diffusers.optimization import get_scheduler
from transformers import CLIPTextModel, CLIPTokenizer
from accelerate import Accelerator
from accelerate.logging import get_logger
from accelerate.utils import set_seed


logger = get_logger(__name__)


class VeneerControlNetDataset(Dataset):
    """
    Dataset for ControlNet veneer training.

    Loads:
    - Source images (before)
    - Target images (after)
    - Conditioning images (masks + edges)
    - Text prompts
    """
    def __init__(
        self,
        data_root,
        split='train',
        resolution=512,
        center_crop=True
    ):
        """
        Initialize dataset
        Args:
            data_root: Root directory with source/target/conditioning folders
            split: Dataset split ('train', 'val', 'test')
            resolution: Image resolution
            center_crop: Whether to center crop images
        """
        self.data_root = Path(data_root) / split
        self.resolution = resolution
        self.center_crop = center_crop

        # Load metadata
        metadata_path = self.data_root / 'metadata.jsonl'
        self.metadata = []
        with open(metadata_path, 'r') as f:
            for line in f:
                self.metadata.append(json.loads(line))
        self.transform = transforms.Compose([
            transforms.Resize(resolution, interpolation=transforms.InterpolationMode.BILINEAR),
            transforms.CenterCrop(resolution) if center_crop else transforms.Lambda(lambda x: x),
            transforms.ToTensor(),
            transforms.Normalize([0.5], [0.5])
        ])
        self.condition_transform = transforms.Compose([
            transforms.Resize(resolution, interpolation=transforms.InterpolationMode.BILINEAR),
            transforms.CenterCrop(resolution) if center_crop else transforms.Lambda(lambda x: x),
            transforms.ToTensor(),
        ])

    def __len__(self):
        return len(self.metadata)

    def __getitem__(self, idx):
        """Get one training sample."""
        item = self.metadata[idx]

        # Load images
        source_path = self.data_root / item['source']
        target_path = self.data_root / item['target']
        condition_path = self.data_root / item['conditioning_image']

        source_img = Image.open(source_path).convert('RGB')
        target_img = Image.open(target_path).convert('RGB')
        condition_img = Image.open(condition_path).convert('RGB')

        # Apply transforms
        source = self.transform(source_img)
        target = self.transform(target_img)
        conditioning = self.condition_transform(condition_img)

        # Get prompt
        prompt = item['text']

        return {
            'source': source,
            'target': target,
            'conditioning': conditioning,
            'prompt': prompt
        }


def collate_fn(examples):
    """Collate function for dataloader."""
    sources = torch.stack([example['source'] for example in examples])
    targets = torch.stack([example['target'] for example in examples])
    conditionings = torch.stack([example['conditioning'] for example in examples])
    prompts = [example['prompt'] for example in examples]

    return {
        'sources': sources,
        'targets': targets,
        'conditionings': conditionings,
        'prompts': prompts
    }


def train_controlnet(args):
    """Main training function."""

    # Setup accelerator
    accelerator = Accelerator(
        gradient_accumulation_steps=args.gradient_accumulation_steps,
        mixed_precision=args.mixed_precision,
    )

    # Setup logging
    logging.basicConfig(
        format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        datefmt="%m/%d/%Y %H:%M:%S",
        level=logging.INFO,
    )
    logger.info(accelerator.state)

    # Set seed
    if args.seed is not None:
        set_seed(args.seed)

    # Create output directory
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Load pretrained models
    logger.info(f"Loading pretrained models from {args.pretrained_model_name_or_path}")

    # Tokenizer and text encoder
    tokenizer = CLIPTokenizer.from_pretrained(
        args.pretrained_model_name_or_path,
        subfolder="tokenizer"
    )
    text_encoder = CLIPTextModel.from_pretrained(
        args.pretrained_model_name_or_path,
        subfolder="text_encoder"
    )

    # VAE
    vae = AutoencoderKL.from_pretrained(
        args.pretrained_model_name_or_path,
        subfolder="vae"
    )

    # UNet
    unet = UNet2DConditionModel.from_pretrained(
        args.pretrained_model_name_or_path,
        subfolder="unet"
    )

    # ControlNet - initialize from UNet
    logger.info("Initializing ControlNet from UNet")
    controlnet = ControlNetModel.from_unet(unet)

    # Freeze vae and text_encoder
    vae.requires_grad_(False)
    text_encoder.requires_grad_(False)
    unet.requires_grad_(False)

    # Only train ControlNet
    controlnet.train()

    # Create dataset
    train_dataset = VeneerControlNetDataset(
        data_root=args.data_root,
        split='train',
        resolution=args.resolution,
        center_crop=args.center_crop
    )

    # Create dataloader
    train_dataloader = DataLoader(
        train_dataset,
        batch_size=args.train_batch_size,
        shuffle=True,
        collate_fn=collate_fn,
        num_workers=args.dataloader_num_workers,
    )

    # Optimizer
    optimizer = torch.optim.AdamW(
        controlnet.parameters(),
        lr=args.learning_rate,
        betas=(args.adam_beta1, args.adam_beta2),
        weight_decay=args.adam_weight_decay,
        eps=args.adam_epsilon,
    )

    # Scheduler
    lr_scheduler = get_scheduler(
        args.lr_scheduler,
        optimizer=optimizer,
        num_warmup_steps=args.lr_warmup_steps,
        num_training_steps=args.max_train_steps,
    )

    # Noise scheduler
    noise_scheduler = DDPMScheduler.from_pretrained(
        args.pretrained_model_name_or_path,
        subfolder="scheduler"
    )

    # Prepare with accelerator
    controlnet, optimizer, train_dataloader, lr_scheduler = accelerator.prepare(
        controlnet, optimizer, train_dataloader, lr_scheduler
    )

    # Move models to device
    vae.to(accelerator.device)
    text_encoder.to(accelerator.device)
    unet.to(accelerator.device)

    # Training loop
    logger.info("***** Running training *****")
    logger.info(f"  Num examples = {len(train_dataset)}")
    logger.info(f"  Num Epochs = {args.num_train_epochs}")
    logger.info(f"  Batch size = {args.train_batch_size}")
    logger.info(f"  Gradient Accumulation steps = {args.gradient_accumulation_steps}")
    logger.info(f"  Total optimization steps = {args.max_train_steps}")

    global_step = 0
    progress_bar = tqdm(range(args.max_train_steps), disable=not accelerator.is_local_main_process)

    for epoch in range(args.num_train_epochs):
        for step, batch in enumerate(train_dataloader):
            with accelerator.accumulate(controlnet):
                # Encode conditioning images
                controlnet_image = batch['conditionings'].to(accelerator.device)

                # Convert target images to latent space
                latents = vae.encode(batch['targets']).latent_dist.sample()
                latents = latents * vae.config.scaling_factor

                # Sample noise
                noise = torch.randn_like(latents)
                bsz = latents.shape[0]

                # Sample timesteps
                timesteps = torch.randint(
                    0, noise_scheduler.config.num_train_timesteps, (bsz,),
                    device=latents.device
                )
                timesteps = timesteps.long()

                # Add noise to latents
                noisy_latents = noise_scheduler.add_noise(latents, noise, timesteps)

                # Get text embeddings
                encoder_hidden_states = text_encoder(
                    tokenizer(
                        batch['prompts'],
                        padding="max_length",
                        max_length=tokenizer.model_max_length,
                        truncation=True,
                        return_tensors="pt"
                    ).input_ids.to(accelerator.device)
                )[0]

                # Get ControlNet conditioning
                down_block_res_samples, mid_block_res_sample = controlnet(
                    noisy_latents,
                    timesteps,
                    encoder_hidden_states=encoder_hidden_states,
                    controlnet_cond=controlnet_image,
                    return_dict=False,
                )

                # Predict noise with UNet
                model_pred = unet(
                    noisy_latents,
                    timesteps,
                    encoder_hidden_states=encoder_hidden_states,
                    down_block_additional_residuals=down_block_res_samples,
                    mid_block_additional_residual=mid_block_res_sample,
                ).sample

                # Calculate loss
                loss = F.mse_loss(model_pred.float(), noise.float(), reduction="mean")

                # Backprop
                accelerator.backward(loss)
                if accelerator.sync_gradients:
                    accelerator.clip_grad_norm_(controlnet.parameters(), args.max_grad_norm)
                optimizer.step()
                lr_scheduler.step()
                optimizer.zero_grad()

            # Update progress
            if accelerator.sync_gradients:
                progress_bar.update(1)
                global_step += 1

                # Log
                if global_step % args.logging_steps == 0:
                    logger.info(f"Step {global_step}, Loss: {loss.detach().item():.4f}")

                # Save checkpoint
                if global_step % args.checkpointing_steps == 0:
                    save_path = output_dir / f"checkpoint-{global_step}"
                    accelerator.save_state(save_path)
                    logger.info(f"Saved checkpoint to {save_path}")

            if global_step >= args.max_train_steps:
                break

    # Save final model
    accelerator.wait_for_everyone()
    if accelerator.is_main_process:
        controlnet = accelerator.unwrap_model(controlnet)
        controlnet.save_pretrained(output_dir / "controlnet")
        logger.info(f"Training complete! Model saved to {output_dir}")

    accelerator.end_training()


def main():
    """Parse arguments and start training."""
    parser = argparse.ArgumentParser()

    # Model arguments
    parser.add_argument(
        "--pretrained_model_name_or_path",
        type=str,
        default="runwayml/stable-diffusion-v1-5",
        help="Path to pretrained model or model identifier from huggingface.co/models"
    )
    parser.add_argument(
        "--data_root",
        type=str,
        required=True,
        help="Path to ControlNet-format dataset"
    )
    parser.add_argument(
        "--output_dir",
        type=str,
        default="../../checkpoints/controlnet",
        help="Output directory for checkpoints"
    )

    # Training arguments
    parser.add_argument("--resolution", type=int, default=512)
    parser.add_argument("--center_crop", action="store_true")
    parser.add_argument("--train_batch_size", type=int, default=4)
    parser.add_argument("--num_train_epochs", type=int, default=100)
    parser.add_argument("--max_train_steps", type=int, default=10000)
    parser.add_argument("--gradient_accumulation_steps", type=int, default=1)
    parser.add_argument("--learning_rate", type=float, default=1e-5)
    parser.add_argument("--lr_scheduler", type=str, default="constant")
    parser.add_argument("--lr_warmup_steps", type=int, default=500)
    parser.add_argument("--adam_beta1", type=float, default=0.9)
    parser.add_argument("--adam_beta2", type=float, default=0.999)
    parser.add_argument("--adam_weight_decay", type=float, default=1e-2)
    parser.add_argument("--adam_epsilon", type=float, default=1e-08)
    parser.add_argument("--max_grad_norm", type=float, default=1.0)
    parser.add_argument("--mixed_precision", type=str, default="fp16", choices=["no", "fp16", "bf16"])
    parser.add_argument("--dataloader_num_workers", type=int, default=0)
    parser.add_argument("--logging_steps", type=int, default=10)
    parser.add_argument("--checkpointing_steps", type=int, default=500)
    parser.add_argument("--seed", type=int, default=42)

    args = parser.parse_args()
    if args.max_train_steps is None:
        args.max_train_steps = args.num_train_epochs * 100

    train_controlnet(args)


if __name__ == "__main__":
    main()
