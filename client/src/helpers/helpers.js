import {
    RenderingEngine,
    Enums,
    init as csInit,
    volumeLoader,
    setVolumesForViewports,
  } from '@cornerstonejs/core';
import { init as csTools3dInit } from '@cornerstonejs/tools';
import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';

export async function setup(ref1, ref2, ref3, niftiURL){
    const viewportId1 = 'CT_NIFTI_AXIAL';
    const viewportId2 = 'CT_NIFTI_SAGITTAL';
    const viewportId3 = 'CT_NIFTI_CORONAL';

    volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);
    
    const volumeId = 'nifti:' + niftiURL;

    const volume = await volumeLoader.createAndCacheVolume(volumeId);

    const renderingEngineId = 'myRenderingEngine';
    const renderingEngine = new RenderingEngine(renderingEngineId);
    
    
    const viewportInputArray = [
        {
          viewportId: viewportId1,
          type: Enums.ViewportType.ORTHOGRAPHIC,
          element: ref1.current,
          defaultOptions: {
            orientation: Enums.OrientationAxis.AXIAL,
          },
        },
        {
          viewportId: viewportId2,
          type: Enums.ViewportType.ORTHOGRAPHIC,
          element: ref2.current,
          defaultOptions: {
            orientation: Enums.OrientationAxis.SAGITTAL,
          },
        },
        {
          viewportId: viewportId3,
          type: Enums.ViewportType.ORTHOGRAPHIC,
          element: ref3.current, 
          defaultOptions: {
            orientation: Enums.OrientationAxis.CORONAL,
          },
        },
      ];

    renderingEngine.setViewports(viewportInputArray);

    setVolumesForViewports(
        renderingEngine,
        [{ volumeId }],
        viewportInputArray.map((v) => v.viewportId)
    );

    renderingEngine.render();
}

export async function initializeCornerstone(){
  const initState = await csInit();
  await csTools3dInit()
  return initState;
}