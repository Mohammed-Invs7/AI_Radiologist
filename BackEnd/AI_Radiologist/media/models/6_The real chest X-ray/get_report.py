
import torch
import torch.nn as nn
from torchvision import models, transforms
from transformers import T5ForConditionalGeneration, T5Tokenizer
from PIL import Image


def get_report(image_path: str, model_path: str,) -> str:


    # Device setup
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Define image transform (must match training)
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])

    # Common model class
    class ResNetT5(nn.Module):
        def __init__(self,
                     image_feature_dim=2048,
                     embed_dim=512,
                     t5_model='t5-small'):
            super().__init__()
            # ResNet50 backbone
            cnn = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
            self.cnn = nn.Sequential(*list(cnn.children())[:-1])
            self.img_proj = nn.Linear(image_feature_dim, embed_dim)
            # T5 for text generation
            self.t5 = T5ForConditionalGeneration.from_pretrained(t5_model)
            self.tokenizer = T5Tokenizer.from_pretrained(t5_model)

        def forward(self, images: torch.Tensor) -> str:
            # Extract and project image features
            feats = self.cnn(images).view(images.size(0), -1)
            img_emb = self.img_proj(feats)
            # Repeat embeddings for encoder
            seq_emb = img_emb.unsqueeze(1).repeat(1, 16, 1)
            enc = self.t5.encoder(inputs_embeds=seq_emb)
            # Generate tokens
            outputs = self.t5.generate(
                encoder_outputs=enc,
                decoder_start_token_id=self.t5.config.decoder_start_token_id,
                max_length=128
            )
            # Decode
            return self.tokenizer.batch_decode(outputs,
                                               skip_special_tokens=True)[0]

    # Load and prepare both models
    try:
        model_f = ResNetT5().to(device)
        model_f.load_state_dict(torch.load(model_path + "resnet_t5_with_all_metrics2.pt",
                                           map_location=device))
        model_f.eval()

        model_i = ResNetT5().to(device)
        model_i.load_state_dict(torch.load(model_path + "resnet_t5_epoch8.pt",
                                           map_location=device))
        model_i.eval()
    except FileNotFoundError as fnf:
        return f"Error: Model file not found - {fnf}"
    except Exception as e:
        return f"Error loading models: {e}"

    # Load and preprocess image
    try:
        img = Image.open(image_path).convert("RGB")
        tensor = transform(img).unsqueeze(0).to(device)
    except FileNotFoundError:
        return f"Error: Image file not found at {image_path}"
    except Exception as e:
        return f"Error processing image: {e}"

    # Inference
    with torch.no_grad():
        findings = model_f(tensor)
        imperetion = model_i(tensor)

    # Combine and return
    return f"Findings: {findings}\nImperetion: {imperetion}"

