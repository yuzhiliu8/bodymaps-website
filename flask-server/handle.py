import nibabel as nib
import numpy as np
from constants import main_nifti_filename, organ_ids_volumeNA, EROSION_PIXELS
from utils import removeFileExt
import scipy.ndimage as ndimage
import os

# ****** CONSTANTS ********
DECIMAL_PRECISION_VOLUME = 2
DECIMAL_PRECISION_HU = 1

cube_len = (2 * EROSION_PIXELS) + 1
STRUCTURING_ELEMENT = np.ones([cube_len, cube_len, cube_len], dtype=bool)

def voxelThreshold(slice):
    num_voxels = len(slice[slice > 0])
    return num_voxels < 100

def getCalcVolumeState(img_data, organ):
    if organ in organ_ids_volumeNA:
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
    ct = nib.load(os.path.join('sessions', sessionKey, main_nifti_filename)).get_fdata()
    organ_ids = os.listdir(os.path.join('sessions', sessionKey, 'segmentations'))
    print(organ_ids)
    for i in range(len(organ_ids)):
        organ_data = {}
        organ_data['id'] = removeFileExt(organ_ids[i])
        img = nib.load(os.path.join('sessions', sessionKey, 'segmentations', organ_ids[i]))
        img_data = img.get_fdata()
        state = getCalcVolumeState(img_data, organ_ids[i])
        if state == "complete":
            volume_cm = round(float(nib.imagestats.mask_volume(img)/1000), DECIMAL_PRECISION_VOLUME)
            organ_data['volume_cm'] = volume_cm
        elif state == "incomplete":
            organ_data['volume_cm'] = "Incomplete organ"
        elif state == "NA":
            organ_data['volume_cm'] = "N/A"
        
        erosion_data = ndimage.binary_erosion(img_data, structure=STRUCTURING_ELEMENT)
        hu_values = ct[erosion_data > 0]
        if len(hu_values) == 0:
            organ_data['mean_hu'] = 'N/A'
        else:
            mean_hu = round(float(np.mean(hu_values)), DECIMAL_PRECISION_HU)
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