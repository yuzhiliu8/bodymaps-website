import { Niivue, NVImage, SLICE_TYPE,  } from '@niivue/niivue';
import { NVcolorMaps, organ_ids, API_ORIGIN } from './constants';


const colorMapNames = NVcolorMaps.map((map) => map.name);

export function create3DVolume(canvasRef, serverDir){
    const nv = new Niivue({
        sliceType: SLICE_TYPE.RENDER,
    });
    nv.attachToCanvas(canvasRef.current);
    NVcolorMaps.forEach((map) => {
        nv.addColormap(map.name, map.cmap);
    })

    let i = -1;
    organ_ids.forEach(async (id) => {
        i++;
        await nv.addVolumeFromUrl({ 
            url: `${API_ORIGIN}/api/download/${serverDir}||segmentations||${id}.nii.gz`,
            colormap: colorMapNames[i],
        });
        
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


    
