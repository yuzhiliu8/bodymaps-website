import os
from dotenv import load_dotenv
load_dotenv()   

EROSION_PIXELS = 4
BASE_PATH = os.environ['BASE_PATH']
organ_ids_volumeNA = ('aorta.nii.gz', 'postcava.nii.gz')
main_nifti_filename = 'ct.nii.gz'
