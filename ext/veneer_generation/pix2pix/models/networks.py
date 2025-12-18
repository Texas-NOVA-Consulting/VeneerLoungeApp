"""
Neural network architectures for Pix2pix.

Includes:
- UNet Generator: Encoder-decoder with skip connections
- PatchGAN Discriminator: Classifies image patches as real/fake
"""

import torch
import torch.nn as nn


class UNetGenerator(nn.Module):
    """
    UNet-based generator for pix2pix.

    Architecture:
    - Encoder: Downsampling path (conv + batchnorm + leakyrelu)
    - Decoder: Upsampling path (convtranspose + batchnorm + relu)
    - Skip connections: Concatenates encoder features to decoder

    Why UNet:
    - Skip connections preserve fine details
    - Good for image-to-image translation
    - Standard architecture for pix2pix
    """

    def __init__(self, input_nc=3, output_nc=3, ngf=64):
        """
        Args:
            input_nc: Number of input channels (3 for RGB, 4 if using masks)
            output_nc: Number of output channels (3 for RGB)
            ngf: Number of generator filters in first conv layer
        """
        super(UNetGenerator, self).__init__()

        # Encoder (downsampling)
        self.enc1 = self._encoder_block(input_nc, ngf, normalize=False)
        self.enc2 = self._encoder_block(ngf, ngf * 2)
        self.enc3 = self._encoder_block(ngf * 2, ngf * 4)
        self.enc4 = self._encoder_block(ngf * 4, ngf * 8)
        self.enc5 = self._encoder_block(ngf * 8, ngf * 8)
        self.enc6 = self._encoder_block(ngf * 8, ngf * 8)
        self.enc7 = self._encoder_block(ngf * 8, ngf * 8)
        self.enc8 = self._encoder_block(ngf * 8, ngf * 8, normalize=False)

        # Decoder (upsampling)
        self.dec1 = self._decoder_block(ngf * 8, ngf * 8, dropout=True)
        self.dec2 = self._decoder_block(ngf * 16, ngf * 8, dropout=True)
        self.dec3 = self._decoder_block(ngf * 16, ngf * 8, dropout=True)
        self.dec4 = self._decoder_block(ngf * 16, ngf * 8)
        self.dec5 = self._decoder_block(ngf * 16, ngf * 4)
        self.dec6 = self._decoder_block(ngf * 8, ngf * 2)
        self.dec7 = self._decoder_block(ngf * 4, ngf)

        # Final layer
        self.final = nn.Sequential(
            nn.ConvTranspose2d(ngf * 2, output_nc, kernel_size=4,
                              stride=2, padding=1),
            nn.Tanh()
        )

    def _encoder_block(self, in_channels, out_channels, normalize=True):
        """Encoder block: Conv -> BatchNorm -> LeakyReLU"""
        layers = [nn.Conv2d(in_channels, out_channels, kernel_size=4,
                           stride=2, padding=1, bias=False)]
        if normalize:
            layers.append(nn.BatchNorm2d(out_channels))
        layers.append(nn.LeakyReLU(0.2, inplace=True))
        return nn.Sequential(*layers)

    def _decoder_block(self, in_channels, out_channels, dropout=False):
        """Decoder block: ConvTranspose -> BatchNorm -> ReLU"""
        layers = [
            nn.ConvTranspose2d(in_channels, out_channels, kernel_size=4,
                              stride=2, padding=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        ]
        if dropout:
            layers.append(nn.Dropout(0.5))
        return nn.Sequential(*layers)

    def forward(self, x):
        """
        Forward pass with skip connections.

        Args:
            x: Input image tensor (B, C, H, W)

        Returns:
            Generated image tensor (B, C, H, W)
        """
        # Encoder with skip connections
        e1 = self.enc1(x)      # (B, ngf, H/2, W/2)
        e2 = self.enc2(e1)     # (B, ngf*2, H/4, W/4)
        e3 = self.enc3(e2)     # (B, ngf*4, H/8, W/8)
        e4 = self.enc4(e3)     # (B, ngf*8, H/16, W/16)
        e5 = self.enc5(e4)     # (B, ngf*8, H/32, W/32)
        e6 = self.enc6(e5)     # (B, ngf*8, H/64, W/64)
        e7 = self.enc7(e6)     # (B, ngf*8, H/128, W/128)
        e8 = self.enc8(e7)     # (B, ngf*8, H/256, W/256)

        # Decoder with skip connections
        d1 = self.dec1(e8)
        d1 = torch.cat([d1, e7], dim=1)  # Skip connection

        d2 = self.dec2(d1)
        d2 = torch.cat([d2, e6], dim=1)

        d3 = self.dec3(d2)
        d3 = torch.cat([d3, e5], dim=1)

        d4 = self.dec4(d3)
        d4 = torch.cat([d4, e4], dim=1)

        d5 = self.dec5(d4)
        d5 = torch.cat([d5, e3], dim=1)

        d6 = self.dec6(d5)
        d6 = torch.cat([d6, e2], dim=1)

        d7 = self.dec7(d6)
        d7 = torch.cat([d7, e1], dim=1)

        # Final output
        out = self.final(d7)
        return out


class PatchGANDiscriminator(nn.Module):
    """
    PatchGAN discriminator for pix2pix.

    Instead of classifying the entire image as real/fake,
    classifies each N×N patch. This encourages sharp high-frequency details.

    Why PatchGAN:
    - Better for high-frequency details (teeth texture)
    - Fewer parameters than full-image discriminator
    - Standard for pix2pix
    """

    def __init__(self, input_nc=6, ndf=64):
        """
        Args:
            input_nc: Number of input channels (6 = input + output images)
            ndf: Number of discriminator filters in first conv layer
        """
        super(PatchGANDiscriminator, self).__init__()

        # 70x70 PatchGAN
        self.model = nn.Sequential(
            # Layer 1: No normalization
            nn.Conv2d(input_nc, ndf, kernel_size=4, stride=2, padding=1),
            nn.LeakyReLU(0.2, inplace=True),

            # Layer 2
            nn.Conv2d(ndf, ndf * 2, kernel_size=4, stride=2, padding=1, bias=False),
            nn.BatchNorm2d(ndf * 2),
            nn.LeakyReLU(0.2, inplace=True),

            # Layer 3
            nn.Conv2d(ndf * 2, ndf * 4, kernel_size=4, stride=2, padding=1, bias=False),
            nn.BatchNorm2d(ndf * 4),
            nn.LeakyReLU(0.2, inplace=True),

            # Layer 4
            nn.Conv2d(ndf * 4, ndf * 8, kernel_size=4, stride=1, padding=1, bias=False),
            nn.BatchNorm2d(ndf * 8),
            nn.LeakyReLU(0.2, inplace=True),

            # Output layer
            nn.Conv2d(ndf * 8, 1, kernel_size=4, stride=1, padding=1)
        )

    def forward(self, input_img, target_img):
        """
        Forward pass.

        Args:
            input_img: Input image (before)
            target_img: Target/generated image (after/fake)

        Returns:
            Patch predictions (B, 1, H, W)
        """
        # Concatenate input and target
        x = torch.cat([input_img, target_img], dim=1)
        return self.model(x)


def init_weights(net, init_type='normal', init_gain=0.02):
    """
    Initialize network weights.

    Args:
        net: Network to initialize
        init_type: Initialization method ('normal', 'xavier', 'kaiming')
        init_gain: Scaling factor for normal initialization
    """
    def init_func(m):
        classname = m.__class__.__name__
        if hasattr(m, 'weight') and (classname.find('Conv') != -1 or classname.find('Linear') != -1):
            if init_type == 'normal':
                nn.init.normal_(m.weight.data, 0.0, init_gain)
            elif init_type == 'xavier':
                nn.init.xavier_normal_(m.weight.data, gain=init_gain)
            elif init_type == 'kaiming':
                nn.init.kaiming_normal_(m.weight.data, a=0, mode='fan_in')
            if hasattr(m, 'bias') and m.bias is not None:
                nn.init.constant_(m.bias.data, 0.0)
        elif classname.find('BatchNorm2d') != -1:
            nn.init.normal_(m.weight.data, 1.0, init_gain)
            nn.init.constant_(m.bias.data, 0.0)

    net.apply(init_func)
    return net


def define_generator(input_nc=3, output_nc=3, ngf=64, init_type='normal', device='cuda'):
    """
    Create and initialize generator.

    Args:
        input_nc: Number of input channels
        output_nc: Number of output channels
        ngf: Number of generator filters
        init_type: Weight initialization type
        device: Device to place model on

    Returns:
        Initialized generator model
    """
    net = UNetGenerator(input_nc, output_nc, ngf)
    net = init_weights(net, init_type)
    net = net.to(device)
    return net


def define_discriminator(input_nc=6, ndf=64, init_type='normal', device='cuda'):
    """
    Create and initialize discriminator.
    Args:
        input_nc: Number of input channels (typically 6 = 3 + 3)
        ndf: Number of discriminator filters
        init_type: Weight initialization type
        device: Device to place model on

    Returns:
        Initialized discriminator model
    """
    net = PatchGANDiscriminator(input_nc, ndf)
    net = init_weights(net, init_type)
    net = net.to(device)
    return net


if __name__ == "__main__":
    # Test networks
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    print("Testing Generator...")
    gen = define_generator(input_nc=3, output_nc=3, device=device)
    test_input = torch.randn(1, 3, 256, 256).to(device)
    test_output = gen(test_input)
    print(f"✓ Generator output shape: {test_output.shape}")

    print("\nTesting Discriminator...")
    disc = define_discriminator(input_nc=6, device=device)
    test_real = torch.randn(1, 3, 256, 256).to(device)
    test_fake = torch.randn(1, 3, 256, 256).to(device)
    test_disc_output = disc(test_real, test_fake)
    print(f"✓ Discriminator output shape: {test_disc_output.shape}")

    # Count parameters
    gen_params = sum(p.numel() for p in gen.parameters() if p.requires_grad)
    disc_params = sum(p.numel() for p in disc.parameters() if p.requires_grad)
    print(f"\nGenerator parameters: {gen_params:,}")
    print(f"Discriminator parameters: {disc_params:,}")
