import {
    RenderingEngine,
    Enums,
    init as csInit,
    volumeLoader,
    setVolumesForViewports,
    getEnabledElements,
    getRenderingEngine,
    CONSTANTS,
    cache
  } from '@cornerstonejs/core';
import {
  init as csTools3dInit,
  StackScrollMouseWheelTool,
  ZoomTool,
  PanTool,
  ToolGroupManager,
  addTool,
  Enums as csToolsEnums, 
  SegmentationDisplayTool,
  segmentation,
  state as csToolState
}from '@cornerstonejs/tools';

import { cornerstoneNiftiImageVolumeLoader } from '@cornerstonejs/nifti-volume-loader';
import { APP_CONSTANTS } from './constants';

const toolGroupId = "myToolGroup";
const renderingEngineId = "myRenderingEngine";
const segmentationId = "combined_labels";

const DEFAULT_SEGMENTATION_CONFIG = {
  fillAlpha: APP_CONSTANTS.DEFAULT_SEGMENTATION_OPACITY,
  fillAlphaInactive: APP_CONSTANTS.DEFAULT_SEGMENTATION_OPACITY,
  outlineOpacity: 1,
  outlineWidth: 1,
  renderOutline: false,
  
};

const toolGroupSpecificRepresentationConfig = {
  renderInactiveSegmentations: true,
  representations: {
    [csToolsEnums.SegmentationRepresentations.Labelmap]: DEFAULT_SEGMENTATION_CONFIG
  },
};

export async function renderVisualization(ref1, ref2, ref3, sessionKey){
  cache.purgeCache();
  csTools3dInit();
  await csInit();

  ref1.current.oncontextmenu = (e) => e.preventDefault();
  ref2.current.oncontextmenu = (e) => e.preventDefault();
  ref3.current.oncontextmenu = (e) => e.preventDefault();
  
  const toolGroup = createToolGroup();
  volumeLoader.registerVolumeLoader('nifti', cornerstoneNiftiImageVolumeLoader);
  const renderingEngine = createRenderingEngine();

  const mainNiftiURL = `${APP_CONSTANTS.API_ORIGIN}/api/get-main-nifti/${sessionKey}`;
  const volumeId = 'nifti:' + mainNiftiURL;

  const viewportId1 = 'CT_NIFTI_AXIAL';
  const viewportId2 = 'CT_NIFTI_SAGITTAL';
  const viewportId3 = 'CT_NIFTI_CORONAL';
  
  const volume = await volumeLoader.createAndCacheVolume(volumeId);
  
  const segmentationURL = `${APP_CONSTANTS.API_ORIGIN}/api/get-segmentations/${sessionKey}`;
  const combined_labels_Id = 'nifti:' + segmentationURL;
  const combined_labels = await volumeLoader.createAndCacheVolume(combined_labels_Id);


  const colorLUT = [];
  // Fill the colorLUT array with your custom colors
  Object.keys(APP_CONSTANTS.cornerstoneCustomColorLUT).forEach(value => {
    colorLUT[value] = APP_CONSTANTS.cornerstoneCustomColorLUT[value];
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

  segmentation.state.removeSegmentation(segmentationId);
  segmentation.addSegmentations([{
    segmentationId: segmentationId, 
    representation: {
      type: csToolsEnums.SegmentationRepresentations.Labelmap,
      data:{
        volumeId: combined_labels_Id,
      },
    },
  }]);
  const segRepUIDs = await segmentation.addSegmentationRepresentations(
    toolGroupId, 
    [{
      segmentationId: segmentationId, 
      type: csToolsEnums.SegmentationRepresentations.Labelmap,
      options: {
        colorLUTOrIndex: colorLUT,
      }, 
    }],toolGroupSpecificRepresentationConfig );
  console.log("labelmaps rendered");
  return segRepUIDs;
}



function addToolsToCornerstone(){
  const addedTools = csToolState.tools;
  console.log(addedTools);
  if (!addedTools.StackScrollMouseWheel) addTool(StackScrollMouseWheelTool);
  if (!addedTools.SegmentationDisplay) addTool(SegmentationDisplayTool);
  if (!addedTools.Zoom) addTool(ZoomTool);
  if (!addedTools.Pan) addTool(PanTool);
}

function createToolGroup(){
  addToolsToCornerstone();
  ToolGroupManager.destroyToolGroup(toolGroupId);
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

  toolGroup.addTool(StackScrollMouseWheelTool.toolName);
  toolGroup.addTool(SegmentationDisplayTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(PanTool.toolName);

  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);

  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [{mouseButton: csToolsEnums.MouseBindings.Primary}],
  });

  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [{ mouseButton: csToolsEnums.MouseBindings.Secondary}],
  });
  return toolGroup;
} 

function createRenderingEngine(){
  let renderingEngine = getRenderingEngine(renderingEngineId);
  if (renderingEngine){
    renderingEngine.destroy();  
    renderingEngine = new RenderingEngine(renderingEngineId); 
  } else {
    renderingEngine = new RenderingEngine(renderingEngineId); 
  }
  return renderingEngine;
}

export function setVisibilities(segRepUIDs, checkState){
  const uid = segRepUIDs[0];
  for (let i = 1; i < checkState.length; i++){
    segmentation.config.visibility.setSegmentVisibility(toolGroupId, uid, i, checkState[i]);
  }
};


export function setToolGroupOpacity(opacityValue){
  const newSegConfig = { ...DEFAULT_SEGMENTATION_CONFIG };
  newSegConfig.fillAlpha = opacityValue;
  newSegConfig.fillAlphaInactive = opacityValue;
  newSegConfig.outlineOpacity = opacityValue;
  newSegConfig.outlineOpacityInactive = opacityValue;

  const newToolGroupConfig = {
    renderInactiveSegmentations: true,
    representations: {
      [csToolsEnums.SegmentationRepresentations.Labelmap]: newSegConfig
    },
  };

  segmentation.config.setToolGroupSpecificConfig(toolGroupId, newToolGroupConfig);
}
