import {
    RenderingEngine,
    Enums,
    init as csInit,
    volumeLoader,
    setVolumesForViewports,
    getEnabledElements,
    getRenderingEngine,
    CONSTANTS
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
import { defaultColors } from './constants';

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




export async function renderVisualization(ref1, ref2, ref3, niftiURL, maskData){
  csTools3dInit();
  await csInit();

  ref1.current.oncontextmenu = (e) => e.preventDefault();
  ref2.current.oncontextmenu = (e) => e.preventDefault();
  ref3.current.oncontextmenu = (e) => e.preventDefault();

  
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
  if (renderingEngine){
    renderingEngine.destroy();  
    renderingEngine = new RenderingEngine(renderingEngineId); 
  } else {
    renderingEngine = new RenderingEngine(renderingEngineId); 
  }
  
  
  const volumeId = 'nifti:' + niftiURL;
  const viewportId1 = 'CT_NIFTI_AXIAL';
  const viewportId2 = 'CT_NIFTI_SAGITTAL';
  const viewportId3 = 'CT_NIFTI_CORONAL';

  const volume = await volumeLoader.createAndCacheVolume(volumeId);

  const segmentationInputArray = []
  const segRepInputArray = []
  const segmentationVols = []
  const segVolumeIds = []
  let i = 0;
  maskData.forEach((mask) => { 
    segmentation.state.removeSegmentation(mask.id);
    const segId = "nifti:" + mask.url;
    const vol = volumeLoader.createAndCacheVolume(segId);
    segmentationVols.push(vol);
    segVolumeIds.push({volumeId: segId});
    segmentationInputArray.push(
      {
        segmentationId: mask.id,
        representation: {
          type: csToolsEnums.SegmentationRepresentations.Labelmap,
          data:{
            volumeId: segId,
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
  await Promise.all(segmentationVols); 


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

  toolGroup.addViewport(viewportId1, renderingEngineId);
  toolGroup.addViewport(viewportId2, renderingEngineId);
  toolGroup.addViewport(viewportId3, renderingEngineId);

  setVolumesForViewports(
      renderingEngine,
      [{ volumeId }],
      [viewportId1, viewportId2, viewportId3]
  );



  renderingEngine.render();
  console.log("volume rendered");

  segmentation.addSegmentations(segmentationInputArray);
  const segRepUIDs = await segmentation.addSegmentationRepresentations(toolGroupId, segRepInputArray, toolGroupSpecificRepresentationConfig);
  console.log("labelmaps rendered");
  return segRepUIDs; 
}



function addToolsToCornerstone(){
  const addedTools = csToolState.tools;
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

const presetNames = CONSTANTS.VIEWPORT_PRESETS.map((preset) => preset.name);
let i = 0;
export const debug = async () => {
  // console.log(vtkColorMaps);
  const RE = getRenderingEngine('myRenderingEngine'); 
  const viewport = RE.getViewport('CT_NIFTI_3DVOLUME');
  console.log(viewport.getActors())
  
  
  viewport.setProperties({ preset: presetNames[i]}); 
  console.log(presetNames[i])
  // viewport.getProperties().voiRange = {lower: 0, upper: 1}
  console.log(viewport.getProperties());

  viewport.render();
  i++
}

export function setVisibilities(segRepUIDs, checkState){
  let i = 1;  
  segRepUIDs.forEach((segRepUID) => {
    segmentation.config.visibility.setSegmentVisibility(toolGroupId, segRepUID, 1, checkState[i]);
    i++;
  });
};