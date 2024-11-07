import os
from dotenv import load_dotenv
import numpy as np

load_dotenv()   

class Constants:

    # api_blueprint variables
    BASE_PATH = os.environ['BASE_PATH']

    # NiftiProcessor Variables
    EROSION_PIXELS = 4
    CUBE_LEN = (2 * EROSION_PIXELS) + 1
    STRUCTURING_ELEMENT = np.ones([CUBE_LEN, CUBE_LEN, CUBE_LEN], dtype=bool)

    DECIMAL_PRECISION_VOLUME = 2
    DECIMAL_PRECISION_HU = 1

    organ_ids_volumeNA = ('aorta.nii.gz', 'postcava.nii.gz')
    main_nifti_filename = 'ct.nii.gz'

