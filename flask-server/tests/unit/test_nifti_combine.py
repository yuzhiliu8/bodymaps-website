import unittest
import os
import nibabel as nib
import numpy as np
import io

from app import create_app
from services.nifti_processor import NiftiProcessor
from werkzeug.datastructures import MultiDict, FileStorage


"""
Each test session has 

    ct.nii.gz 
        - Main nifti/CT Scan file

    /combined_labels_ANS/combined_labels.nii.gz
        - segmentation files combined into one (TESTING CREATED ONE AGAINST THIS ONE)

    /combined_labels.nii.gz 
        - segmentation file that NiftiProcessor will create and store here (FILE THAT NEEDS TO BE TESTED)

    /segmentations - Directory containing 9 nifti segmentation files, which are:
        - aorta.nii.gz
        - gall_bladder.nii.gz
        - kidney_left.nii.gz
        - kidney_right.nii.gz
        - liver.nii.gz
        - pancreas.nii.gz
        - postcava.nii.gz
        - spleen.nii.gz
        - stomach.nii.gz

    test-045:
        ct.nii.gz ~ 17 mb
        combined_labels ~ 151kb
    
    test-050
        ct.nii.gz ~ 13mb
        combined_labels ~ 116kb

    test-338
        ct.nii.gz ~ 16mb
        combined_labels ~ 204kb
"""
def create_nifti_multi_dict(seg_filenames: list[str], segmentation_path: str):
    
    nifti_multi_dict = MultiDict()
    for filename in seg_filenames:
        path = os.path.join(segmentation_path, filename)
        
        with open(path, 'rb') as file_stream:
            file_storage = FileStorage(stream=io.BytesIO(file_stream.read()), filename=filename, content_type='application/gzip')
            nifti_multi_dict.add(key=filename, value=file_storage)
    
    return nifti_multi_dict


class TestNiftiProcessorFunctions(unittest.TestCase):

    def setUp(self):
        self.test_case: str = ''
        self.combined_labels_ANS: nib.nifti1.Nifti1Image = None
        self.organ_intensities_ANS: dict = {'aorta.nii.gz': 1, 'spleen.nii.gz': 2, 
                                            'pancreas.nii.gz': 3, 'kidney_left.nii.gz': 4, 
                                            'postcava.nii.gz': 5, 'gall_bladder.nii.gz': 6, 
                                            'liver.nii.gz': 7, 'stomach.nii.gz': 8, 
                                            'kidney_right.nii.gz': 9}

    def tearDown(self):
        self.test_case = ''
        self.combined_labels_ANS = None

    def test_case_045(self):
        print('test case 045')
        self.test_case = 'test-045'
        session_path = os.path.join('test-sessions', self.test_case)
        self.combined_labels_ANS = nib.load(os.path.join(session_path, 'combined_labels_ANS', 'combined_labels.nii.gz'))
        segmentation_path = os.path.join(session_path, 'segmentations')
        seg_filenames = os.listdir(segmentation_path)

        nifti_multi_dict = create_nifti_multi_dict(seg_filenames, segmentation_path)

        nifti_processor = NiftiProcessor(main_nifti_path=None, clabel_path=os.path.join(session_path, 'combined_labels.nii.gz'))
        combined_labels, organ_intensities = nifti_processor.combine_labels(seg_filenames, nifti_multi_dict, save=False)

        differences = combined_labels.get_fdata() == self.combined_labels_ANS.get_fdata()
        error_voxels = len(differences[differences == False])
        dims = combined_labels.shape
        total_voxels = dims[0] * dims[1] * dims[2]
        error_percent = error_voxels / total_voxels
        print(f'Number of Inaccurate Voxels: {error_voxels} Total Voxels: {total_voxels}')
        print(f'Accuracy: {1 - error_percent}')
        self.assertEqual(combined_labels.header, self.combined_labels_ANS.header)
        self.assertEqual(organ_intensities, self.organ_intensities_ANS)


        print(np.unique(combined_labels.get_fdata()))
        

    def test_case_050(self):
        print("test_case_050")
        self.test_case = 'test-050'
        session_path = os.path.join('test-sessions', self.test_case)
        self.combined_labels_ANS = nib.load(os.path.join(session_path, 'combined_labels_ANS', 'combined_labels.nii.gz'))
        segmentation_path = os.path.join(session_path, 'segmentations')
        seg_filenames = os.listdir(segmentation_path)

        nifti_multi_dict = create_nifti_multi_dict(seg_filenames, segmentation_path)

        nifti_processor = NiftiProcessor(main_nifti_path=None, clabel_path=os.path.join(session_path, 'combined_labels.nii.gz'))
        combined_labels, organ_intensities = nifti_processor.combine_labels(seg_filenames, nifti_multi_dict, save=False)
        # print(combined_labels)

        differences = combined_labels.get_fdata() == self.combined_labels_ANS.get_fdata()
        error_voxels = len(differences[differences == False])
        dims = combined_labels.shape
        total_voxels = dims[0] * dims[1] * dims[2]
        error_percent = error_voxels / total_voxels
        print(f'Number of Inaccurate Voxels: {error_voxels} Total Voxels: {total_voxels}')
        print(f'Accuracy: {1 - error_percent}')
        self.assertEqual(combined_labels.header, self.combined_labels_ANS.header)
        self.assertEqual(organ_intensities, self.organ_intensities_ANS)

        print(np.unique(combined_labels.get_fdata()))

    def test_case_0338(self):
        print("test_case_338")
        self.test_case = 'test-338'
        session_path = os.path.join('test-sessions', self.test_case)
        self.combined_labels_ANS = nib.load(os.path.join(session_path, 'combined_labels_ANS', 'combined_labels.nii.gz'))
        segmentation_path = os.path.join(session_path, 'segmentations')
        seg_filenames = os.listdir(segmentation_path)

        nifti_multi_dict = create_nifti_multi_dict(seg_filenames, segmentation_path)

        nifti_processor = NiftiProcessor(main_nifti_path=None, clabel_path=os.path.join(session_path, 'combined_labels.nii.gz'))
        combined_labels, organ_intensities = nifti_processor.combine_labels(seg_filenames, nifti_multi_dict, save=False)
        # print(combined_labels)

        differences = combined_labels.get_fdata() == self.combined_labels_ANS.get_fdata()
        error_voxels = len(differences[differences == False])
        dims = combined_labels.shape
        total_voxels = dims[0] * dims[1] * dims[2]
        error_percent = error_voxels / total_voxels
        print(f'Number of Inaccurate Voxels: {error_voxels} Total Voxels: {total_voxels}')
        print(f'Accuracy: {1 - error_percent}')
        self.assertEqual(combined_labels.header, self.combined_labels_ANS.header)
        self.assertEqual(organ_intensities, self.organ_intensities_ANS)

        print(np.unique(combined_labels.get_fdata()))
        

if __name__ == "__main__":
    unittest.main()