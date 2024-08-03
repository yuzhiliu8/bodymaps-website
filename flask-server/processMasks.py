import cv2 as cv
import nibabel as nib
import matplotlib.pyplot as plt
import numpy as np

def process_masks(file_path):
    aorta = nib.load(file_path)
    aff = aorta.affine #aff should be the same for all masks
    aorta_data = aorta.get_fdata()    #aorta_data[x, y, z]

    contourSets = {"axial": []}


    axial_aorta = initContourSet(id="axial_aorta", rgb=[255, 0, 0])
    #AXIAL ORIENTATION (Z axis)
    Z_INDEX_RANGE = aorta_data.shape[2]
    for Z in range(Z_INDEX_RANGE):  #AORTA ONLY FOR NOW
        aorta_slice = aorta_data[:, :, Z]
        aorta_slice = cv.normalize(aorta_slice, None, 0, 255, cv.NORM_MINMAX, cv.CV_8U) #normalize aorta slice to CV_8U
        aorta_slice_contours, _ = cv.findContours(aorta_slice, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
        for contour in aorta_slice_contours:
            slice_data = {}
            points = []
            for point in contour:
                X, Y = map(int, point[0])
                point = convertIndexesToCornerstonePoints([X, Y, Z], aff)    #swap x, y bc cv reads shape in as (height, width)
                points.append(point)
            slice_data['points'] = points
            slice_data['type'] = 'CLOSED_PLANAR'
            axial_aorta["data"].append(slice_data)
    
    contourSets["axial"].append(axial_aorta)
    return contourSets

## use go from discrete values to less discrete cornerstone camera coords
## coord = (spacing) * (index) + min
adjust = np.array([-1, -1, 1])
def convertIndexesToCornerstonePoints(point, aff): 
    new_point = nib.affines.apply_affine(aff, point)
    new_point = new_point * adjust
    return list(map(float, new_point))

def initContourSet(id, rgb):
    return {
            "data":[],
            "id": id,
            "color": rgb
        }
        