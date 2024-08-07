import {
    RenderingEngine,
    Enums,
    init as csInit,
    volumeLoader,
    setVolumesForViewports,
    getEnabledElements,
    getRenderingEngine,
  } from '@cornerstonejs/core';
import {
  init as csTools3dInit,
  StackScrollMouseWheelTool,
  ToolGroupManager,
  addTool,
  Enums as csToolsEnums, 
  SegmentationDisplayTool,
  segmentation,
  TrackballRotateTool,
  state as csToolState
}from '@cornerstonejs/tools';

import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';
import { defaultColors } from './colors';

const toolGroupId = "myToolGroup";
const toolGroup3DId = "3DToolGroup";
const renderingEngineId = "myRenderingEngine";

const DEFAULT_SEGMENTATION_CONFIG = {
  fillAlpha: 0.5,
  fillAlphaInactive: 0.5,
  outlineOpacity: 0,
  outlineOpacityInactive: 0,
  outlineWidth: 0,
  outlineWidthInactive: 0,
};

const toolGroupSpecificRepresentationConfig = {
  renderInactiveSegmentations: true,
  representations: {
    [csToolsEnums.SegmentationRepresentations.Labelmap]: DEFAULT_SEGMENTATION_CONFIG
  },
};




export async function renderVisualization(ref1, ref2, ref3, ref4, niftiURL, maskData){
  csTools3dInit();
  await csInit();

  ref1.current.oncontextmenu = (e) => e.preventDefault();
  ref2.current.oncontextmenu = (e) => e.preventDefault();
  ref3.current.oncontextmenu = (e) => e.preventDefault();
  ref4.current.oncontextmenu = (e) => e.preventDefault();

  
  addToolsToCornerstone();  
  const [toolGroup, toolGroup3D] = createToolGroups();

  toolGroup.addTool(StackScrollMouseWheelTool.toolName);
  toolGroup.addTool(SegmentationDisplayTool.toolName);

  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);

  toolGroup3D.addTool(TrackballRotateTool.toolName);
  toolGroup3D.addTool(StackScrollMouseWheelTool.toolName);

  toolGroup3D.setToolActive(TrackballRotateTool.toolName, {
    bindings: [
      {
        mouseButton: csToolsEnums.MouseBindings.Primary,
      },
    ],
  });
  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);


  volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);

  let renderingEngine = getRenderingEngine(renderingEngineId);
  console.log(renderingEngine);
  if (renderingEngine){
    renderingEngine.destroy();  
    renderingEngine = new RenderingEngine(renderingEngineId); 
  } else {
    renderingEngine = new RenderingEngine(renderingEngineId); 
  }
  
  
  const volumeId = 'nifti:' + niftiURL;

  await createAndRenderVolume(volumeId, renderingEngine, toolGroup, toolGroup3D, ref1, ref2, ref3, ref4); //async                                          //async
  await createAndRenderSegmentations(maskData);
  
}





async function createAndRenderVolume(volumeId, renderingEngine, toolGroup, toolGroup3D, ref1, ref2, ref3, ref4){
  const volume = await volumeLoader.createAndCacheVolume(volumeId);
  const viewportId1 = 'CT_NIFTI_AXIAL';
  const viewportId2 = 'CT_NIFTI_SAGITTAL';
  const viewportId3 = 'CT_NIFTI_CORONAL';
  const viewportId4 = 'CT_NIFTI_3DVOLUME'
  const viewportIds = [viewportId1, viewportId2, viewportId3, viewportId4];

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
        type: Enums.ViewportType.VOLUME_3D,
        element: ref4.current,
        defaultOptions: {
          orientation: Enums.OrientationAxis.SAGITTAL,
          background: [0.2, 0, 0.2]
        }
      },
    ];

  renderingEngine.setViewports(viewportInputArray);

  toolGroup.addViewport(viewportId1, renderingEngineId);
  toolGroup.addViewport(viewportId2, renderingEngineId);
  toolGroup.addViewport(viewportId3, renderingEngineId);
  toolGroup3D.addViewport(viewportId4, renderingEngineId);

  setVolumesForViewports(
      renderingEngine,
      [{ volumeId }],
      viewportIds
  );

  renderingEngine.render();
  console.log("volume rendered");
}



async function createAndRenderSegmentations(maskData){
  const segmentationInputArray = []
  const segRepInputArray = []
  const segmentationVols = []
  let i = 0;
  maskData.forEach((mask) => { 
    segmentation.state.removeSegmentation(mask.id);
    const volId = "nifti:" + mask.url;
    const vol = volumeLoader.createAndCacheVolume(volId);
    segmentationVols.push(vol);
    segmentationInputArray.push(
      {
        segmentationId: mask.id,
        representation: {
          type: csToolsEnums.SegmentationRepresentations.Labelmap,
          data:{
            volumeId: volId,
          },
        },
      },
    );
    segRepInputArray.push({
      segmentationId: mask.id,
      type: csToolsEnums.SegmentationRepresentations.Labelmap,
      options: {
        colorLUTOrIndex: [
          defaultColors[i],
          defaultColors[i],
        ],
      },
    });
    i++;
  });
  await Promise.all(segmentationVols)

  segmentation.addSegmentations(segmentationInputArray);
  // let segmentIndex = 1;
  // segmentationInputArray.forEach((seg) => {
  //   segmentation.segmentIndex.setActiveSegmentIndex(seg.segmentationId, segmentIndex);
  //   segmentIndex++;
  // })
  const segRepUIDs = 
  await segmentation.addSegmentationRepresentations(toolGroupId, segRepInputArray, toolGroupSpecificRepresentationConfig)

  
  
  console.log("labelmaps rendered");
}

function addToolsToCornerstone(){
  const addedTools = csToolState.tools;
  console.log(addedTools.StackScrollMouseWheel);
  if (!addedTools.StackScrollMouseWheel) addTool(StackScrollMouseWheelTool);
  if (!addedTools.SegmentationDisplay) addTool(SegmentationDisplayTool);
  if (!addedTools.TrackballRotate) addTool(TrackballRotateTool);
}

function createToolGroups(){
  ToolGroupManager.destroyToolGroup(toolGroupId);
  ToolGroupManager.destroyToolGroup(toolGroup3DId);
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
  const toolGroup3D = ToolGroupManager.createToolGroup(toolGroup3DId);
  return [toolGroup, toolGroup3D];
}

export const debug = async () => {
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
  console.log(csToolState);
}
