import React from 'react'
import { useEffect } from 'react'
import * as niftiReader from 'nifti-reader-js';
import { imageLoader, init } from '@cornerstonejs/core';
import { createNiftiImageIdsAndCacheMetadata, cornerstoneNiftiImageLoader } from '@cornerstonejs/nifti-volume-loader';

function Test() {

    useEffect(() => {

        const setup = async () => {
            init();


            fetch('http://localhost:5000/bodymaps/api/get-main-nifti/7574e4e947ba31e08ae526b62d6b95628e9a1150886cadbdc905e26fb4984bbb')
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => {
                console.log(arrayBuffer.byteLength);
                // console.log(niftiReader)
                console.log(niftiReader.isNIFTI(arrayBuffer));
            });
    
            imageLoader.registerImageLoader('nifti', cornerstoneNiftiImageLoader);
            // console.log(sessionKey);
            const imageIds = await createNiftiImageIdsAndCacheMetadata({ url: "nifti:http://localhost:5000/bodymaps/api/get-main-nifti/7574e4e947ba31e08ae526b62d6b95628e9a1150886cadbdc905e26fb4984bbb" });
            // const imageIds = await createNiftiImageIdsAndCacheMetadata({ url:  "https://ohif-assets.s3.us-east-2.amazonaws.com/nifti/CTACardio.nii.gz"});
            console.log(imageIds)
      
        };
        setup();
        })



    return (
        <div>Test</div>
    )
}

export default Test