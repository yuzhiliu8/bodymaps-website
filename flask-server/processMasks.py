import cv2 as cv
import nibabel as nib
import matplotlib.pyplot as plt
import numpy as np
import os

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
    aff = volumes[0].affine #aff should be the same for all masks
    shape = volumes[0].shape

    axial_aorta = initContourSet(id="axial_aorta")
    axial_liver = initContourSet(id="axial_liver")
    #AXIAL ORIENTATION (Z axis)
    Z_INDEX_RANGE = shape[2]
    for Z in range(Z_INDEX_RANGE):  #AORTA ONLY FOR NOW
        for i in range(len(organs)):
            organ_slice = f_datas[i][:, :, Z]
            organ_slice = cv.normalize(organ_slice, None, 0, 255, cv.NORM_MINMAX, cv.CV_8U)
            organ_slice_contours, _ = cv.findContours(organ_slice, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
            for contour in organ_slice_contours:
                slice_data = {}
                points = []
                for point in contour:
                    X, Y = map(int, point[0])
                    point = affine_transform([Y, X, Z], aff)
                    points.append(point)
                slice_data['points'] = points
                slice_data['type'] = "CLOSED_PLANAR"
                contourSets['axial'][i]['data'].append(slice_data)
    #     aorta_slice = aorta_data[:, :, Z]
    #     liver_slice = liver_data[:, :, Z]

    #     aorta_slice = cv.normalize(aorta_slice, None, 0, 255, cv.NORM_MINMAX, cv.CV_8U) #normalize slice to CV_8U
    #     liver_slice = cv.normalize(liver_slice, None, 0, 255, cv.NORM_MINMAX, cv.CV_8U) 

    #     aorta_slice_contours, _ = cv.findContours(aorta_slice, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
    #     liver_slice_contours, _ = cv.findContours(liver_slice, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
    #     for contour in aorta_slice_contours:
    #         slice_data = {}
    #         points = []
    #         for point in contour:
    #             X, Y = map(int, point[0])
    #             point = affine_transform([Y, X, Z], aff)    #swap x, y bc cv reads shape in as (height, width)
    #             points.append(point)
    #         slice_data['points'] = points
    #         slice_data['type'] = 'CLOSED_PLANAR'
    #         axial_aorta["data"].append(slice_data)
    #     for contour in liver_slice_contours:
    #         slice_data = {}
    #         points = []
    #         for point in contour:
    #             X, Y = map(int, point[0])
    #             point = affine_transform([Y, X, Z], aff)
    #             points.append(point)
    #         slice_data['points'] = points
    #         slice_data['type'] = 'CLOSED_PLANAR'
    #         axial_liver["data"].append(slice_data)
    
    # contourSets['axial'].append(axial_aorta)
    # contourSets['axial'].append(axial_liver)
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
        