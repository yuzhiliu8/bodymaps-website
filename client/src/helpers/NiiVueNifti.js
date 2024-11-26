import { Niivue, NVImage, SLICE_TYPE } from '@niivue/niivue';
import { APP_CONSTANTS, NVColormap, NVcolorMaps } from './constants';


const nv = new Niivue({
    sliceType: SLICE_TYPE.RENDER,
});
console.log('niivue created');



nv.addColormap(APP_CONSTANTS.NVColormap.name, APP_CONSTANTS.NVColormap.cmap)

export async function create3DVolume(canvasRef, sessionKey){
    console.log(nv.volumes);
    if (nv.volumes.length > 0){  //remove existing volumes
        for (let i = 0; i < nv.volumes.length; i++){
            nv.removeVolume[i]; 
        }
    }
    nv.attachToCanvas(canvasRef.current);
    const nvImage = await NVImage.loadFromUrl({
        name: "combined_labels.nii.gz", //Make not harded coded, plz
        url: `${APP_CONSTANTS.API_ORIGIN}/api/download/${'combined_labels.nii.gz'}/${sessionKey}`,
        colormap: APP_CONSTANTS.NVColormap.name,
    });
    nv.addVolume(nvImage);
    
    
    // segmentationInfos.forEach(async (segInfo, i) => {
    //     const name = `${segInfo.volumeId}.nii.gz`
    //     const imageOptions = NVImageFromUrlOptions(name);
    //     imageOptions.buffer = segInfo.buffer;
    //     imageOptions.name = name;
    //     imageOptions.colormap = colorMapNames[i];
    //     await nv.addVolumeFromUrl(imageOptions);
    // })
    return nv;
}

export function updateVisibilities(nv, checkState){         //Visible or not visible, 0 or 1
    if (nv.volumes && checkState){
        for (let i = 1; i < checkState.length; i++){ //start at 1 bc only checking segmentations
            nv.volumes[i-1].opacity = checkState[i]; 
        }
        nv.updateGLVolume();
    }
}

export function updateGeneralOpacity(canvasRef, opacityValue){ //for all volumes, continuous opacity values
    canvasRef.current.style.opacity = opacityValue;
}
    
