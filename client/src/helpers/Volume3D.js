import { Niivue, NVImage, SLICE_TYPE,  } from '@niivue/niivue';
import { NVcolorMaps } from './constants';


const colorMapNames = NVcolorMaps.map((map) => map.name);

export function create3DVolume(canvasRef, maskFiles){
    const nv = new Niivue({
        sliceType: SLICE_TYPE.RENDER,
    });
    nv.attachToCanvas(canvasRef.current);
    NVcolorMaps.forEach((map) => {
        nv.addColormap(map.name, map.cmap);
    })

    let i = -1;
    maskFiles.forEach(async (file) => {
        console.log(i);
        i = i + 1;
        const image = await NVImage.loadFromFile({
            file: file, 
            colormap: colorMapNames[i],
        });
        nv.addVolume(image);
        
    });
    return nv;
}

export function updateOpacities(nv, checkState){
    if (nv && checkState){
        for (let i = 1; i < checkState.length; i++){ //start at 1 bc only checking segmentations
            nv.volumes[i-1].opacity = checkState[i]; 
        }
        nv.updateGLVolume();
    }
    
}


    
