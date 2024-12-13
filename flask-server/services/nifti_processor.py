import nibabel as nib
import numpy as np
from constants import Constants
from werkzeug.datastructures import MultiDict
import scipy.ndimage as ndimage
import os
import tempfile


class NiftiProcessor:
    def __init__(self, session_path):
        # validate(session_key)
        self._session_path = session_path
        self._ct_header = None
        self._ct_array = None

        self.set_ct_data()

    
    def set_ct_data(self):
        pass

    
    def calculate_volumes(self):
        pass

    def calculate_mean_hu(self):
        pass

    def combine_labels(self, filenames: list[str], nifti_multi_dict: MultiDict, save=True):
        organ_intensities = {}
        combined_labels_img_data = None
        combined_labels_header = None
        combined_labels_affine = None
        for i in range(len(filenames)):
            filename = filenames[i]
            #print(filename)
            segmentation = nifti_multi_dict[filename]
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
                
                scaled = nifti_obj.get_fdata() * (i+1)
                combined_labels_img_data = np.maximum(combined_labels_img_data, scaled)

                organ_intensities[filename] = i+1

        combined_labels = nib.nifti1.Nifti1Image(dataobj=combined_labels_img_data,
                                                 affine=combined_labels_affine,
                                                 header=combined_labels_header)

        if save is True:
            combined_labels_path = os.path.join(self._session_path, Constants.COMBINED_LABELS_FILENAME)
            nib.save(combined_labels, combined_labels_path)
        
        return combined_labels, organ_intensities


    def __str__(self):
        return f"NiftiProcessor Object for session {self._session_path}"

    