from pathlib import Path
from PIL import Image
from ext.veneer_generation.controlnet.inference_controlnet import VeneerControlNetGenerator

generator = VeneerControlNetGenerator(
    controlnet_path="lllyasviel/control_v11p_sd15_seg",
    segmentation_checkpoint="ext/individual_tooth_segmentation/checkpoints/CP_teeth_seg.pth",
    device="cpu"
)

image_path = "data/before/1.jpg"
output_path = "test_outputs/fixed_pipeline/controlnet_output.jpg"
debug_dir = Path("debug_outputs")
debug_dir.mkdir(exist_ok=True)

image = Image.open(image_path).convert("RGB")
result = generator.generate_veneer_preview(
    image=image,
    debug_dir=debug_dir
)
result.save(output_path)
print("✓ Veneer preview saved")
