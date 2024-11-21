import os
from dotenv import load_dotenv
import numpy as np

load_dotenv()   

class Constants:

    # app variables
    SESSIONS_DIR_NAME = 'sessions'


    # api_blueprint variables
    BASE_PATH = os.environ['BASE_PATH']
    MAIN_NIFTI_FORM_NAME = 'MAIN_NIFTI'  #main nifti file in Form Data
    MAIN_NIFTI_FILENAME = 'ct.nii.gz'
    SEGMENTATIONS_NIFTI_FILENAME = 'combined_labels.nii.gz'
    #db variables
    DB_CONNECTION_STRING = os.environ['DB_CONNECTION_STRING']

    # NiftiProcessor Variables
    EROSION_PIXELS = 4
    CUBE_LEN = (2 * EROSION_PIXELS) + 1
    STRUCTURING_ELEMENT = np.ones([CUBE_LEN, CUBE_LEN, CUBE_LEN], dtype=bool)

    DECIMAL_PRECISION_VOLUME = 2
    DECIMAL_PRECISION_HU = 1
    VOXEL_THRESHOLD = 100

    organ_ids_volumeNA = ('aorta.nii.gz', 'postcava.nii.gz')
    

