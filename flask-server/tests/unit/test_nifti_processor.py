import unittest
import os

from app import create_app
from services.nifti_processor import NiftiProcessor

"""
Each test session has 
    ct.nii.gz - Main nifti/CT Scan file
    combined_labels.nii.gz - segmentation files combined into one

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



class TestNiftiProcessorFunctions(unittest.TestCase):

    def setUp(self):
        self.client = create_app().test_client()
        self.nifti_processor = NiftiProcessor('test-tessions')
        print(os.path.exists('test-sessions'))
        # print('setup')

    def tearDown(self):
        pass

    def test_combined_labels(self):
        response = self.client.get('/bodymaps/api/')
        print(response.text)
        # print(self.client)
        self.assertEqual(4, 4)

    def test_case_050(self):
        self.assertEqual(4, 4)

    def test_case_0338(self):
        self.assertEqual(4, 4)

if __name__ == "__main__":
    unittest.main()