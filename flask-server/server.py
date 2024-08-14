from flask import Flask, send_file, make_response, request, jsonify
from flask_cors import CORS
from handle import processMasks
import random
import os

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
    return "api"

@app.route('/api/upload', methods= ['POST'])
def upload():
    folder_name = generate_folder_name()
    files = request.files
    filenames = list(files.keys())
    filenames.remove('MAIN_NIFTI')
    base = os.path.join('files', folder_name, ) #base dir path 
    os.makedirs(os.path.join(base, 'segmentations'))
    main_nifti = files['MAIN_NIFTI']
    main_nifti.save(os.path.join(base, 'ct.nii.gz'))
    for filename in filenames:
        file = files[filename]
        file.save(os.path.join(base, 'segmentations', filename))

    return base.replace('\\', '||')
    

@app.route('/api/download/<path>', methods=['GET'])
def download(path):
    path = path.replace('||', '/')
    print(path)
    response = make_response(send_file(path, mimetype='application/gzip'))
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
    response.headers['Content-Encoding'] = 'gzip'

    return response

@app.route('/api/mask-data/<path>', methods=['GET'])
def get_mask_data(path):
    serverDir = path.replace('||', '/')
    print(serverDir)
    return jsonify(processMasks(serverDir=serverDir))


if __name__ == "__main__":
    app.run(debug=True)