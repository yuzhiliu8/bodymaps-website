import nibabel as nib
import numpy as np
from constants import Constants
from utils import removeFileExt
import scipy.ndimage as ndimage

import os





# def combine_labels(files, session_key):
#     filenames = list(files.keys())
#     filenames.remove('MAIN_NIFTI')
#     base = os.path.join('sessions', session_key) #base dir path 
#     os.makedirs(os.path.join(base, 'segmentations'))
#     main_nifti = files['MAIN_NIFTI']
#     main_nifti.save(os.path.join(base, main_nifti_filename))
#     print(filenames)
#     aorta = files['aorta.nii.gz']
#     nib.Nifti1Image.from_bytes(aorta.read())
#     return 

def voxelThreshold(slice):
    num_voxels = len(slice[slice > 0])
    return num_voxels < Constants.VOXEL_THRESHOLD

def getCalcVolumeState(img_data, organ):
    if organ in Constants.organ_ids_volumeNA:
        return "NA" # blood vessel, volume is NA
    slices = [
        img_data[:, :, 0],
        img_data[:, :, -1],
        img_data[0, :, :],
        img_data[-1, :, :],
        img_data[:, 0, :],
        img_data[:, -1, :],
    ]
    for slice in slices:
        if voxelThreshold(slice) is False:
            return "incomplete"
    return "complete"


def processMasks(sessionKey):
    data = {"data": []}
    ct = nib.load(os.path.join('sessions', sessionKey, Constants.main_nifti_filename)).get_fdata()
    organ_ids = os.listdir(os.path.join('sessions', sessionKey, 'segmentations'))
    print(organ_ids)
    for i in range(len(organ_ids)):
        organ_data = {}
        organ_data['id'] = removeFileExt(organ_ids[i])
        img = nib.load(os.path.join('sessions', sessionKey, 'segmentations', organ_ids[i]))
        img_data = img.get_fdata()
        state = getCalcVolumeState(img_data, organ_ids[i])
        if state == "complete":
            volume_cm = round(float(nib.imagestats.mask_volume(img)/1000), Constants.DECIMAL_PRECISION_VOLUME)
            organ_data['volume_cm'] = volume_cm
        elif state == "incomplete":
            organ_data['volume_cm'] = "Incomplete organ"
        elif state == "NA":
            organ_data['volume_cm'] = "N/A"
        
        erosion_data = ndimage.binary_erosion(img_data, structure=Constants.STRUCTURING_ELEMENT)
        hu_values = ct[erosion_data > 0]
        if len(hu_values) == 0:
            organ_data['mean_hu'] = 'N/A'
        else:
            mean_hu = round(float(np.mean(hu_values)), Constants.DECIMAL_PRECISION_HU)
            organ_data['mean_hu'] = mean_hu 

        data['data'].append(organ_data)

    return data


# def test():
#     for organ in organ_ids:
#         mask = nib.load(f'dev/segmentations/{organ}.nii.gz').get_fdata()
#         for i in range(mask.shape[2]):
#             slice = mask[:, :, i]
#             length = len(slice[slice > 0])
#             if length > 0:
#                 print(organ)
#                 print('num voxels: ', length)
#                 break
#         for i in range(mask.shape[2]-1, -1, -1):
#             slice = mask[:, :, i]
#             length = len(slice[slice > 0])
#             if length > 0:
#                 print(organ)
#                 print('num voxels: ', length)
#                 break
#         for i in range(mask.shape[0]):
#             slice = mask[i, :, :]
#             length = len(slice[slice > 0])
#             if length > 0:
#                 print(organ)
#                 print('num voxels: ', length)
#                 break
#         for i in range(mask.shape[0]-1, -1, -1):
#             slice = mask[i, :, :]
#             length = len(slice[slice > 0])
#             if length > 0:
#                 print(organ)
#                 print('num voxels: ', length)
#                 break
#         for i in range(mask.shape[1]):
#             slice = mask[:, i, :]
#             length = len(slice[slice > 0])
#             if length > 0:
#                 print(organ)
#                 print('num voxels: ', length)
#                 break
#         for i in range(mask.shape[1]-1, -1, -1):
#             slice = mask[:, i, :]
#             length = len(slice[slice > 0])
#             if length > 0:
#                 print(organ)
#                 print('num voxels: ', length)
#                 break

# test()