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

        print('NiftiProcessor')
    
    def set_ct_data(self):
        pass

    
    def calculate_volumes(self):
        pass

    def calculate_mean_hu(self):
        pass

    


    @staticmethod
    def combine_labels(nifti_files):
        pass