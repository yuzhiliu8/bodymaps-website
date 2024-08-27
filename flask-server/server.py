from flask import Flask, send_file, make_response, request, jsonify
from flask_cors import CORS
from handle import processMasks
import secrets
import os

app = Flask(__name__)
CORS(app)

def generate_session_key(length=32):
    return secrets.token_hex(length)
    
@app.route('/')
def home():
    return "home"

@app.route('/api', methods=['GET'])
def api():
    return "api"

@app.route('/api/upload', methods= ['POST'])
def upload():
    session_key = generate_session_key(length=32)
    files = request.files
    filenames = list(files.keys())
    filenames.remove('MAIN_NIFTI')
    base = os.path.join('sessions', session_key, ) #base dir path 
    os.makedirs(os.path.join(base, 'segmentations'))
    main_nifti = files['MAIN_NIFTI']
    main_nifti.save(os.path.join(base, 'ct.nii.gz'))
    for filename in filenames:
        file = files[filename]
        file.save(os.path.join(base, 'segmentations', filename))

    return session_key
    

@app.route('/api/download/<file>', methods=['POST'])
def download(file):
    path = path.replace('||', '/')
    response = make_response(send_file(path, mimetype='application/gzip'))
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
    response.headers['Content-Encoding'] = 'gzip'

    return response

@app.route('/api/mask-data', methods=['POST'])
def get_mask_data(path):
    serverDir = path.replace('||', '/')
    print(serverDir)
    return jsonify(processMasks(serverDir=serverDir))


if __name__ == "__main__":
    app.run(debug=True)