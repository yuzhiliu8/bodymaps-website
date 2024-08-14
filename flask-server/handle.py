import nibabel as nib
import numpy as np
import cv2 as cv
organ_ids = ['aorta', 'gall_bladder', 'kidney_left', 'kidney_right', 'liver', 'pancreas', 'postcava', 'spleen', 'stomach']

def isComplete(img_data):
    print(cv)
    return True


def processMasks(serverDir):
    data = {}
    ct = nib.load(f'{serverDir}/ct.nii.gz').get_fdata()
    for id in organ_ids:
        data[id] = {}
        img = nib.load(f'{serverDir}/segmentations/{id}.nii.gz')
        img_data = img.get_fdata()
        if (isComplete(img_data)):
            voxel_dims = img.header.get_zooms()
            voxel_volume = voxel_dims[0] * voxel_dims[1] * voxel_dims[2]
            num_voxels = len(data[data > 0])
            volume_cm = round(float(num_voxels * voxel_volume/1000), 2)
            data[id]['volume_cm'] = volume_cm
        else:
            data[id]['volume_cm'] = 'incomplete organ'
        
        hu_values = ct[img_data > 0]
        mean_hu = round(float(np.mean(hu_values)), 2)
        data[id]['mean_hu'] = mean_hu
    return data


def test():
    ct = nib.load('dev/ct.nii.gz').get_fdata()
    mask = nib.load('dev/segmentations/aorta.nii.gz')
    data = mask.get_fdata()
    print(nib.imagestats.count_nonzero_voxels(mask))
    num_voxels = len(data[data > 0])
    print(num_voxels)
    
test()