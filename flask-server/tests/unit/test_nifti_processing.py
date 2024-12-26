import unittest
from services.nifti_processor import NiftiProcessor

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
    
        
    organ_intensities =  {
    aorta: 1,
    gall_bladder: 2,
    kidney_left: 3,
    kidney_right: 4,
    liver: 5,
    pancreas: 6,
    postcava: 7, 
    spleen: 8, 
    stomach: 9
    }
"""



class TestNiftiProcessing(unittest.TestCase):

    def setUp(self):
        self.clabel_path = None #overload this
        self.main_nifti_path = None # overload this

        self.organ_intensities = {"aorta": 1, 
                                  "gall_bladder": 2, 
                                  "kidney_left": 3, 
                                  "kidney_right": 4, 
                                  "liver": 5, 
                                  "pancreas": 6, 
                                  "postcava": 7,  
                                  "spleen": 8,  
                                  "stomach": 9 }
    

    def test_case_045(self):
        print("testcase 045")
        self.clabel_path = "./test-sessions/test-045/combined_labels_ANS/combined_labels.nii.gz"
        self.main_nifti_path = "./test-sessions/test-045/ct.nii.gz"
        nifti_processor = NiftiProcessor(self.main_nifti_path, self.clabel_path)
        nifti_processor.set_organ_intensities(self.organ_intensities)
        #print(nip._organ_intensities)
        organ_metrics = nifti_processor.calculate_metrics()

        self.assertNotEqual(organ_metrics, None)
    

    def test_case_050(self):
        print("testcase 050")
        self.clabel_path = "./test-sessions/test-050/combined_labels_ANS/combined_labels.nii.gz"
        self.main_nifti_path = "./test-sessions/test-050/ct.nii.gz"

        nifti_processor = NiftiProcessor(self.main_nifti_path, self.clabel_path)
        nifti_processor.set_organ_intensities(self.organ_intensities)
        #print(nip._organ_intensities)
        organ_metrics = nifti_processor.calculate_metrics()

        self.assertNotEqual(organ_metrics, None)
    
 
    def test_case_338(self):
        print("testcase 338")
        self.clabel_path = "./test-sessions/test-050/combined_labels_ANS/combined_labels.nii.gz"
        self.main_nifti_path = "./test-sessions/test-050/ct.nii.gz"



        nifti_processor = NiftiProcessor(self.main_nifti_path, self.clabel_path)
        nifti_processor.set_organ_intensities(self.organ_intensities)
        #print(nip._organ_intensities)
        organ_metrics = nifti_processor.calculate_metrics()

        self.assertNotEqual(organ_metrics, None)
    
 