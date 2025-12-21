"""
Configuration for Veneer Preview Service.

This file contains paths to pretrained models and service configuration.
"""

from pathlib import Path

# Base paths
SERVICE_ROOT = Path(__file__).parent
PROJECT_ROOT = SERVICE_ROOT.parent.parent
EXT_ROOT = PROJECT_ROOT / 'ext'
CHECKPOINTS_ROOT = EXT_ROOT / 'veneer_generation' / 'checkpoints'

CONTROLNET_CONFIG = {
    'pretrained': {
        'segmentation': {
            'controlnet_path': 'lllyasviel/control_v11p_sd15_seg',
            'description': 'Segmentation-based ControlNet (best for teeth)',
            'requires_training': False
        },
        'canny': {
            'controlnet_path': 'lllyasviel/control_v11p_sd15_canny',
            'description': 'Canny edge-based ControlNet',
            'requires_training': False
        },
        'local_seg': {
            'controlnet_path': str(CHECKPOINTS_ROOT / 'controlnet' / 'control_v11p_sd15_seg'),
            'description': 'Local segmentation ControlNet',
            'requires_training': False
        },
        'local_canny': {
            'controlnet_path': str(CHECKPOINTS_ROOT / 'controlnet' / 'control_v11p_sd15_canny'),
            'description': 'Local canny ControlNet',
            'requires_training': False
        }
    },

    # Custom trained ControlNet
    'custom': {
        'veneer_controlnet': {
            'controlnet_path': str(CHECKPOINTS_ROOT / 'controlnet' / 'veneer_controlnet'),
            'description': 'Custom trained ControlNet for veneers',
            'requires_training': True
        }
    },

    # Base Stable Diffusion model
    'base_model_path': 'runwayml/stable-diffusion-v1-5',

    # Segmentation model
    'segmentation_checkpoint': str(EXT_ROOT / 'individual_tooth_segmentation' / 'checkpoints' / 'CP_teeth_seg.pth'),

    # Default model to use
    'default': 'pretrained.segmentation'
}

PIX2PIX_CONFIG = {
    # Pretrained Pix2pix models (from junyanz/pytorch-CycleGAN-and-pix2pix)
    'pretrained': {
        'facades': {
            'checkpoint_path': str(EXT_ROOT / 'veneer_generation' / 'pretrained' /
                                 'pytorch-CycleGAN-and-pix2pix' / 'checkpoints' /
                                 'facades_pix2pix' / 'latest_net_G.pth'),
            'description': 'Pretrained on facades (for testing only)',
            'requires_training': True  # Needs fine-tuning for dental
        }
    },

    # Custom trained Pix2pix
    'custom': {
        'veneer_pix2pix': {
            'checkpoint_path': str(CHECKPOINTS_ROOT / 'pix2pix' / 'best_model.pth'),
            'description': 'Custom trained Pix2pix for veneers',
            'requires_training': True
        }
    },

    # Default model to use
    'default': 'custom.veneer_pix2pix'
}

# ============================================
# Service Configuration
# ============================================

SERVICE_CONFIG = {
    # Default model type ('controlnet' or 'pix2pix')
    'default_model_type': 'controlnet',

    # Default model within type
    'default_controlnet': 'pretrained.segmentation',
    'default_pix2pix': 'custom.veneer_pix2pix',

    # API settings
    'max_image_size': 2048,
    'default_quality': 95,

    # Performance settings
    'enable_half_precision': True,  # FP16 for faster inference
    'enable_cpu_offload': True,     # For ControlNet memory optimization
}


def get_model_config(model_type='controlnet', model_name=None):
    """
    Get configuration for a specific model.

    Args:
        model_type: 'controlnet' or 'pix2pix'
        model_name: Specific model name (e.g., 'pretrained.segmentation')
                   If None, uses default

    Returns:
        dict: Model configuration
    """
    if model_type == 'controlnet':
        config_dict = CONTROLNET_CONFIG
        default_name = SERVICE_CONFIG['default_controlnet']
    elif model_type == 'pix2pix':
        config_dict = PIX2PIX_CONFIG
        default_name = SERVICE_CONFIG['default_pix2pix']
    else:
        raise ValueError(f"Unknown model_type: {model_type}")

    # Use default if not specified
    if model_name is None:
        model_name = default_name

    # Parse model name (e.g., 'pretrained.segmentation')
    parts = model_name.split('.')
    if len(parts) != 2:
        raise ValueError(f"Invalid model_name format: {model_name}. Expected 'category.name'")

    category, name = parts

    if category not in config_dict:
        raise ValueError(f"Unknown category: {category}")

    if name not in config_dict[category]:
        raise ValueError(f"Unknown model: {name} in category {category}")

    model_config = config_dict[category][name].copy()

    # Add common config for ControlNet
    if model_type == 'controlnet':
        model_config['base_model_path'] = config_dict['base_model_path']
        model_config['segmentation_checkpoint'] = config_dict['segmentation_checkpoint']

    return model_config


def list_available_models():
    """List all available models."""
    models = {
        'controlnet': {},
        'pix2pix': {}
    }

    # List ControlNet models
    for category in ['pretrained', 'custom']:
        for name, config in CONTROLNET_CONFIG.get(category, {}).items():
            full_name = f"{category}.{name}"
            models['controlnet'][full_name] = {
                'description': config['description'],
                'requires_training': config['requires_training'],
                'available': _check_model_available(config)
            }

    # List Pix2pix models
    for category in ['pretrained', 'custom']:
        for name, config in PIX2PIX_CONFIG.get(category, {}).items():
            full_name = f"{category}.{name}"
            models['pix2pix'][full_name] = {
                'description': config['description'],
                'requires_training': config['requires_training'],
                'available': _check_model_available(config)
            }

    return models


def _check_model_available(config):
    """Check if a model is available locally."""
    if 'controlnet_path' in config:
        path = config['controlnet_path']
        # Check if it's a local path or Hugging Face model
        if '/' in path and not path.startswith('/'):
            # Likely a Hugging Face model (will download on first use)
            return True
        return Path(path).exists()

    if 'checkpoint_path' in config:
        return Path(config['checkpoint_path']).exists()

    return False


if __name__ == '__main__':
    # Test configuration
    print("Available Models:")
    print("=" * 60)

    models = list_available_models()

    print("\nControlNet Models:")
    for name, info in models['controlnet'].items():
        status = "✓" if info['available'] else "✗"
        training = " (needs training)" if info['requires_training'] else " (ready to use)"
        print(f"  {status} {name}: {info['description']}{training}")

    print("\nPix2pix Models:")
    for name, info in models['pix2pix'].items():
        status = "✓" if info['available'] else "✗"
        training = " (needs training)" if info['requires_training'] else " (ready to use)"
        print(f"  {status} {name}: {info['description']}{training}")

    print("\n" + "=" * 60)
    print("\nDefault Configuration:")
    print(f"  Model Type: {SERVICE_CONFIG['default_model_type']}")
    print(f"  ControlNet: {SERVICE_CONFIG['default_controlnet']}")
    print(f"  Pix2pix: {SERVICE_CONFIG['default_pix2pix']}")
