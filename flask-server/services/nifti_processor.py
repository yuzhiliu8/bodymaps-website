import nibabel as nib
import numpy as np
from constants import Constants
from werkzeug.datastructures import MultiDict
import scipy.ndimage as ndimage
import os
import tempfile


class NiftiProcessor:
    def __init__(self, main_nifti_path, clabel_path, organ_intensities=None):
        # validate(session_key)
        self._main_nifti_path = main_nifti_path
        self._clabel_path = clabel_path

        self._organ_intensities = organ_intensities
    
    def set_organ_intensities(self, organ_intensities):
        self._organ_intensities = organ_intensities

    @classmethod
    def from_clabel_path(cls, clabel_path):
        return cls(None, clabel_path)
    
    def calculate_metrics(self):
        if self._organ_intensities is None or self._clabel_path is None or self._main_nifti_path is None:
            raise Exception("Cannot calculate metrics if self._organ_intensities, self._clabel_path or self._main_nifti_path is None")  
            
        data = {}
        data["organ_metrics"] = []
        clabel_obj = nib.load(self._clabel_path)
        main_nifti_obj = nib.load(self._main_nifti_path)

        clabel_array = np.around(clabel_obj.get_fdata())
        clabel_header = clabel_obj.header
        main_nifti_array = main_nifti_obj.get_fdata()
        
        intensities, frequencies = np.unique(clabel_array, return_counts=True)
        int_freq = {}
        for i in range(len(intensities)):
            int_freq[round(intensities[i])] = int(frequencies[i])

        voxel_dims_mm = clabel_header.get_zooms()
        voxel_volume_cm3 = np.prod(voxel_dims_mm) / 1000

        for organ in self._organ_intensities.keys(): 
            volume_cm3 = round(float(int_freq[self._organ_intensities[organ]] * voxel_volume_cm3), Constants.DECIMAL_PRECISION_VOLUME) 

            intensity = self._organ_intensities[organ]
            binary_mask = (clabel_array == intensity)
            erosion_array = ndimage.binary_erosion(binary_mask, structure=Constants.STRUCTURING_ELEMENT)
            
            #erosion_array = binary_mask
            hu_values = main_nifti_array[erosion_array > 0]
            mean_hu = round(float(np.mean(hu_values)), Constants.DECIMAL_PRECISION_HU)

            data["organ_metrics"].append({"organ_name": organ, "volume_cm3": volume_cm3, "mean_hu": mean_hu})
        
        return data

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
                
                img_data = nifti_obj.get_fdata()
                print(temp.name, np.unique(img_data))
                scaled = img_data * np.float64(i+1)
                combined_labels_img_data = np.maximum(combined_labels_img_data, scaled)

                organ_intensities[filename] = i+1

        combined_labels = nib.nifti1.Nifti1Image(dataobj=combined_labels_img_data,
                                                 affine=combined_labels_affine,
                                                 header=combined_labels_header)

        print(np.unique(combined_labels.get_fdata()))

        if save is True:
            nib.save(combined_labels, self._clabel_path)
        
        # test = nib.load(self._clabel_path)
        # print(np.unique(test.get_fdata()))
        
        return combined_labels, organ_intensities


    def __str__(self):
        return f"NiftiProcessor Object \n main_nifti_path: {self._main_nifti_path} \n clabel_path: {self._clabel_path}"

    