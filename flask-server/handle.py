import nibabel as nib
import matplotlib.pyplot as plt
from decimal import Decimal


path = 'nifti/aorta.nii.gz'
# path = 'files/As_fYUgNzHAl/MRHead.nii.gz'
img = nib.load(path)
print(img.affine)

