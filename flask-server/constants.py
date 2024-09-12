import os
from dotenv import load_dotenv

load_dotenv()

BASE_PATH = os.environ['BASE_PATH']
reportScreenNames = ['Aorta', 'Gallbladder', 'Kidney (L)', 'Kidney (R)', 'Liver', 'Pancreas', 'Postcava', 'Spleen', 'Stomach']
organ_ids_volumeNA = ('aorta.nii.gz', 'postcava.nii.gz')
main_nifti_filename = 'ct.nii.gz'
