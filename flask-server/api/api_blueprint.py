from flask import Blueprint, send_file, make_response, request, jsonify
from services.nifti_processor import NiftiProcessor
from services.session_manager import SessionManager
from models.application_session import ApplicationSession
from models.combined_labels import CombinedLabels
from models.base import db
from constants import Constants

import shutil
import os
import nibabel as nib
from datetime import datetime

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route(f'/', methods=['GET'])
def home():
    return "api"


@api_blueprint.route(f'/upload', methods= ['POST'])
def upload():
    resp = {}
    #if MAIN_NIFTI
    #validate API KEY/Authentication

    session_manager = SessionManager.instance()
    session_id = session_manager.generate_uuid()
    base_path = os.path.join(Constants.SESSIONS_DIR_NAME, session_id)
    nifti_processor = NiftiProcessor(session_path=base_path)
    print(nifti_processor)

    nifti_multi_dict = request.files
    filenames = list(nifti_multi_dict)
    main_nifti = nifti_multi_dict[Constants.MAIN_NIFTI_FORM_NAME]

    os.makedirs(base_path, exist_ok=True)

    main_nifti_path = os.path.join(base_path, Constants.MAIN_NIFTI_FILENAME)
    main_nifti.save(main_nifti_path)

    combined_labels_path = os.path.join(nifti_processor._session_path, Constants.COMBINED_LABELS_FILENAME)


    filenames.remove(Constants.MAIN_NIFTI_FORM_NAME)
    combined_labels, organ_intensities = nifti_processor.combine_labels(filenames, nifti_multi_dict, save=True)
    organ_metadata = {}

    combined_labels_id = session_manager.generate_uuid()
    new_session = ApplicationSession(
        session_id=session_id,
        main_nifti_path=main_nifti_path,
        combined_labels_id=combined_labels_id,
        session_created=datetime.now()
    )
    
    new_clabel = CombinedLabels(
        combined_labels_id=combined_labels_id,
        combined_labels_path=combined_labels_path,
        organ_intensities=organ_intensities,
        organ_metadata=organ_metadata
    )

    db.session.add(new_session)
    db.session.add(new_clabel)
    db.session.commit()

    resp = {}
    resp['status'] = "200"
    resp['session_id'] = session_id
    resp['combined_labels_id'] = combined_labels_id
    
    return jsonify(resp)
    

   
@api_blueprint.route('/get-main-nifti/<session_id>', methods=['GET'])
def get_main_nifti(session_id):

    #validate session_key
    stmt = db.select(ApplicationSession).where(ApplicationSession.session_id == session_id)
    resp = db.session.execute(stmt)
    app_session = resp.scalar()
    main_nifti_path = app_session.main_nifti_path

    if os.path.exists(main_nifti_path):
        response = make_response(send_file(main_nifti_path, mimetype='application/gzip'))

        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
        response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
        response.headers['Content-Encoding'] = 'gzip'

    else:
        pass
    
    return response
    
@api_blueprint.route('/get-segmentations/<session_key>', methods=['GET'])
def get_segmentations(session_key):

    #validate session_key

    stmt = db.select(ApplicationSession.combined_labels_id,
                     CombinedLabels.combined_labels_path).join(CombinedLabels, ApplicationSession.combined_labels_id == CombinedLabels.combined_labels_id).where(ApplicationSession.session_id == session_key)
    resp = db.session.execute(stmt)
    joint = resp.fetchone()
    combined_labels_path = joint.combined_labels_path

    if os.path.exists(combined_labels_path):
        response = make_response(send_file(combined_labels_path, mimetype='application/gzip'))

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

