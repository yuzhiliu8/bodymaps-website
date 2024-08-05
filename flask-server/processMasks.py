import cv2 as cv
import nibabel as nib
import matplotlib.pyplot as plt
import numpy as np
import os
from colors import defaultColors

organs = ['aorta', 'gall_bladder', 'kidney_left', 'kidney_right', 'liver', 'pancreas', 'postcava', 'spleen', 'stomach']

def process_masks(folder_path):
    contourSets = {"axial": [], "sagittal": [], "coronal": []}
    volumes = []
    f_datas = []
    for organ in organs:
        volume = nib.load(os.path.join(folder_path, 'masks', f'{organ}.nii.gz'))
        volumes.append(volume)
        f_datas.append(volume.get_fdata())
        contourSets['axial'].append(initContourSet(id=f'axial_{organ}'))
        # contourSets['sagittal'].append(initContourSet(id=f'sagittal_{organ}'))
        # contourSets['coronal'].append(initContourSet(id=f'coronal_{organ}'))
    aff = volumes[0].affine #aff should be the same for all masks
    shape = volumes[0].shape

    #AXIAL ORIENTATION (Z axis)
    # Z_INDEX_RANGE = shape[2]
    # for Z in range(Z_INDEX_RANGE):  
    #     for i in range(len(organs)):
    #         organ_slice = f_datas[i][:, :, Z]
    #         organ_slice = cv.normalize(organ_slice, None, 0, 255, cv.NORM_MINMAX, cv.CV_8U)
    #         organ_slice_contours, _ = cv.findContours(organ_slice, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
    #         for contour in organ_slice_contours:
    #             slice_data = {}
    #             points = []
    #             for point in contour:
    #                 X, Y = map(int, point[0])
    #                 point = affine_transform([Y, X, Z], aff)
    #                 points.append(point)
    #             slice_data['points'] = points
    #             slice_data['type'] = "CLOSED_PLANAR"
    #             contourSets['axial'][i]['data'].append(slice_data)
    #             contourSets['axial'][i]['color'] = defaultColors[i]
    X_INDEX_RANGE = shape[0]
    for X in range(X_INDEX_RANGE):  
        for i in range(len(organs)):
            organ_slice = f_datas[i][X, :, :]
            organ_slice = cv.normalize(organ_slice, None, 0, 255, cv.NORM_MINMAX, cv.CV_8U)
            organ_slice_contours, _ = cv.findContours(organ_slice, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
            for contour in organ_slice_contours:
                slice_data = {}
                points = []
                for point in contour:
                    Y, Z = map(int, point[0])
                    point = affine_transform([X, Z, Y], aff)
                    points.append(point)
                slice_data['points'] = points
                slice_data['type'] = "CLOSED_PLANAR"
                contourSets['axial'][i]['data'].append(slice_data)
                contourSets['axial'][i]['color'] = defaultColors[i]
    return contourSets

## use go from discrete values to less discrete cornerstone camera coords
## coord = (spacing) * (index) + min


adjust = np.array([-1, -1, 1])
def affine_transform(point, aff): 
    new_point = nib.affines.apply_affine(aff, point)
    new_point = new_point * adjust
    return list(map(float, new_point))

def initContourSet(id):
    return {
            "data":[],
            "id": id,
        }
        