import os
from dotenv import load_dotenv
import numpy as np

load_dotenv()   

class Constants:

    # app variables
    SESSIONS_DIR_NAME = os.environ['SESSIONS_DIR_PATH']
    DB_USER = os.environ['DB_USER']
    DB_PASS= os.environ['DB_PASS']
    DB_HOST = os.environ['DB_HOST']
    DB_NAME = os.environ['DB_NAME']
    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}'


    # api_blueprint variables
    BASE_PATH = os.environ['BASE_PATH']
    MAIN_NIFTI_FORM_NAME = 'MAIN_NIFTI'  #main nifti file in Form Data
    MAIN_NIFTI_FILENAME = 'ct.nii.gz'
    COMBINED_LABELS_FILENAME = 'combined_labels.nii.gz'

    SESSION_TIMEDELTA = 7 #in days

    # #db variables
    # DB_CONNECTION_STRING = os.environ['DB_CONNECTION_STRING']

    # NiftiProcessor Variables
    EROSION_PIXELS = 2
    CUBE_LEN = (2 * EROSION_PIXELS) + 1
    STRUCTURING_ELEMENT = np.ones([CUBE_LEN, CUBE_LEN, CUBE_LEN], dtype=bool)

    DECIMAL_PRECISION_VOLUME = 2
    DECIMAL_PRECISION_HU = 1
    VOXEL_THRESHOLD = 100

    organ_ids_volumeNA = ('aorta.nii.gz', 'postcava.nii.gz')
