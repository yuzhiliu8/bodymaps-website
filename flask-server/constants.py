import os
from dotenv import load_dotenv


load_dotenv()   

class Constants:

    # api_blueprint variables
    BASE_PATH = os.environ['BASE_PATH']

    # NiftiProcessor Variables
    EROSION_PIXELS = 4
    organ_ids_volumeNA = ('aorta.nii.gz', 'postcava.nii.gz')
    main_nifti_filename = 'ct.nii.gz'

