import cv2 as cv
import nibabel as nib
import matplotlib.pyplot as plt
import numpy as np

def getContours(filepath):
    aorta = nib.load(filepath)
    aorta_data = aorta.get_fdata()    #aorta_data[x, y, z]

    #AXIAL ORIENTATION (Z axis)
    slice_index = aorta_data.shape[2] //2
    aorta_slice = aorta_data[:, :, slice_index]
    # aorta_slice = cv.transpose(aorta_slice)

    aorta_slice = cv.normalize(aorta_slice, None, 0, 255, cv.NORM_MINMAX, cv.CV_8U) #normalize aorta slice = CV_8U
    print(aorta_slice.shape)

    contours, _ = cv.findContours(aorta_slice, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)

    aorta_slice2 = aorta_data[:, :, slice_index]
    for contour in contours:
        for point in contour:
            x, y = point[0]
            aorta_slice2[y, x] = 1000


    


    cv.imshow('orig', aorta_slice2)
    cv.waitKey(0)
    cv.destroyAllWindows()



filepath = './nifti/aorta.nii.gz'
getContours(filepath)
