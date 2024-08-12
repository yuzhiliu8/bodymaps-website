import React from 'react'
import { useEffect, useRef } from 'react';
import { Niivue, NVImage, SLICE_TYPE,  } from '@niivue/niivue';
import { NVcolorMaps } from '../../helpers/constants';


import './NiftiVolume3D.css';
const organs = ['aorta', 'gall_bladder', 'kidney_left', 'kidney_right', 'liver', 'pancreas', 'postcava', 'spleen', 'stomach'];
const colorMapNames = NVcolorMaps.map((map) => map.name);
console.log(colorMapNames);



function NiftiVolume3D({ maskFiles }) {
    const canvasRef = useRef(null);
    const nv = useRef(null);
    

    useEffect(() => {
        if (maskFiles){
            nv.current = new Niivue({
                sliceType: SLICE_TYPE.RENDER,
            });
            console.log(nv.current);
            nv.current.attachToCanvas(canvasRef.current);
            NVcolorMaps.forEach((map) => {
                nv.current.addColormap(map.name, map.cmap);
            })
    
            let i = -1;
            maskFiles.forEach(async (file) => {
                console.log(i);
                i = i + 1;
                const image = await NVImage.loadFromFile({
                    file: file, 
                    colormap: colorMapNames[i],
                });
                nv.current.addVolume(image);
                
            });
        }
    }, [maskFiles]);

    return (
        <div className="NiftiVolume3D">
            <div className="canvas">
                <canvas ref={canvasRef}>Canvas</canvas>
            </div>
        </div> 
        )}
        
export default NiftiVolume3D
