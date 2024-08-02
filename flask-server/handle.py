import nibabel as nib
import matplotlib.pyplot as plt
from decimal import Decimal


path = 'nifti/aorta.nii.gz'
img = nib.load(path)
data = img.get_fdata()
print(data[:, :, 0].shape)