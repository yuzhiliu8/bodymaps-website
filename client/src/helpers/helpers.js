import {
    RenderingEngine,
    Enums,
    init as csInit,
    volumeLoader,
    setVolumesForViewports,
    getEnabledElements,
    getRenderingEngine,
    geometryLoader,
    getRenderingEngines,
  } from '@cornerstonejs/core';
import {
  init as csTools3dInit,
  ZoomTool,
  WindowLevelTool,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  addTool,
  Enums as csToolsEnums,  
  segmentation,
  state as csToolState
}from '@cornerstonejs/tools';

import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';

export async function render(ref1, ref2, ref3, niftiURL, renderingEngineId, toolGroupId){
  
  ref1.current.oncontextmenu = (e) => e.preventDefault();
  ref2.current.oncontextmenu = (e) => e.preventDefault();
  ref3.current.oncontextmenu = (e) => e.preventDefault();

  const viewportId1 = 'CT_NIFTI_AXIAL';
  const viewportId2 = 'CT_NIFTI_SAGITTAL';
  const viewportId3 = 'CT_NIFTI_CORONAL';
  
  const volumeId = 'nifti:' + niftiURL;
  const volume = await volumeLoader.createAndCacheVolume(volumeId);

  const renderingEngine = getRenderingEngine(renderingEngineId);
  const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);

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

  toolGroup.addViewport(viewportId1, renderingEngineId)
  toolGroup.addViewport(viewportId2, renderingEngineId)
  toolGroup.addViewport(viewportId3, renderingEngineId)

  setVolumesForViewports(
      renderingEngine,
      [{ volumeId }],
      viewportInputArray.map((v) => v.viewportId)
  );
  renderingEngine.getViewports().map((v) => {
    v.canvas.style.position = "relative";
  }) 
  
  renderingEngine.render()
}

export async function initializeCornerstone(){
  const initState = await csInit();
  await csTools3dInit()
  return initState;
}

export function createRenderingEngineAndRegisterVolumeLoader(){
  volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);
  const renderingEngineId = "myRenderingEngine";
  if (!getRenderingEngine(renderingEngineId)){
    const renderingEngine = new RenderingEngine(renderingEngineId);
  }
  return renderingEngineId;
}

export function createToolGroupAndAddTools(){
  const toolGroupId = "myToolGroup";
  ToolGroupManager.destroyToolGroup(toolGroupId);

  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  if (!csToolState.tools.Zoom){
    addTool(ZoomTool);
    addTool(WindowLevelTool);
    addTool(StackScrollMouseWheelTool);
  }
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(WindowLevelTool.toolName);
  toolGroup.addTool(StackScrollMouseWheelTool.toolName);
  
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
  return toolGroupId
}

export const debug = () => {
  console.log(getRenderingEngines())
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
  // console.log("SAGITTAL: ", sagittal_camera);
  // console.log("CORONAL: ", coronal_camera);
  // console.log("AXIAL: ", axial_imageData);
  // console.log("SAGITTAL: ", sagittal_imageData);
  // console.log("CORONAL: ", coronal_imageData);
  const segmentationData = fetch('/api/segmentations')
  .then((response) => response.json())
  .then((data) => console.log(data))

}