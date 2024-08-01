import nibabel as nib
import matplotlib.pyplot as plt
import numpy as np
from decimal import Decimal
import time

path = 'nifti/ct.nii.gz'
img = nib.load(path)
data = img.get_fdata()

def visualize(data):
    x = data.shape[0] // 2
    # x = 0
    y = data.shape[1] // 2
    # z = data.shape[2] // 2
    z = 0


    # Create a figure with three subplots
    fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(15, 5))

    # Display the middle slices
    # ax1.imshow(data[x , :, :], cmap='gray')
    # ax1.set_title(f'Sagittal View: Slice {x} of {data.shape[0]}')
    # ax1.axis('off')

    # ax2.imshow(data[:, y, :], cmap='gray')
    # ax2.set_title(f'Coronal View: Slice {y} of {data.shape[1]}')
    # ax2.axis('off')

    plt.ion()

    for z in range(data.shape[2]):
        ax3.imshow(data[:, :, z], cmap='gray')
        ax3.set_title(f'Axial View: Slice {z} of {data.shape[2]}')
        ax3.axis('off')

        # plt.tight_layout()
        plt.draw()
        plt.pause(1)
        plt.clf()
    
    plt.ioff()
    plt.show()


def save_as_text(data, output_path):
    """
    Save the data as a string in a text file.
    
    :param data: 3D numpy array of image data
    :param output_path: Path to save the text file
    """
    with open(output_path, 'w') as f:
        # Write shape information
        f.write(f"Shape: {data.shape}\n\n")
        
        # Write data values
        for i in range(data.shape[0]):
            f.write(f"Slice {i}:\n")
            np.savetxt(f, data[i], fmt='%.2f', delimiter=', ')
            f.write('\n')
    
    print(f"Data saved as text to {output_path}")

# save_as_text(data, 'data.txt')
visualize(data)