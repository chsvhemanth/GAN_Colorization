import os
import torch
from flask import Flask, render_template, request, send_from_directory, jsonify, url_for
from torchvision import transforms
from PIL import Image
import uuid
from model import GeneratorUNet
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


if CORS:
    CORS(app)
UPLOAD_FOLDER = "static/uploads"
RESULT_FOLDER = "static/results"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'
IMG_SIZE = 128

# Load model
model = GeneratorUNet().to(DEVICE)
model.load_state_dict(torch.load("generator.pth", map_location=DEVICE))
model.eval()

def preprocess_image(image_path):
    img = Image.open(image_path).convert('L')
    transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize((0.5,), (0.5,))
    ])
    return transform(img).unsqueeze(0)

def denorm(t):
    return (t.clamp(-1, 1) + 1.0) / 2.0

import torch.nn.functional as F
from PIL import Image

@app.route('/api/colorize', methods=['POST'])
def api_colorize():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    file_id = str(uuid.uuid4())
    upload_filename = file_id + '.png'
    result_filename = file_id + '.png'
    file_path = os.path.join(UPLOAD_FOLDER, upload_filename)
    result_path = os.path.join(RESULT_FOLDER, result_filename)
    file.save(file_path)

    # Load original size for later
    orig_img = Image.open(file_path)
    orig_width, orig_height = orig_img.size

    # Process image
    gray_tensor = preprocess_image(file_path).to(DEVICE)
    with torch.no_grad():
        fake = model(gray_tensor)

    # Resize back to original dimensions using interpolate
    fake_resized = F.interpolate(fake, size=(orig_height, orig_width), mode='bilinear', align_corners=False)

    # Convert to PIL and save
    fake_img = denorm(fake_resized[0]).permute(1, 2, 0).cpu()
    fake_pil = Image.fromarray((fake_img.numpy() * 255).astype('uint8'))
    fake_pil.save(result_path)

    uploaded_url = url_for('static', filename=f'uploads/{upload_filename}', _external=True)
    result_url = url_for('static', filename=f'results/{result_filename}', _external=True)

    return jsonify({'uploaded_image': uploaded_url, 'result_image': result_url})


if __name__ == "__main__":
    app.run(debug=True)
