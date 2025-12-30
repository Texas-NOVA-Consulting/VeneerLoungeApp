import torch
from PIL import Image
import numpy as np
import sys
from pathlib import Path

# testing only the segmentation model
sys.path.insert(0, str(Path("ext/individual_tooth_segmentation/src").resolve()))
from network.model import ResNeSt50_TC 

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = ResNeSt50_TC(in_ch=3, out_ch=1).to(device)

checkpoint = torch.load("ext/individual_tooth_segmentation/checkpoints/CP_teeth_seg.pth", map_location=device)
state_dict = checkpoint.get("net_state_dict", checkpoint)

new_state_dict = {k.replace("module.", ""): v for k, v in state_dict.items()}
model.load_state_dict(new_state_dict)

model.eval()

image = Image.open("test_image.jpg").convert("RGB")

image = image.resize((256, 256))
input_tensor = torch.from_numpy(np.array(image)).permute(2, 0, 1).float() / 255.0 
input_tensor = input_tensor.unsqueeze(0).to(device) 

with torch.no_grad():
    output = model(input_tensor) 
    mask = output.argmax(dim=1).squeeze(0).cpu().numpy()

mask_image = Image.fromarray((mask * 255).astype(np.uint8))
mask_image.save("debug_test_mask.jpg")
print("Mask saved to debug_test_mask.png")
