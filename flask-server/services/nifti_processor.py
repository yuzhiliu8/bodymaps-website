import nibabel as nib
import numpy as np
from constants import Constants
from utils import removeFileExt
import scipy.ndimage as ndimage
import os
import tempfile


class NiftiProcessor:
    def __init__(self, session_key):
        # validate(session_key)
        self._session_key = session_key
        self._ct_header = None
        self._ct_array = None

        self.set_ct_data()

    
    def set_ct_data(self):
        pass

    
    def calculate_volumes(self):
        pass

    def calculate_mean_hu(self):
        pass

    def combine_labels(self, filenames, nifti_files):

        nifti_obj_dict = {}
        for filename in filenames:
            segmentation = nifti_files[filename]
            print(segmentation)
            data = segmentation.read()

            with tempfile.NamedTemporaryFile(suffix='.nii.gz', delete=True) as temp:
                temp.write(data)
                print(temp.name)
                nifti_obj = nib.load(temp.name)
                nifti_obj_dict[filename] = nifti_obj
            
            # print(nifti)
        print(nifti_obj_dict)


    def __str__(self):
        return f"NiftiProcessor Object for session {self._session_key}"

    