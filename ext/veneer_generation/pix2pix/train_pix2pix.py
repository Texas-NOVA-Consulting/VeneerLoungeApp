"""
Training script for Pix2pix veneer generation model.

This script trains both the generator and discriminator networks
using the pix2pix adversarial loss with L1 reconstruction loss.
"""

import os
import argparse
from pathlib import Path
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.tensorboard import SummaryWriter
from tqdm import tqdm
import time

# Import our models and dataset
import sys
sys.path.append(str(Path(__file__).parent))
from models.networks import define_generator, define_discriminator
from data.veneer_dataset import create_dataloader


class GANLoss(nn.Module):
    """
    GAN loss for pix2pix.

    Uses either vanilla GAN loss or LSGAN (least squares GAN) loss.
    LSGAN is more stable and produces better results.
    """

    def __init__(self, gan_mode='lsgan', target_real_label=1.0, target_fake_label=0.0):
        """
        Args:
            gan_mode: Type of GAN loss ('vanilla' or 'lsgan')
            target_real_label: Label for real images
            target_fake_label: Label for fake images
        """
        super(GANLoss, self).__init__()
        self.register_buffer('real_label', torch.tensor(target_real_label))
        self.register_buffer('fake_label', torch.tensor(target_fake_label))
        self.gan_mode = gan_mode

        if gan_mode == 'lsgan':
            self.loss = nn.MSELoss()
        elif gan_mode == 'vanilla':
            self.loss = nn.BCEWithLogitsLoss()
        else:
            raise NotImplementedError(f'gan mode {gan_mode} not implemented')

    def get_target_tensor(self, prediction, target_is_real):
        """
        Create target tensor with same size as prediction.

        Args:
            prediction: Discriminator prediction
            target_is_real: Whether target should be real or fake

        Returns:
            Target tensor
        """
        if target_is_real:
            target_tensor = self.real_label
        else:
            target_tensor = self.fake_label
        return target_tensor.expand_as(prediction)

    def forward(self, prediction, target_is_real):
        """
        Calculate GAN loss.

        Args:
            prediction: Discriminator prediction
            target_is_real: Whether target is real

        Returns:
            Calculated loss
        """
        target_tensor = self.get_target_tensor(prediction, target_is_real)
        loss = self.loss(prediction, target_tensor)
        return loss


class Pix2PixTrainer:
    """
    Trainer class for Pix2pix model.

    Handles:
    - Model initialization
    - Training loop
    - Optimization
    - Checkpointing
    - Progress tracking
    """

    def __init__(self, args):
        self.args = args
        self.device = torch.device('cuda' if torch.cuda.is_available() and not args.cpu else 'cpu')

        # Create output directories
        self.checkpoint_dir = Path(args.checkpoint_dir)
        self.checkpoint_dir.mkdir(parents=True, exist_ok=True)
        self.log_dir = Path(args.log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)

        # Initialize tensorboard
        self.writer = SummaryWriter(log_dir=str(self.log_dir))

        # Build model
        print(f"Initializing models on {self.device}...")
        self.netG = define_generator(
            input_nc=args.input_nc,
            output_nc=args.output_nc,
            ngf=args.ngf,
            device=self.device
        )
        self.netD = define_discriminator(
            input_nc=args.input_nc + args.output_nc,  # Concatenate input and output
            ndf=args.ndf,
            device=self.device
        )

        # Define loss functions
        self.criterionGAN = GANLoss(gan_mode='lsgan').to(self.device)
        self.criterionL1 = nn.L1Loss()

        # Optimizers
        self.optimizer_G = optim.Adam(
            self.netG.parameters(),
            lr=args.lr,
            betas=(args.beta1, 0.999)
        )
        self.optimizer_D = optim.Adam(
            self.netD.parameters(),
            lr=args.lr,
            betas=(args.beta1, 0.999)
        )

        # Learning rate schedulers
        self.scheduler_G = optim.lr_scheduler.LinearLR(
            self.optimizer_G,
            start_factor=1.0,
            end_factor=0.0,
            total_iters=args.n_epochs
        )
        self.scheduler_D = optim.lr_scheduler.LinearLR(
            self.optimizer_D,
            start_factor=1.0,
            end_factor=0.0,
            total_iters=args.n_epochs
        )

        # Load checkpoint if resuming
        self.start_epoch = 0
        if args.resume:
            self.load_checkpoint(args.resume)

        print(f"✓ Models initialized")
        self._print_network_info()

    def _print_network_info(self):
        """Print network architecture information."""
        gen_params = sum(p.numel() for p in self.netG.parameters())
        disc_params = sum(p.numel() for p in self.netD.parameters())
        print(f"  Generator parameters: {gen_params:,}")
        print(f"  Discriminator parameters: {disc_params:,}")

    def train_epoch(self, dataloader, epoch):
        """
        Train for one epoch.

        Args:
            dataloader: Training data loader
            epoch: Current epoch number
        """
        self.netG.train()
        self.netD.train()

        epoch_start_time = time.time()
        iter_data_time = time.time()

        # Metrics for logging
        losses_G = []
        losses_D = []
        losses_G_GAN = []
        losses_G_L1 = []

        pbar = tqdm(dataloader, desc=f'Epoch {epoch}/{self.args.n_epochs}')

        for i, data in enumerate(pbar):
            iter_start_time = time.time()

            # Get data
            real_A = data['A'].to(self.device)  # Before images
            real_B = data['B'].to(self.device)  # After images (target)

            # ==================
            # Train Generator
            # ==================
            self.optimizer_G.zero_grad()

            # Generate fake image
            fake_B = self.netG(real_A)

            # GAN loss
            pred_fake = self.netD(real_A, fake_B)
            loss_G_GAN = self.criterionGAN(pred_fake, True)

            # L1 loss (reconstruction)
            loss_G_L1 = self.criterionL1(fake_B, real_B) * self.args.lambda_L1

            # Combined loss
            loss_G = loss_G_GAN + loss_G_L1

            loss_G.backward()
            self.optimizer_G.step()

            # =======================
            # Train Discriminator
            # =======================
            self.optimizer_D.zero_grad()

            # Real images
            pred_real = self.netD(real_A, real_B)
            loss_D_real = self.criterionGAN(pred_real, True)

            # Fake images (detach to avoid backprop through generator)
            fake_B_detached = fake_B.detach()
            pred_fake = self.netD(real_A, fake_B_detached)
            loss_D_fake = self.criterionGAN(pred_fake, False)

            # Combined loss
            loss_D = (loss_D_real + loss_D_fake) * 0.5

            loss_D.backward()
            self.optimizer_D.step()

            # Track losses
            losses_G.append(loss_G.item())
            losses_D.append(loss_D.item())
            losses_G_GAN.append(loss_G_GAN.item())
            losses_G_L1.append(loss_G_L1.item())

            # Update progress bar
            pbar.set_postfix({
                'G': f'{loss_G.item():.4f}',
                'D': f'{loss_D.item():.4f}',
                'L1': f'{loss_G_L1.item():.4f}'
            })

            # Log to tensorboard
            global_step = epoch * len(dataloader) + i
            if i % self.args.log_freq == 0:
                self.writer.add_scalar('Loss/G', loss_G.item(), global_step)
                self.writer.add_scalar('Loss/D', loss_D.item(), global_step)
                self.writer.add_scalar('Loss/G_GAN', loss_G_GAN.item(), global_step)
                self.writer.add_scalar('Loss/G_L1', loss_G_L1.item(), global_step)

            # Save images to tensorboard
            if i % self.args.image_log_freq == 0:
                self.writer.add_images('Images/Real_A', (real_A + 1) / 2, global_step)
                self.writer.add_images('Images/Real_B', (real_B + 1) / 2, global_step)
                self.writer.add_images('Images/Fake_B', (fake_B + 1) / 2, global_step)

            iter_data_time = time.time()

        # Epoch summary
        epoch_time = time.time() - epoch_start_time
        avg_loss_G = sum(losses_G) / len(losses_G)
        avg_loss_D = sum(losses_D) / len(losses_D)

        print(f"\nEpoch {epoch} Summary:")
        print(f"  Time: {epoch_time:.2f}s")
        print(f"  Avg Generator Loss: {avg_loss_G:.4f}")
        print(f"  Avg Discriminator Loss: {avg_loss_D:.4f}")

        return avg_loss_G, avg_loss_D

    def validate(self, dataloader, epoch):
        """
        Validate the model.

        Args:
            dataloader: Validation data loader
            epoch: Current epoch number
        """
        self.netG.eval()

        val_losses = []

        with torch.no_grad():
            for data in dataloader:
                real_A = data['A'].to(self.device)
                real_B = data['B'].to(self.device)

                fake_B = self.netG(real_A)
                loss_L1 = self.criterionL1(fake_B, real_B)
                val_losses.append(loss_L1.item())

        avg_val_loss = sum(val_losses) / len(val_losses)
        print(f"  Validation L1 Loss: {avg_val_loss:.4f}")

        self.writer.add_scalar('Loss/Val_L1', avg_val_loss, epoch)

        return avg_val_loss

    def save_checkpoint(self, epoch, is_best=False):
        """
        Save model checkpoint.

        Args:
            epoch: Current epoch number
            is_best: Whether this is the best model so far
        """
        checkpoint = {
            'epoch': epoch,
            'netG_state_dict': self.netG.state_dict(),
            'netD_state_dict': self.netD.state_dict(),
            'optimizer_G_state_dict': self.optimizer_G.state_dict(),
            'optimizer_D_state_dict': self.optimizer_D.state_dict(),
            'scheduler_G_state_dict': self.scheduler_G.state_dict(),
            'scheduler_D_state_dict': self.scheduler_D.state_dict(),
        }

        # Save latest checkpoint
        checkpoint_path = self.checkpoint_dir / f'checkpoint_epoch_{epoch}.pth'
        torch.save(checkpoint, checkpoint_path)

        # Also save as latest
        latest_path = self.checkpoint_dir / 'latest.pth'
        torch.save(checkpoint, latest_path)

        if is_best:
            best_path = self.checkpoint_dir / 'best.pth'
            torch.save(checkpoint, best_path)
            print(f"  ✓ Saved best model to {best_path}")

        print(f"  ✓ Saved checkpoint to {checkpoint_path}")

    def load_checkpoint(self, checkpoint_path):
        """
        Load model checkpoint.

        Args:
            checkpoint_path: Path to checkpoint file
        """
        print(f"Loading checkpoint from {checkpoint_path}...")
        checkpoint = torch.load(checkpoint_path, map_location=self.device)

        self.netG.load_state_dict(checkpoint['netG_state_dict'])
        self.netD.load_state_dict(checkpoint['netD_state_dict'])
        self.optimizer_G.load_state_dict(checkpoint['optimizer_G_state_dict'])
        self.optimizer_D.load_state_dict(checkpoint['optimizer_D_state_dict'])
        self.scheduler_G.load_state_dict(checkpoint['scheduler_G_state_dict'])
        self.scheduler_D.load_state_dict(checkpoint['scheduler_D_state_dict'])
        self.start_epoch = checkpoint['epoch'] + 1

        print(f"✓ Resumed from epoch {self.start_epoch}")

    def train(self, train_loader, val_loader=None):
        """
        Main training loop.

        Args:
            train_loader: Training data loader
            val_loader: Validation data loader (optional)
        """
        print("\n" + "=" * 60)
        print("Starting Training")
        print("=" * 60)

        best_val_loss = float('inf')

        for epoch in range(self.start_epoch, self.args.n_epochs):
            # Train
            train_loss_G, train_loss_D = self.train_epoch(train_loader, epoch)

            # Validate
            if val_loader is not None:
                val_loss = self.validate(val_loader, epoch)

                # Check if best model
                is_best = val_loss < best_val_loss
                if is_best:
                    best_val_loss = val_loss
            else:
                is_best = False

            # Save checkpoint
            if (epoch + 1) % self.args.save_freq == 0 or is_best:
                self.save_checkpoint(epoch, is_best=is_best)

            # Update learning rate
            self.scheduler_G.step()
            self.scheduler_D.step()

            print()

        print("=" * 60)
        print("Training Complete!")
        print("=" * 60)
        self.writer.close()


def main():
    parser = argparse.ArgumentParser(description='Train Pix2pix for veneer generation')

    # Dataset options
    parser.add_argument('--dataset_root', type=str, default='../../../data/veneer_dataset',
                       help='Root directory of dataset')

    # Model options
    parser.add_argument('--input_nc', type=int, default=3,
                       help='Number of input channels')
    parser.add_argument('--output_nc', type=int, default=3,
                       help='Number of output channels')
    parser.add_argument('--ngf', type=int, default=64,
                       help='Number of generator filters in first conv layer')
    parser.add_argument('--ndf', type=int, default=64,
                       help='Number of discriminator filters in first conv layer')

    # Training options
    parser.add_argument('--n_epochs', type=int, default=200,
                       help='Number of epochs to train')
    parser.add_argument('--batch_size', type=int, default=4,
                       help='Batch size for training')
    parser.add_argument('--lr', type=float, default=0.0002,
                       help='Initial learning rate')
    parser.add_argument('--beta1', type=float, default=0.5,
                       help='Beta1 for Adam optimizer')
    parser.add_argument('--lambda_L1', type=float, default=100.0,
                       help='Weight for L1 loss')

    # Logging options
    parser.add_argument('--checkpoint_dir', type=str, default='checkpoints/pix2pix_veneer',
                       help='Directory to save checkpoints')
    parser.add_argument('--log_dir', type=str, default='logs/pix2pix_veneer',
                       help='Directory for tensorboard logs')
    parser.add_argument('--log_freq', type=int, default=10,
                       help='Frequency of logging losses')
    parser.add_argument('--image_log_freq', type=int, default=100,
                       help='Frequency of logging images')
    parser.add_argument('--save_freq', type=int, default=10,
                       help='Frequency of saving checkpoints (epochs)')

    # Other options
    parser.add_argument('--num_workers', type=int, default=4,
                       help='Number of data loading workers')
    parser.add_argument('--cpu', action='store_true',
                       help='Use CPU instead of GPU')
    parser.add_argument('--resume', type=str, default=None,
                       help='Path to checkpoint to resume from')

    args = parser.parse_args()

    print("Configuration:")
    for arg in vars(args):
        print(f"  {arg}: {getattr(args, arg)}")
    print()

    # Create data loaders
    script_dir = Path(__file__).parent
    dataset_root = Path(args.dataset_root)
    if not dataset_root.is_absolute():
        dataset_root = script_dir / dataset_root

    print(f"Loading dataset from {dataset_root}...")
    train_loader = create_dataloader(
        dataset_root,
        phase='train',
        batch_size=args.batch_size,
        num_workers=args.num_workers
    )

    # Try to load validation set
    val_loader = None
    val_dir = dataset_root / 'val' / 'A'
    if val_dir.exists() and len(list(val_dir.glob('*.jpg'))) > 0:
        val_loader = create_dataloader(
            dataset_root,
            phase='val',
            batch_size=args.batch_size,
            num_workers=args.num_workers
        )

    # Create trainer and start training
    trainer = Pix2PixTrainer(args)
    trainer.train(train_loader, val_loader)


if __name__ == '__main__':
    main()
