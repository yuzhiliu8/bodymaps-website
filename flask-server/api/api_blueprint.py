from flask import Blueprint, send_file, make_response, request, jsonify
from services.nifti_processor import NiftiProcessor
from services.session_manager import SessionManager
from constants import Constants
import shutil
import os


api_blueprint = Blueprint('api', __name__)

@api_blueprint.route(f'/', methods=['GET'])
def home():
    return "api"


@api_blueprint.route(f'/upload', methods= ['POST'])
def upload():
    #if MAIN_NIFTI
    #validate API KEY/Authentication

    session_manager = SessionManager.instance()
    session_key = session_manager.generate_session_key()
    nifti_processor = NiftiProcessor(session_key)
    print(nifti_processor)

    files = request.files
    filenames = list(files)
    main_nifti = files[Constants.MAIN_NIFTI_FORM_NAME]
    filenames.remove(Constants.MAIN_NIFTI_FORM_NAME)
    base_path = os.path.join(Constants.SESSIONS_DIR_NAME, session_key)
    os.makedirs(os.path.join(base_path, 'segmentations'), exist_ok=True)
    main_nifti.save(os.path.join(base_path, Constants.MAIN_NIFTI_FILENAME))
    
    for filename in filenames:
        segmentation = files[filename]
        segmentation.save(os.path.join(base_path, 'segmentations', filename))
        print(filename)
    
    # for filename in filenames:
    #     file = files[filename]
    #     file.save(os.path.join(base, 'segmentations', filename))

    return session_key
    

@api_blueprint.route('/get-main-nifti/<session_key>', methods=['GET'])
def download(session_key):

    if os.path.exists(os.path.join('sessions', session_key)): #validate session

        path = os.path.join('sessions', session_key, Constants.MAIN_NIFTI_FILENAME)
        response = make_response(send_file(path, mimetype='application/octet-stream'))
        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
        response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
        response.headers['Content-Encoding'] = 'gzip'
        response.headers['Content-Type'] = 'application/octet-stream'

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

