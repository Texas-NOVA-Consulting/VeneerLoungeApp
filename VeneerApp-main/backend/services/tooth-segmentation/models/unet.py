import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
import numpy as np
import os
from tqdm import tqdm
import argparse
import matplotlib.pyplot as plt
from pathlib import Path
import cv2

class ResNetEncoder(nn.Module):
    """ResNet encoder using ResNet50 for feature extraction"""
    def __init__(self, pretrained=True):
        self.model = models.resnet50(pretrained=pretrained)
        self.conv1 = nn.Sequential(
            resnet.conv1,
            resnet.bn1,
            resnet.relu
        )
        self.maxpool = resnet.maxpool
        self.layer1 = resnet.layer1 
        self.layer2 = resnet.layer2  
        self.layer3 = resnet.layer3  
        self.layer4 = resnet.layer4  

    def forward(self, x):
        # extracting features from input image for skip connections
        features = []

        x = self.conv1(x)
        features.append(x)

        x = self.maxpool(x)
        x = self.layer1(x)
        features.append(x)

        x = self.layer2(x)
        features.append(x)

        x = self.layer3(x)
        features.append(x)

        x = self.layer4(x)
        features.append(x)

        return features

class DecoderBlock(nn.Module):
    """Decoder block for upsampling and feature fusion"""
    
    def __init__(self, in_channels, out_channels, skip_channels):
        super().__init__()
        self.upsample = nn.ConvTranspose2d(
            in_channels, out_channels, 
            kernel_size=2, stride=2
        )
        self.conv = nn.Sequential(
            nn.Conv2d(out_channels + skip_channels, out_channels, 3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_channels, out_channels, 3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x, skip):
        # make feature map bigger
        x = self.upsample(x)
        
        # Handles size mismatch
        if x.shape != skip.shape:
            x = F.interpolate(x, size=skip.shape[2:], mode='bilinear', align_corners=True)
        
        # combine features from skip connection and upsampled features
        x = torch.cat([x, skip], dim=1)
        x = self.conv(x)
        return x

class AttentionBlock(nn.Module):
    """Attention gate for focusing on relevant features"""
    def __init__(self, F_g, F_l, F_int):
        super().__init__()
        
        self.W_g = nn.Sequential(
            nn.Conv2d(F_g, F_int, 1, stride=1, padding=0, bias=True),
            nn.BatchNorm2d(F_int)
        )
        
        self.W_x = nn.Sequential(
            nn.Conv2d(F_l, F_int, 1, stride=1, padding=0, bias=True),
            nn.BatchNorm2d(F_int)
        )
        
        self.psi = nn.Sequential(
            nn.Conv2d(F_int, 1, 1, stride=1, padding=0, bias=True),
            nn.BatchNorm2d(1),
            nn.Sigmoid()
        )
        
        self.relu = nn.ReLU(inplace=True)
    
    def forward(self, g, x):
        g1 = self.W_g(g)
        x1 = self.W_x(x)
        psi = self.relu(g1 + x1)
        psi = self.psi(psi)
        return x * psi

class ToothSegmentationNet(nn.Module):

    def __init__(self):
        super().__init__()
        self.encoder = ResNetEncoder()
        self.decoder1 = DecoderBlock(2048, 1024, 512)
        self.decoder2 = DecoderBlock(1024, 512, 256)
        self.decoder3 = DecoderBlock(512, 256, 128)
        self.decoder4 = DecoderBlock(256, 128, 64)

        self.final_upsample = nn.ConvTranspose2d(64,32, 2, stride=2)
        self.final_conv = nn.Sequential(
            nn.Conv2d(32, 32, 3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.Conv2d(32, out_channels, 1)
        )

    def forward(self, x):
        features = self.encoder(x)

        d4 = self.decoder4(features[4], features[3])
        d3 = self.decoder3(d4, features[2])
        d2 = self.decoder2(d3, features[1])
        d1 = self.decoder1(d2, features[0])

        out = self.final_upsample(d1)
        out = self.final_conv(out)
        
        return torch.sigmoid(out)


    

