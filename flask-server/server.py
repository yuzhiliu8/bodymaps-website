from flask import Flask, send_file, make_response, request, jsonify
from flask_cors import CORS
import random
import os
from processMasks import process_masks

app = Flask(__name__)
CORS(app)

chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_"
length = len(chars)

def generate_folder_name():
    name = ''
    for i in range(12):
        index = random.randint(0, length-1)
        name += chars[index]
    return name
    
@app.route('/')
def home():
    return "home"

@app.route('/api', methods=['GET'])
def api():
    return jsonify("api")

@app.route('/api/send', methods= ['POST'])
def upload():
    file = request.files['file']
    folder_name = generate_folder_name()
    os.makedirs(os.path.join('files', folder_name))
    path = os.path.join('files', folder_name, file.filename)
    print(path)
    file.save(path)
    return path.replace('\\', '||')
    

@app.route('/api/download/<path>', methods=['GET'])
def download(path):
    path = path.replace('||', '/')
    print(path)
    response = make_response(send_file(path))
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
    response.headers['Content-Disposition'] = f'attachment; filename="{path}"'
    response.headers['Content-Type'] = 'application/x-gzip'

    return response

@app.route('/api/segmentations', methods=['GET'])
def get_segmentations():
    file_path = 'nifti/aorta.nii.gz'
    data = process_masks(file_path)
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)