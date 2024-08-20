import nibabel as nib
import numpy as np
from constants import organ_ids, reportScreenNames

def voxelThreshold(slice):
    num_voxels = len(slice[slice > 0])
    return num_voxels < 100

def isComplete(img_data):
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
            return False
    return True


def processMasks(serverDir):
    data = {"data": []}
    ct = nib.load(f'{serverDir}/ct.nii.gz').get_fdata()
    for i in range(len(organ_ids)):
        organ_data = {}
        organ_data['id'] = reportScreenNames[i]
        img = nib.load(f'{serverDir}/segmentations/{organ_ids[i]}.nii.gz')
        img_data = img.get_fdata()
        if (isComplete(img_data)):
            volume_cm = round(float(nib.imagestats.mask_volume(img)/1000), 2)
            organ_data['volume_cm'] = volume_cm
        else:
            organ_data['volume_cm'] = 'incomplete organ'
        
        hu_values = ct[img_data > 0]
        mean_hu = round(float(np.mean(hu_values)), 2)
        organ_data['mean_hu'] = mean_hu
        data['data'].append(organ_data)
        
    return data


def test():
    for organ in organ_ids:
        mask = nib.load(f'dev/segmentations/{organ}.nii.gz').get_fdata()
        for i in range(mask.shape[2]):
            slice = mask[:, :, i]
            length = len(slice[slice > 0])
            if length > 0:
                print(organ)
                print('num voxels: ', length)
                break
        for i in range(mask.shape[2]-1, -1, -1):
            slice = mask[:, :, i]
            length = len(slice[slice > 0])
            if length > 0:
                print(organ)
                print('num voxels: ', length)
                break
        for i in range(mask.shape[0]):
            slice = mask[i, :, :]
            length = len(slice[slice > 0])
            if length > 0:
                print(organ)
                print('num voxels: ', length)
                break
        for i in range(mask.shape[0]-1, -1, -1):
            slice = mask[i, :, :]
            length = len(slice[slice > 0])
            if length > 0:
                print(organ)
                print('num voxels: ', length)
                break
        for i in range(mask.shape[1]):
            slice = mask[:, i, :]
            length = len(slice[slice > 0])
            if length > 0:
                print(organ)
                print('num voxels: ', length)
                break
        for i in range(mask.shape[1]-1, -1, -1):
            slice = mask[:, i, :]
            length = len(slice[slice > 0])
            if length > 0:
                print(organ)
                print('num voxels: ', length)
                break

# test()