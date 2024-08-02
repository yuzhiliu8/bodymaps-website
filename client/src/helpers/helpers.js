import {
    RenderingEngine,
    Enums,
    init as csInit,
    volumeLoader,
    setVolumesForViewports,
    getEnabledElements,
  } from '@cornerstonejs/core';
import {
  init as csTools3dInit,
  ZoomTool,
  WindowLevelTool,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  addTool,
  Enums as csToolsEnums
}from '@cornerstonejs/tools';

import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';

export async function setup(ref1, ref2, ref3, ref4, niftiURL){
  await csTools3dInit()
  ref1.current.oncontextmenu = (e) => e.preventDefault();
  ref2.current.oncontextmenu = (e) => e.preventDefault();
  ref3.current.oncontextmenu = (e) => e.preventDefault();
  ref4.current.oncontextmenu = (e) => e.preventDefault();


  const viewportId1 = 'CT_NIFTI_AXIAL';
  const viewportId2 = 'CT_NIFTI_SAGITTAL';
  const viewportId3 = 'CT_NIFTI_CORONAL';
  const viewportId4 = 'CT_NIFTI_ACQUISITION';

  volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);
  
  const volumeId = 'nifti:' + niftiURL;
  const volume = await volumeLoader.createAndCacheVolume(volumeId);
  // volume.origin = [400, 400, 100];

  const renderingEngineId = 'myRenderingEngine';
  const renderingEngine = new RenderingEngine(renderingEngineId);

  const toolGroupId = "myToolGroup";
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

  addTool(ZoomTool);
  addTool(WindowLevelTool);
  addTool(StackScrollMouseWheelTool)

  toolGroup.addTool(ZoomTool.toolName)
  toolGroup.addTool(WindowLevelTool.toolName)
  toolGroup.addTool(StackScrollMouseWheelTool.toolName)
  toolGroup.addViewport(viewportId1, renderingEngineId)
  toolGroup.addViewport(viewportId2, renderingEngineId)
  toolGroup.addViewport(viewportId3, renderingEngineId)
  toolGroup.addViewport(viewportId4, renderingEngineId)

  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  toolGroup.setToolActive(WindowLevelTool.toolName, {
    bindings: [
      {
        mouseButton: csToolsEnums.MouseBindings.Primary, // Left Click
      },
    ],
  });

  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: csToolsEnums.MouseBindings.Secondary, // Right Click
      },
    ],
  });
  
  
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
      {
        viewportId: viewportId4,
        type: Enums.ViewportType.ORTHOGRAPHIC,
        element: ref4.current,
        defaultOptions:{
          orientation: Enums.OrientationAxis.ACQUISITION
        },
      }
    ];

  renderingEngine.setViewports(viewportInputArray);

  setVolumesForViewports(
      renderingEngine,
      [{ volumeId }],
      viewportInputArray.map((v) => v.viewportId)
  );
  renderingEngine.getViewports().map((v) => {
    v.canvas.style.position = "relative";
  })

  renderingEngine.render()
  
  
  
  // vp1.resize()

  return [renderingEngine, volume];
}

export async function initializeCornerstone(){
  const initState = await csInit();
  await csTools3dInit()
  return initState;
}

export const debug = () => {
  const axial_viewport = getEnabledElements()[0].viewport;
  const axial_camera = axial_viewport.getCamera();
  const axial_imageData = axial_viewport.getImageData();
  // console.log(getEnabledElements())
  
  const sagittal_viewport = getEnabledElements()[1].viewport;
  const sagittal_camera = sagittal_viewport.getCamera();
  const sagittal_imageData = sagittal_viewport.getImageData();

  const coronal_viewport = getEnabledElements()[2].viewport;
  const coronal_camera = coronal_viewport.getCamera();
  const coronal_imageData = coronal_viewport.getImageData();

  console.log("AXIAL: ", axial_camera);
  console.log("SAGITTAL: ", sagittal_camera);
  console.log("CORONAL: ", coronal_camera);
  // console.log("AXIAL: ", axial_imageData);
  // console.log("SAGITTAL: ", sagittal_imageData);
  // console.log("CORONAL: ", coronal_imageData);
}