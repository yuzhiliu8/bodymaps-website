from flask import Blueprint, send_file, make_response, request, jsonify
from services.nifti_processor import NiftiProcessor
from services.session_manager import SessionManager
from models.application_session import ApplicationSession
from models.combined_labels import CombinedLabels
from models.base import db
from constants import Constants

from sqlalchemy.orm import aliased
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
    nifti_processor = NiftiProcessor.from_clabel_path(os.path.join(base_path, Constants.COMBINED_LABELS_FILENAME))
    print(nifti_processor)

    nifti_multi_dict = request.files
    filenames = list(nifti_multi_dict)
    main_nifti = nifti_multi_dict[Constants.MAIN_NIFTI_FORM_NAME]

    os.makedirs(base_path, exist_ok=True)

    main_nifti_path = os.path.join(base_path, Constants.MAIN_NIFTI_FILENAME)
    main_nifti.save(main_nifti_path)


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
        combined_labels_path=nifti_processor._clabel_path,
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
    resp['organ_intensities'] = organ_intensities
    
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
    
@api_blueprint.route('/get-segmentations/<combined_labels_id>', methods=['GET'])
def get_segmentations(combined_labels_id):

    #validate session_key

    # stmt = (
    #     db.select(ApplicationSession.combined_labels_id, 
    #               CombinedLabels.combined_labels_path)
    #         .join(CombinedLabels, ApplicationSession.combined_labels_id == CombinedLabels.combined_labels_id)
    #         .where(ApplicationSession.session_id == session_key)
    # )
    stmt = db.select(CombinedLabels).where(CombinedLabels.combined_labels_id == combined_labels_id)
    resp = db.session.execute(stmt)
    clabel = resp.scalar()

    if os.path.exists(clabel.combined_labels_path):
        response = make_response(send_file(clabel.combined_labels_path, mimetype='application/gzip'))

        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
        response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
        response.headers['Content-Encoding'] = 'gzip'

        return response

@api_blueprint.route(f'/mask-data', methods=['POST'])
def get_mask_data():
    session_key = request.form['sessionKey']

    as1 = db.aliased(ApplicationSession)
    cl2 = db.aliased(CombinedLabels)

    j = db.join(cl2, as1, as1.combined_labels_id == cl2.combined_labels_id)

    stmt = (db.select(as1.session_id, as1.main_nifti_path, cl2.combined_labels_id, cl2.combined_labels_path, cl2.organ_intensities, cl2.organ_metadata)
            .select_from(j)
            .where(as1.session_id == session_key))

    resp = db.session.execute(stmt)
    row = resp.fetchone()

    if row.organ_metadata == {}: # run processing function --> write to database
        nifti_processor = NiftiProcessor(row.main_nifti_path, row.combined_labels_path)
        nifti_processor.set_organ_intensities(row.organ_intensities)

        organ_metadata = nifti_processor.calculate_metrics()

        stmt = db.select(CombinedLabels).where(CombinedLabels.combined_labels_id == row.combined_labels_id)
        resp = db.session.execute(stmt)
        clabel = resp.scalar() #clabel to update
        clabel.organ_metadata = organ_metadata #update clabel

        db.session.commit()

        print("writing to database")
        return organ_metadata

    else: # return database info
        print("returning database info")
        return jsonify(row.organ_metadata)

@api_blueprint.route(f'/terminate-session', methods=['POST'])
def terminate_session():
    session_id = request.form['sessionKey']
    session_manager = SessionManager.instance()
    
    session_manager.terminate_session(session_id)
    try:
        print(f'removing session: {session_id}')
        shutil.rmtree(os.path.join(Constants.SESSIONS_DIR_NAME, session_id))
        return jsonify({'message': 'removed session!'})
    except:
        return jsonify({'message': 'Session does not exist!'})

