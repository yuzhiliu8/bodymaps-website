import { Niivue, NVImage, SLICE_TYPE } from '@niivue/niivue';
import { APP_CONSTANTS } from './constants';


const nv = new Niivue({
    sliceType: SLICE_TYPE.RENDER,
});
console.log('niivue created');




export async function create3DVolume(canvasRef, clabelId){
    console.log(nv.volumes);
    if (nv.volumes.length > 0){  //remove existing volumes
        for (let i = 0; i < nv.volumes.length; i++){
            nv.removeVolume[i]; 
        }
   }
    nv.attachToCanvas(canvasRef.current);
    const nvImage = await NVImage.loadFromUrl({
        name: "combined_labels.nii.gz", //Make not harded coded, plz
        url: `${APP_CONSTANTS.API_ORIGIN}/api/get-segmentations/${clabelId}`
    });
    nvImage.setColormapLabel(APP_CONSTANTS.NVColormap)
    nv.addVolume(nvImage);
    nvImage.setColormapLabel({
        R: [30, 230, 0, 128, 170, 128, 0, 145, 240, 50],
        G: [0, 25, 130, 0, 110, 128, 128, 30, 50, 205],
        B: [0, 75, 200, 0, 40, 0, 128, 180, 230, 50],
        A: [0, 128, 128, 128, 128, 0, 128, 128, 128, 128, 128],
        I: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
});
    //nv.updateGLVolume();
    
    
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
    if (!(nv.volumes && checkState)) return;
    const nvImage = nv.volumes[0];

    if (checkState[0] === true){
        nvImage.setColormapLabel(APP_CONSTANTS.NVColormap); 
        nv.updateGLVolume();
        return;
    }
    //else ... 
    const cmapCopy = structuredClone(APP_CONSTANTS.NVColormap);
    for (let i = 1; i < checkState.length; i++){
        if (checkState[i] === false){
            cmapCopy.A[i] = 0;
        } 
        else {
            cmapCopy.A[i] = APP_CONSTANTS.NVCmapAlpha;
        }
    }
    nvImage.setColormapLabel(cmapCopy);
    nv.updateGLVolume();
}

export function updateGeneralOpacity(canvasRef, opacityValue){ //for all volumes, continuous opacity values
    canvasRef.current.style.opacity = opacityValue;
}
    
