import nibabel as nib
import numpy as np
from constants import Constants
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

        combined_labels_img_data = None
        combined_labels_header = None
        combined_labels_affine = None
        for i in range(len(filenames)):
            filename = filenames[i]
            segmentation = nifti_files[filename]
            # print(segmentation)
            data = segmentation.read()

            with tempfile.NamedTemporaryFile(suffix='.nii.gz', delete=True) as temp:
                temp.write(data)
                # print(temp.name)
                nifti_obj = nib.load(temp.name)

                if combined_labels_header is None:
                    combined_labels_header = nifti_obj.header

                if combined_labels_img_data is None:
                    combined_labels_img_data = np.ndarray(shape=nifti_obj.shape, dtype=np.float64)
                
                if combined_labels_affine is None:
                    combined_labels_affine = nifti_obj.affine
                
                # print(nifti_obj.header)
                # print(nifti_obj.shape, type(nifti_obj.shape))
                scaled = nifti_obj.get_fdata() * (i+1)
                combined_labels_img_data = np.maximum(combined_labels_img_data, scaled)
                # x1 = scaled1[scaled1 == (i+1)]
                # print(scaled1[scaled1 == (i+1)], len(x1))
                # nifti_obj_dict[filename] = nifti_obj
        combined_labels = nib.nifti1.Nifti1Image(dataobj=combined_labels_img_data,
                                                 affine=combined_labels_affine,
                                                 header=combined_labels_header)
        
        return combined_labels
        
        
        # for filename in filenames:
        #     nifti = nifti_obj_dict[filename]
        #     # data = nifti.get_fdata()
        #     print(type(nifti))
            
            # print(nifti)
        # print(nifti_obj_dict['aorta.nii.gz'])


    def __str__(self):
        return f"NiftiProcessor Object for session {self._session_key}"

    