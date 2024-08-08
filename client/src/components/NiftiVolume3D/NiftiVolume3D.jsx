import React from 'react'
import { useEffect, useRef } from 'react';
import { Niivue, NVImage, SHOW_RENDER, SLICE_TYPE, colortables } from '@niivue/niivue';


import './NiftiVolume3D.css';

const organs = ['aorta', 'gall_bladder', 'kidney_left', 'kidney_right', 'liver', 'pancreas', 'postcava', 'spleen', 'stomach'];



function NiftiVolume3D() {
    const canvasRef = useRef(null);
    const nv = useRef(null);
    
    let cmap = {
        R: [0, 255],
        G: [0, 0],
        B: [0, 255],
    };

    useEffect(() => {
        nv.current = new Niivue({
            sliceType: SLICE_TYPE.RENDER,
        });
        console.log(nv.current);
        nv.current.attachToCanvas(canvasRef.current);
        nv.current.addColormap('a', cmap);

        // organs.forEach((organ) => {
        //     const url = `/api/download/files||${organ}.nii.gz`;
        //     nv.current.addVolumeFromUrl({
        //         url: url,
        //         rgba255: [178, 34, 34, 255],
        //         key: "panc",
        //     });
        // });
    }, []);

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        const nvimage = await NVImage.loadFromFile({
            file: file, 
            colormap: 'a',
        });
        await nv.current.addVolume(nvimage);
        
    }



    return (
        <div className="NiftiVolume3D">
            <div>NiftiMesh</div>
            <div className="canvas">
                <canvas ref={canvasRef}>Canvas</canvas>
            </div>
            
            <input type="file" onChange={handleUpload}/>
        </div>
    )
    
}

export default NiftiVolume3D