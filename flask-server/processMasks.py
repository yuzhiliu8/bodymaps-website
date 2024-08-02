import cv2 as cv
import nibabel as nib
import matplotlib.pyplot as plt
import numpy as np

def process_masks(file_path):
    aorta = nib.load(file_path)
    affine = aorta.affine
    spacing_X, spacing_Y, spacing_Z = list(map(lambda x: float(x), nib.affines.voxel_sizes(affine)))
    aorta_data = aorta.get_fdata()    #aorta_data[x, y, z]

    #AXIAL ORIENTATION (Z axis)
    Z_INDEX_RANGE = aorta_data.shape[2]
    for slice_index in range(Z_INDEX_RANGE):  #AORTA ONLY FOR NOW
        aorta_slice = aorta_data[:, :, slice_index]
        aorta_slice = cv.normalize(aorta_slice, None, 0, 255, cv.NORM_MINMAX, cv.CV_8U) #normalize aorta slice to CV_8U
        print(aorta_slice.shape)

        contours, _ = cv.findContours(aorta_slice, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)

        aorta_slice2 = aorta_data[:, :, slice_index]
        for contour in contours:
            for point in contour:
                x, y = point[0]
                aorta_slice2[y, x] = 1000    #swap x, y bc cv reads shape in as (height, width)

## use go from discrete values to less discrete cornerstone camera coords
## coord = (spacing) * (index) + min
adjust = np.array([-1, -1, 1])
def convertIndexesToCornerstoneCameraCoords(point, aff): 
    new_point = nib.affines.apply_affine(aff, point)
    new_point = new_point * adjust
    return new_point

    
    





file_path = './nifti/CTACardio.nii.gz'
img = nib.load(file_path)
aff = img.affine
point = convertIndexesToCornerstoneCameraCoords([4, 6, 8], aff)
print(point[0], point[1], point[2])
