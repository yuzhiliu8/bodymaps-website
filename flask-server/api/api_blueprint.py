from flask import Blueprint, send_file, make_response, request, jsonify
from services.nifti_processor import NiftiProcessor
from services.session_manager import SessionManager
from constants import Constants

import shutil
import os
import nibabel as nib


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
    nifti_processor = NiftiProcessor(session_path=os.path.join(Constants.SESSIONS_DIR_NAME, session_key))
    print(nifti_processor)

    nifti_multi_dict = request.files
    filenames = list(nifti_multi_dict)
    main_nifti = nifti_multi_dict[Constants.MAIN_NIFTI_FORM_NAME]
    filenames.remove(Constants.MAIN_NIFTI_FORM_NAME)
    base_path = os.path.join(Constants.SESSIONS_DIR_NAME, session_key)
    os.makedirs(base_path, exist_ok=True)
    main_nifti.save(os.path.join(base_path, Constants.MAIN_NIFTI_FILENAME))

    combined_labels = nifti_processor.combine_labels(filenames, nifti_multi_dict, save=True)

    return session_key
    

@api_blueprint.route('/download/<filename>/<session_key>', methods=['GET'])
def download(filename, session_key):
    if os.path.exists(os.path.join('sessions', session_key)):
        path = os.path.join('sessions', session_key, filename)
        response = make_response(send_file(path, mimetype='application/gzip'))
        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
        response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
        response.headers['Content-Encoding'] = 'gzip'

        return response
    
@api_blueprint.route('/get-main-nifti/<session_key>', methods=['GET'])
def get_main_nifti(session_key):
    #validate session_key
    if os.path.exists(os.path.join(Constants.SESSIONS_DIR_NAME, session_key)):
        path = os.path.join(Constants.SESSIONS_DIR_NAME, session_key, Constants.MAIN_NIFTI_FILENAME) # /sessions/[session_key]/ct.nii.gz
        response = make_response(send_file(path, mimetype='application/gzip'))

        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
        response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
        response.headers['Content-Encoding'] = 'gzip'

        return response
    
@api_blueprint.route('/get-segmentations/<session_key>', methods=['GET'])
def get_segmentations(session_key):
    #validate session_key
    if os.path.exists(os.path.join(Constants.SESSIONS_DIR_NAME, session_key)):
        path = os.path.join(Constants.SESSIONS_DIR_NAME, session_key, Constants.MAIN_NIFTI_FILENAME)
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

