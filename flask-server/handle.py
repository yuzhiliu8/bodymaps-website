import nibabel as nib
import requests
#https://ohif-assets.s3.us-east-2.amazonaws.com/nifti/MRHead.nii.gz
#https://settling-prawn-daily.ngrok-free.app/api/download

# response = requests.get("https://ohif-assets.s3.us-east-2.amazonaws.com/nifti/MRHead.nii.gz")
# print(response.headers)
# print(type(response.content))


response = requests.get("https://settling-prawn-daily.ngrok-free.app/api/download/ct.nii.gz")
print(response.headers)
print(response.content)


    

