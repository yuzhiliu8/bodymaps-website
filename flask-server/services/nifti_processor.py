import nibabel as nib
import numpy as np
from constants import Constants
from utils import removeFileExt
import scipy.ndimage as ndimage
import os

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

    def combine_labels(self, nifti_files, filenames):
        pass


    def __str__(self):
        return f"NiftiProcessor Object for session {self._session_key}"

    