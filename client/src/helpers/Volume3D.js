import { Niivue, NVImage, SLICE_TYPE,  } from '@niivue/niivue';
import { NVcolorMaps, organ_ids, API_ORIGIN } from './constants';


const colorMapNames = NVcolorMaps.map((map) => map.name);

const nv = new Niivue({
    sliceType: SLICE_TYPE.RENDER,
});
console.log('niivue created');

NVcolorMaps.forEach((map) => {
    nv.addColormap(map.name, map.cmap);
})

export async function create3DVolume(canvasRef, serverDir){
    if (nv.volumes.length > 0){
        for (let i = 0; i < nv.volumes.length; i++){
            nv.removeVolume[i]; 
        }
    }
    nv.attachToCanvas(canvasRef.current);
    let i = -1;
    const ids = [...organ_ids];
    const promises = ids.map((id) => {
        i++;
        const image = NVImage.loadFromUrl({ 
            url: `${API_ORIGIN}/api/download/${serverDir}||segmentations||${id}.nii.gz`,
            colormap: colorMapNames[i],
        });
        return image;
    });
    for (const promise of promises) {
        const image = await promise;
        nv.addVolume(image);
    }
    return nv;
}

export function updateOpacities(nv, checkState){
    if (nv.volumes && checkState){
        for (let i = 1; i < checkState.length; i++){ //start at 1 bc only checking segmentations
            // console.log(nv.volumes[i-1])
            nv.volumes[i-1].opacity = checkState[i]; 
        }
        nv.updateGLVolume();
    }
    
}


    
