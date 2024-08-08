import React from 'react'
import { useEffect, useRef } from 'react';
import { Niivue, NVImage, SLICE_TYPE,  } from '@niivue/niivue';
import { NVcolorMaps } from '../../helpers/colors';


import './NiftiVolume3D.css';
const organs = ['aorta', 'gall_bladder', 'kidney_left', 'kidney_right', 'liver', 'pancreas', 'postcava', 'spleen', 'stomach'];
const colorMapNames = NVcolorMaps.map((map) => map.name);
console.log(colorMapNames);



function NiftiVolume3D({ maskFiles }) {
    const canvasRef = useRef(null);
    const nv = useRef(null);
    

    useEffect(() => {
        nv.current = new Niivue({
            sliceType: SLICE_TYPE.RENDER,
        });
        console.log(nv.current);
        nv.current.attachToCanvas(canvasRef.current);
        NVcolorMaps.forEach((map) => {
            nv.current.addColormap(map.name, map.cmap);
        })

        let i = -1;
        const NVimages = [];
        maskFiles.forEach(async (file) => {
            console.log(i);
            i = i + 1;
            const image = await NVImage.loadFromFile({
                file: file, 
                colormap: colorMapNames[i],
            });
            nv.current.addVolume(image);
            
        });

    }, []);

    const handleUpload = async (event) => {
        console.log('upload');
        const files = Array.from(event.target.files);

        
        
    }



    return (
        <div className="NiftiVolume3D">
            <div className="canvas">
                <canvas ref={canvasRef}>Canvas</canvas>
            </div>
        </div> 
        )}
        
export default NiftiVolume3D
