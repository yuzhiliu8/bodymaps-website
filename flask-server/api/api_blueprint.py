from flask import Blueprint, Flask, send_file, make_response, request, jsonify
from services.nifti_processor import NiftiProcessor
import shutil
import secrets
import os


api_blueprint = Blueprint('api', __name__)

@api_blueprint.route(f'/', methods=['GET'])
def home():
    return "api"

def generate_session_key(length=32):
    return secrets.token_hex(length)

@api_blueprint.route(f'/upload', methods= ['POST'])
def upload():
    session_key = generate_session_key(length=32)
    files = request.files
    # combine_labels(files, session_key)  REFACTOR
    
    # for filename in filenames:
    #     file = files[filename]
    #     file.save(os.path.join(base, 'segmentations', filename))

    return session_key
    

@api_blueprint.route('/download/<file>', methods=['POST'])
def download(file):
    sessionKey = request.form['sessionKey']
    if os.path.exists(os.path.join('sessions', sessionKey)):
        isSegmentation = request.form['isSegmentation']
        if isSegmentation:
            path = os.path.join('sessions', sessionKey, 'segmentations', file)
        else:
            path = os.path.join('sessions', sessionKey, file)
        
        response = make_response(send_file(path, mimetype='application/gzip'))
        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
        response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
        response.headers['Content-Encoding'] = 'gzip'

        return response

@api_blueprint.route(f'/mask-data', methods=['POST'])
def get_mask_data():
    session_key = request.form['sessionKey']
    return jsonify(session_key)
    # return jsonify(processMasks(session_key)) FIX WHEN REFACTORING

@api_blueprint.route(f'/terminate-session', methods=['POST'])
def terminate_session():
    session_key = request.form['sessionKey']
    try:
        print(f'removing session: {session_key}')
        shutil.rmtree(os.path.join('sessions', session_key))
        return jsonify({'message': 'removed session!'})
    except:
        return jsonify({'message': 'Session does not exist!'})

